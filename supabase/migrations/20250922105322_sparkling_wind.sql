/*
  # إضافة ميزات الأدمن

  1. New Tables
    - `admin_users` - جدول المديرين
    - `recipe_moderation` - جدول مراجعة الوصفات
    
  2. Security
    - Enable RLS on new tables
    - Add policies for admin access
    
  3. Functions
    - Function to check admin status
    - Function to get pending recipes
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'super_admin')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Only admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Only super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Create recipe_moderation table
CREATE TABLE IF NOT EXISTS public.recipe_moderation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  moderator_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'pending_review')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipe_moderation ENABLE ROW LEVEL SECURITY;

-- Create policies for recipe_moderation
CREATE POLICY "Admins can view all moderation records" 
ON public.recipe_moderation 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can create moderation records" 
ON public.recipe_moderation 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ) AND moderator_id = auth.uid()
);

-- Add moderation status to recipes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'moderation_status'
  ) THEN
    ALTER TABLE public.recipes ADD COLUMN moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = is_admin.user_id
  );
END;
$$;

-- Create function to get pending recipes for admin
CREATE OR REPLACE FUNCTION public.get_pending_recipes()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  difficulty TEXT,
  category TEXT,
  servings INTEGER,
  estimated_cost INTEGER,
  ingredients TEXT[],
  instructions TEXT[],
  alternatives JSONB,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.description,
    r.image_url,
    r.prep_time,
    r.cook_time,
    r.difficulty,
    r.category,
    r.servings,
    r.estimated_cost,
    r.ingredients,
    r.instructions,
    r.alternatives,
    r.created_by,
    r.created_at
  FROM public.recipes r
  WHERE r.moderation_status = 'pending' OR (r.is_public = false AND r.moderation_status IS NULL)
  ORDER BY r.created_at DESC;
END;
$$;

-- Create trigger for automatic timestamp updates on admin tables
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (you can change this email)
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  '{"manage_recipes": true, "manage_users": true, "manage_featured": true}'::jsonb
FROM auth.users 
WHERE email = 'admin@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- Update existing recipes policies to include admin access
DROP POLICY IF EXISTS "Anyone can view public recipes" ON public.recipes;
CREATE POLICY "Anyone can view public recipes" 
ON public.recipes 
FOR SELECT 
USING (
  is_public = true 
  OR auth.uid() = created_by 
  OR public.is_admin()
);

-- Allow admins to update any recipe
CREATE POLICY "Admins can update any recipe" 
ON public.recipes 
FOR UPDATE 
USING (public.is_admin());

-- Allow admins to delete any recipe
CREATE POLICY "Admins can delete any recipe" 
ON public.recipes 
FOR DELETE 
USING (public.is_admin());