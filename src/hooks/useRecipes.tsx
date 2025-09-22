import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface DatabaseRecipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  prep_time: number;
  cook_time: number;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  category: 'محشي' | 'شوربة' | 'طواجن' | 'سهل وسريع' | 'تحضير طويل';
  servings: number;
  estimated_cost: number | null;
  ingredients: string[];
  instructions: string[];
  alternatives: any;
  created_by: string | null;
  is_public: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeRating {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<DatabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes((data || []) as DatabaseRecipe[]);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('حدث خطأ في تحميل الوصفات');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRecipes = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching my recipes:', error);
      toast.error('حدث خطأ في تحميل وصفاتي');
      return [];
    }
  };

  const getRecipeById = async (id: string): Promise<DatabaseRecipe | null> => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as DatabaseRecipe;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
  };

  const createRecipe = async (recipe: Omit<DatabaseRecipe, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('يجب عليك تسجيل الدخول أولاً');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([{
          ...recipe,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('تم إضافة الوصفة بنجاح');
      fetchRecipes(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('حدث خطأ في إضافة الوصفة');
      return null;
    }
  };

  const updateRecipe = async (id: string, updates: Partial<DatabaseRecipe>) => {
    if (!user) {
      toast.error('يجب عليك تسجيل الدخول أولاً');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user.id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('تم تحديث الوصفة بنجاح');
      fetchRecipes(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('حدث خطأ في تحديث الوصفة');
      return null;
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!user) {
      toast.error('يجب عليك تسجيل الدخول أولاً');
      return false;
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id);

      if (error) throw error;
      
      toast.success('تم حذف الوصفة بنجاح');
      fetchRecipes(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('حدث خطأ في حذف الوصفة');
      return false;
    }
  };

  const uploadRecipeImage = async (file: File, recipeId: string) => {
    if (!user) {
      toast.error('يجب عليك تسجيل الدخول أولاً');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${recipeId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('حدث خطأ في رفع الصورة');
      return null;
    }
  };

  const getAllRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all recipes:', error);
      return [];
    }
  };

  const getPendingRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending recipes:', error);
      return [];
    }
  };

  const getFeaturedRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
      return [];
    }
  };

  const rateRecipe = async (recipeId: string, rating: number, comment?: string) => {
    if (!user) {
      toast.error('يجب عليك تسجيل الدخول أولاً');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('recipe_ratings')
        .upsert({
          recipe_id: recipeId,
          user_id: user.id,
          rating,
          comment: comment || null
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('تم تقييم الوصفة بنجاح');
      return data;
    } catch (error) {
      console.error('Error rating recipe:', error);
      toast.error('حدث خطأ في تقييم الوصفة');
      return null;
    }
  };

  const getRecipeRatings = async (recipeId: string) => {
    try {
      const { data, error } = await supabase
        .from('recipe_ratings')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    recipes,
    loading,
    fetchRecipes,
    fetchMyRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    uploadRecipeImage,
    rateRecipe,
    getRecipeRatings,
    getAllRecipes,
    getPendingRecipes,
    getFeaturedRecipes,
    isAuthenticated
  };
};