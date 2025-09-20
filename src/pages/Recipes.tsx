import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, ChefHat, Users } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { useRecipes } from '@/hooks/useRecipes';
import { getRecipesByIngredients } from '@/data/hybridRecipes';
import { RecipeCard } from '@/components/ui/recipe-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { RecipeFilters, RecipeFilters as RecipeFiltersType } from '@/components/ui/recipe-filters';

const Recipes = () => {
  const { recipes: databaseRecipes, loading } = useRecipes();
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<RecipeFiltersType>({
    categories: [],
    difficulties: [],
    maxCookTime: 120,
    maxCost: 200,
    minServings: 1,
    maxServings: 10,
    hasAlternatives: false,
    quickOnly: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    // جلب المكونات المحددة من localStorage
    const storedIngredients = localStorage.getItem('selectedIngredients');
    if (storedIngredients) {
      const ingredients = JSON.parse(storedIngredients);
      setSelectedIngredients(ingredients);
      setFilteredRecipes(getRecipesByIngredients(ingredients, databaseRecipes));
    } else if (!loading) {
      setFilteredRecipes(getRecipesByIngredients([], databaseRecipes));
    }
  }, [databaseRecipes, loading]);

  useEffect(() => {
    if (loading) return;
    
    let filtered = selectedIngredients.length > 0 
      ? getRecipesByIngredients(selectedIngredients, databaseRecipes)
      : getRecipesByIngredients([], databaseRecipes);

    if (selectedCategory !== "all") {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    // تطبيق الفلاتر المتقدمة
    if (advancedFilters.categories.length > 0) {
      filtered = filtered.filter(recipe => advancedFilters.categories.includes(recipe.category));
    }
    
    if (advancedFilters.difficulties.length > 0) {
      filtered = filtered.filter(recipe => advancedFilters.difficulties.includes(recipe.difficulty));
    }
    
    filtered = filtered.filter(recipe => {
      const totalTime = recipe.prepTime + recipe.cookTime;
      const cost = recipe.estimatedCost || 0;
      
      return totalTime <= advancedFilters.maxCookTime &&
             cost <= advancedFilters.maxCost &&
             recipe.servings >= advancedFilters.minServings &&
             recipe.servings <= advancedFilters.maxServings &&
             (!advancedFilters.hasAlternatives || (recipe.alternatives && Object.keys(recipe.alternatives).length > 0)) &&
             (!advancedFilters.quickOnly || totalTime <= 30);
    });
    setFilteredRecipes(filtered);
  }, [selectedCategory, selectedDifficulty, selectedIngredients, advancedFilters, databaseRecipes, loading]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل': return 'bg-green-100 text-green-700 border-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'صعب': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const clearIngredients = () => {
    localStorage.removeItem('selectedIngredients');
    setSelectedIngredients([]);
    setFilteredRecipes(getRecipesByIngredients([], databaseRecipes));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-food-cream to-secondary/30 pb-20">
      <OfflineIndicator />
      
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-soft border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-primary"
            >
              ← رجوع
            </Button>
            <h1 className="text-xl font-bold text-primary">الوصفات المتاحة</h1>
            <div className="w-16">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">البحث بناءً على المكونات</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearIngredients}
                  className="text-muted-foreground hover:text-destructive"
                >
                  مسح الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                  <Badge 
                    key={ingredient} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border border-primary/20"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <RecipeFilters 
          onFiltersChange={setAdvancedFilters}
          initialFilters={advancedFilters}
        />

        {/* Results Summary */}
        <div className="text-center">
          <p className="text-muted-foreground">
            {filteredRecipes.length === 0 
              ? "لم يتم العثور على وصفات مناسبة" 
              : `تم العثور على ${filteredRecipes.length} وصفة مناسبة`
            }
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-muted rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showIngredientMatch={selectedIngredients.length > 0}
                availableIngredients={selectedIngredients}
              />
            ))
          ))}
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لم يتم العثور على وصفات
              </h3>
              <p className="text-muted-foreground mb-6">
                جرب تغيير الفلترة أو أضف مكونات مختلفة
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => navigate('/add-ingredients')}
                  className="bg-primary hover:bg-primary/90"
                >
                  أضف مكونات جديدة
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                    clearIngredients();
                  }}
                >
                  مسح كل الفلاتر
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Recipes;