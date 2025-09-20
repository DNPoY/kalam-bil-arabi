import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Sparkles } from "lucide-react";
import { recipes, Recipe } from "@/data/recipes";

interface RecipeSuggestionsProps {
  currentRecipeId?: string;
  userIngredients?: string[];
  maxSuggestions?: number;
}

export const RecipeSuggestions = ({ 
  currentRecipeId, 
  userIngredients = [], 
  maxSuggestions = 3 
}: RecipeSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    generateSuggestions();
  }, [currentRecipeId, userIngredients]);

  const generateSuggestions = () => {
    let filteredRecipes = recipes.filter(recipe => recipe.id !== currentRecipeId);

    // إذا كان لدينا مكونات، نعطي أولوية للوصفات التي تستخدمها
    if (userIngredients.length > 0) {
      filteredRecipes = filteredRecipes.sort((a, b) => {
        const aMatches = a.ingredients.filter(ingredient =>
          userIngredients.some(userIng =>
            ingredient.toLowerCase().includes(userIng.toLowerCase()) ||
            userIng.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;

        const bMatches = b.ingredients.filter(ingredient =>
          userIngredients.some(userIng =>
            ingredient.toLowerCase().includes(userIng.toLowerCase()) ||
            userIng.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;

        return bMatches - aMatches;
      });
    }

    // إضافة عشوائية للتنويع
    const shuffled = filteredRecipes.sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, maxSuggestions));
  };

  const getMatchingIngredients = (recipe: Recipe) => {
    if (userIngredients.length === 0) return [];
    
    return recipe.ingredients.filter(ingredient =>
      userIngredients.some(userIng =>
        ingredient.toLowerCase().includes(userIng.toLowerCase()) ||
        userIng.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            اقتراحات لك
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateSuggestions}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((recipe) => {
            const matchingIngredients = getMatchingIngredients(recipe);
            const matchPercentage = recipe.ingredients.length > 0 
              ? Math.round((matchingIngredients.length / recipe.ingredients.length) * 100)
              : 0;

            return (
              <div 
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border cursor-pointer hover:border-primary/20 hover:shadow-soft transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {recipe.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                    {recipe.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {recipe.category}
                    </Badge>
                    {matchingIngredients.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {matchPercentage}% متوفر
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ⏱️ {recipe.prepTime + recipe.cookTime} د • 🔥 {recipe.difficulty}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};