import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Recipe } from "@/data/recipes";
import { Clock, Users, DollarSign, Star } from "lucide-react";

interface RecipeComparisonProps {
  recipes: Recipe[];
  onSelectRecipe?: (recipe: Recipe) => void;
}

export const RecipeComparison = ({ recipes, onSelectRecipe }: RecipeComparisonProps) => {
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

  const toggleRecipeSelection = (recipe: Recipe) => {
    if (selectedRecipes.find(r => r.id === recipe.id)) {
      setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipe.id));
    } else if (selectedRecipes.length < 3) {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const clearSelection = () => {
    setSelectedRecipes([]);
  };

  const getBestValue = () => {
    if (selectedRecipes.length === 0) return null;
    
    return selectedRecipes.reduce((best, current) => {
      const currentValue = (current.estimatedCost || 0) / current.servings;
      const bestValue = (best.estimatedCost || 0) / best.servings;
      return currentValue < bestValue ? current : best;
    });
  };

  const getFastest = () => {
    if (selectedRecipes.length === 0) return null;
    
    return selectedRecipes.reduce((fastest, current) => {
      const currentTime = current.prepTime + current.cookTime;
      const fastestTime = fastest.prepTime + fastest.cookTime;
      return currentTime < fastestTime ? current : fastest;
    });
  };

  const bestValue = getBestValue();
  const fastest = getFastest();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            مقارنة الوصفات
          </CardTitle>
          {selectedRecipes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              مسح الكل
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipe Selection */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            اختر حتى 3 وصفات للمقارنة ({selectedRecipes.length}/3)
          </p>
          <div className="grid grid-cols-1 gap-2">
            {recipes.slice(0, 6).map((recipe) => {
              const isSelected = selectedRecipes.find(r => r.id === recipe.id);
              return (
                <Button
                  key={recipe.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleRecipeSelection(recipe)}
                  disabled={!isSelected && selectedRecipes.length >= 3}
                  className="justify-start h-auto p-3"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-xl">{recipe.image}</span>
                    <div className="text-left flex-1">
                      <p className="font-medium">{recipe.name}</p>
                      <p className="text-xs opacity-70">
                        {recipe.prepTime + recipe.cookTime} د • {recipe.difficulty}
                      </p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Comparison Results */}
        {selectedRecipes.length > 1 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">نتائج المقارنة:</h4>
              
              {/* Best Value */}
              {bestValue && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">أفضل قيمة</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {bestValue.name} - {Math.round((bestValue.estimatedCost || 0) / bestValue.servings)} جنيه للشخص
                  </p>
                </div>
              )}

              {/* Fastest */}
              {fastest && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">الأسرع</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {fastest.name} - {fastest.prepTime + fastest.cookTime} دقيقة
                  </p>
                </div>
              )}

              {/* Detailed Comparison */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">الوصفة</th>
                      <th className="text-center p-2">الوقت</th>
                      <th className="text-center p-2">الصعوبة</th>
                      <th className="text-center p-2">التكلفة</th>
                      <th className="text-center p-2">الأشخاص</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecipes.map((recipe) => (
                      <tr key={recipe.id} className="border-b">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span>{recipe.image}</span>
                            <span className="font-medium">{recipe.name}</span>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          {recipe.prepTime + recipe.cookTime} د
                        </td>
                        <td className="text-center p-2">
                          <Badge variant="outline" className="text-xs">
                            {recipe.difficulty}
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          {recipe.estimatedCost || 'غير محدد'} ج
                        </td>
                        <td className="text-center p-2">
                          {recipe.servings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};