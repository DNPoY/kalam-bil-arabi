-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.get_recipe_average_rating(recipe_id UUID)
RETURNS NUMERIC 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.recipe_ratings
    WHERE recipe_ratings.recipe_id = get_recipe_average_rating.recipe_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_recipe_rating_count(recipe_id UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.recipe_ratings
    WHERE recipe_ratings.recipe_id = get_recipe_rating_count.recipe_id
  );
END;
$$;