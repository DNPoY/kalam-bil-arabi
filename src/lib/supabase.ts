import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recipe = {
  id: string;
  name: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  category: 'محشي' | 'شوربة' | 'طواجن' | 'سهل وسريع' | 'تحضير طويل';
  ingredients: string[];
  instructions: string[];
  description: string;
  servings: number;
  estimated_cost?: number;
  alternatives?: { [key: string]: string };
  created_at?: string;
  updated_at?: string;
};

// Get all recipes
export async function getRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data || [];
}

// Get recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }

  return data;
}

// Get recipes by ingredients
export async function getRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .overlaps('ingredients', ingredients);

  if (error) {
    console.error('Error fetching recipes by ingredients:', error);
    return [];
  }

  return data || [];
}

// Add new recipe
export async function addRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .insert([recipe])
    .select()
    .single();

  if (error) {
    console.error('Error adding recipe:', error);
    return null;
  }

  return data;
}

// Update recipe
export async function updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating recipe:', error);
    return null;
  }

  return data;
}

// Delete recipe
export async function deleteRecipe(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }

  return true;
}