-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER NOT NULL DEFAULT 0,
  cook_time INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT CHECK (difficulty IN ('سهل', 'متوسط', 'صعب')) DEFAULT 'سهل',
  category TEXT CHECK (category IN ('محشي', 'شوربة', 'طواجن', 'سهل وسريع', 'تحضير طويل')) DEFAULT 'سهل وسريع',
  servings INTEGER NOT NULL DEFAULT 1,
  estimated_cost INTEGER DEFAULT 0,
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  instructions TEXT[] NOT NULL DEFAULT '{}',
  alternatives JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for recipes
CREATE POLICY "Anyone can view public recipes" 
ON public.recipes 
FOR SELECT 
USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create recipes" 
ON public.recipes 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own recipes" 
ON public.recipes 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own recipes" 
ON public.recipes 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create recipe ratings table
CREATE TABLE public.recipe_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Enable RLS for ratings
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for ratings
CREATE POLICY "Anyone can view ratings" 
ON public.recipe_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create ratings" 
ON public.recipe_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.recipe_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.recipe_ratings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true);

-- Create storage policies for recipe images
CREATE POLICY "Recipe images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'recipe-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own recipe images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own recipe images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for automatic timestamp updates on recipes
CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on ratings
CREATE TRIGGER update_recipe_ratings_updated_at
BEFORE UPDATE ON public.recipe_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get average rating for a recipe
CREATE OR REPLACE FUNCTION public.get_recipe_average_rating(recipe_id UUID)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.recipe_ratings
    WHERE recipe_ratings.recipe_id = get_recipe_average_rating.recipe_id
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get total rating count for a recipe
CREATE OR REPLACE FUNCTION public.get_recipe_rating_count(recipe_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.recipe_ratings
    WHERE recipe_ratings.recipe_id = get_recipe_rating_count.recipe_id
  );
END;
$$ LANGUAGE plpgsql;