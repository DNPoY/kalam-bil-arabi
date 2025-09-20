import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Users, DollarSign, Star } from "lucide-react";
import { Recipe } from "@/data/recipes";
import { toast } from "sonner";

interface RecipeCardProps {
  recipe: Recipe;
  showIngredientMatch?: boolean;
  availableIngredients?: string[];
  compact?: boolean;
}

export const RecipeCard = ({ 
  recipe, 
  showIngredientMatch = false, 
  availableIngredients = [],
  compact = false 
}: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(recipe.id);
  });
  
  const navigate = useNavigate();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((fav: string) => fav !== recipe.id);
      toast.info(`تم حذف ${recipe.name} من المفضلة`);
    } else {
      newFavorites = [...favorites, recipe.id];
      toast.success(`تم إضافة ${recipe.name} للمفضلة`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل': return 'bg-green-100 text-green-700 border-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'صعب': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMatchingIngredients = () => {
    if (!showIngredientMatch || availableIngredients.length === 0) return [];
    
    return recipe.ingredients.filter(ingredient =>
      availableIngredients.some(available =>
        ingredient.toLowerCase().includes(available.toLowerCase()) ||
        available.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  };

  const matchingIngredients = getMatchingIngredients();
  const matchPercentage = recipe.ingredients.length > 0 
    ? Math.round((matchingIngredients.length / recipe.ingredients.length) * 100)
    : 0;

  return (
    <Card 
      className="hover:shadow-warm transition-all duration-300 cursor-pointer group border border-border/50 hover:border-primary/20"
      onClick={() => navigate(`/recipe/${recipe.id}`)}
    >
      <CardHeader className={compact ? "pb-3" : ""}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
              {typeof recipe.image === 'string' && recipe.image.startsWith('http') ? (
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                recipe.image
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                {recipe.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {recipe.category}
                </Badge>
                {showIngredientMatch && matchingIngredients.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-green-100 text-green-700"
                  >
                    {matchPercentage}% متوفر
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className={`${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'} flex-shrink-0`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>

          {/* Recipe Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime + recipe.cookTime} د</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{recipe.servings}</span>
              </div>
            </div>
            
            <Badge 
              variant="outline" 
              className={`${getDifficultyColor(recipe.difficulty)}`}
            >
              {recipe.difficulty}
            </Badge>
          </div>

          {/* Price */}
          {recipe.estimatedCost && (
            <div className="text-sm">
              <span className="text-muted-foreground">التكلفة: </span>
              <span className="font-medium text-green-600">{recipe.estimatedCost} جنيه</span>
            </div>
          )}

          {/* Available Ingredients */}
          {showIngredientMatch && matchingIngredients.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">متوفر لديك:</p>
              <div className="flex flex-wrap gap-1">
                {matchingIngredients.slice(0, 3).map((ingredient, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-green-100 text-green-700 border-green-200"
                  >
                    {ingredient}
                  </Badge>
                ))}
                {matchingIngredients.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{matchingIngredients.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};