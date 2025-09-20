// Hybrid system that combines static recipes with database recipes
import { Recipe } from './recipes';
import { DatabaseRecipe } from '@/hooks/useRecipes';
import { recipes as staticRecipes } from './recipes';

// Convert database recipe to the Recipe interface used by the app
export const convertDatabaseRecipe = (dbRecipe: DatabaseRecipe): Recipe => ({
  id: dbRecipe.id,
  name: dbRecipe.name,
  image: dbRecipe.image_url || '🍽️',
  prepTime: dbRecipe.prep_time,
  cookTime: dbRecipe.cook_time,
  difficulty: dbRecipe.difficulty,
  category: dbRecipe.category,
  ingredients: dbRecipe.ingredients,
  instructions: dbRecipe.instructions,
  description: dbRecipe.description || '',
  servings: dbRecipe.servings,
  estimatedCost: dbRecipe.estimated_cost || undefined,
  alternatives: dbRecipe.alternatives || undefined
});

// Convert Recipe to DatabaseRecipe format
export const convertToDatabase = (recipe: Recipe): Omit<DatabaseRecipe, 'id' | 'created_by' | 'created_at' | 'updated_at'> => ({
  name: recipe.name,
  description: recipe.description,
  image_url: typeof recipe.image === 'string' && recipe.image.startsWith('http') ? recipe.image : null,
  prep_time: recipe.prepTime,
  cook_time: recipe.cookTime,
  difficulty: recipe.difficulty,
  category: recipe.category,
  servings: recipe.servings,
  estimated_cost: recipe.estimatedCost || null,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  alternatives: recipe.alternatives || {},
  is_public: true,
  is_featured: false
});

// Combine static recipes with database recipes
export const combineRecipes = (databaseRecipes: DatabaseRecipe[]): Recipe[] => {
  const convertedDbRecipes = databaseRecipes.map(convertDatabaseRecipe);
  return [...staticRecipes, ...convertedDbRecipes];
};

// Get recipes by ingredients from combined sources
export function getRecipesByIngredients(
  ingredients: string[], 
  databaseRecipes: DatabaseRecipe[] = []
): Recipe[] {
  const allRecipes = combineRecipes(databaseRecipes);
  
  if (!ingredients || ingredients.length === 0) {
    return allRecipes;
  }

  return allRecipes.filter(recipe =>
    recipe.ingredients.some(ingredient =>
      ingredients.some(userIngredient =>
        ingredient.toLowerCase().includes(userIngredient.toLowerCase()) ||
        userIngredient.toLowerCase().includes(ingredient.toLowerCase())
      )
    )
  );
}

// Get recipe by ID from combined sources
export function getRecipeById(
  id: string, 
  databaseRecipes: DatabaseRecipe[] = []
): Recipe | undefined {
  const allRecipes = combineRecipes(databaseRecipes);
  return allRecipes.find(recipe => recipe.id === id);
}

// Get random recipe from combined sources
export function getRandomRecipe(databaseRecipes: DatabaseRecipe[] = []): Recipe {
  const allRecipes = combineRecipes(databaseRecipes);
  const randomIndex = Math.floor(Math.random() * allRecipes.length);
  return allRecipes[randomIndex];
}