-- Create recipes table for Supabase
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('سهل', 'متوسط', 'صعب')),
  category TEXT NOT NULL CHECK (category IN ('محشي', 'شوربة', 'طواجن', 'سهل وسريع', 'تحضير طويل')),
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  description TEXT NOT NULL,
  servings INTEGER NOT NULL,
  estimated_cost INTEGER,
  alternatives JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING GIN(ingredients);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Recipes are viewable by everyone" ON recipes
  FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert recipes" ON recipes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update recipes" ON recipes
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete recipes" ON recipes
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample recipes
INSERT INTO recipes (id, name, image_url, prep_time, cook_time, difficulty, category, ingredients, instructions, description, servings, estimated_cost, alternatives) VALUES
('molokhia', 'ملوخية بالفراخ', '/assets/molokhia.jpg', 15, 45, 'متوسط', 'شوربة', 
 ARRAY['فراخ مقطعة', 'ملوخية مفرومة', 'شوربة فراخ', 'ثوم', 'كسبرة ناشفة', 'ملح', 'فلفل أسود', 'سمن أو زيت'],
 ARRAY['اسلقي الفراخ في ماء مغلي مع البصل والحبهان والملح', 'أخرجي الفراخ واتركي الشوربة على النار', 'في مقلاة، حمري الثوم المفروم في السمن', 'أضيفي الكسبرة الناشفة المطحونة', 'أضيفي الملوخية واستمري في التحريك', 'أضيفي الشوربة تدريجياً واتركيها تغلي', 'تبلي بالملح والفلفل الأسود', 'اتركيها تنضج لمدة 10 دقائق'],
 'أكلة مصرية تقليدية وشعبية، طعمها مميز ومفيدة جداً', 4, 80,
 '{"كسبرة ناشفة": "بقدونس مجفف", "سمن": "زيت ذرة أو عباد الشمس"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recipes (id, name, image_url, prep_time, cook_time, difficulty, category, ingredients, instructions, description, servings, estimated_cost, alternatives) VALUES
('koshari', 'كشري', '/assets/koshary.jpg', 20, 40, 'متوسط', 'سهل وسريع',
 ARRAY['أرز أبيض', 'عدس أسود', 'شعرية', 'حمص حب', 'بصل', 'طماطم', 'ثوم', 'خل', 'صلصة طماطم', 'زيت', 'شطة', 'كمون'],
 ARRAY['اسلقي العدس والحمص منفصلين حتى ينضجوا', 'في مقلاة، حمري الشعرية في الزيت', 'أضيفي الأرز واستمري في التحريك', 'أضيفي الماء واتركي الأرز ينضج', 'حمري البصل المقطع حلقات حتى يصبح ذهبياً', 'حضري الصلصة بقلي الثوم والطماطم', 'اخلطي كل المكونات وقدميها ساخنة'],
 'الأكلة الشعبية الأولى في مصر، مليانة طاقة ومشبعة', 6, 45,
 '{"عدس أسود": "عدس أحمر", "خل": "عصير ليمون"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Add more sample recipes as needed...