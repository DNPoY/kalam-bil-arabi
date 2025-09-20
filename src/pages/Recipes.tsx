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

const Recipes = () => {
  const { recipes: databaseRecipes, loading } = useRecipes();
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
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

    setFilteredRecipes(filtered);
  }, [selectedCategory, selectedDifficulty, selectedIngredients, databaseRecipes, loading]);

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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">فلترة النتائج</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">نوع الطبق</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الطبق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأنواع</SelectItem>
                    <SelectItem value="محشي">محشي</SelectItem>
                    <SelectItem value="شوربة">شوربة</SelectItem>
                    <SelectItem value="طواجن">طواجن</SelectItem>
                    <SelectItem value="سهل وسريع">سهل وسريع</SelectItem>
                    <SelectItem value="تحضير طويل">تحضير طويل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">مستوى الصعوبة</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى الصعوبة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المستويات</SelectItem>
                    <SelectItem value="سهل">سهل</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="صعب">صعب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
          {filteredRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="hover:shadow-warm transition-all duration-300 cursor-pointer group border border-border/50 hover:border-primary/20"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-soft">
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {recipe.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {recipe.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

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
                      <span>{recipe.servings} أشخاص</span>
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
                    <span className="text-muted-foreground">التكلفة التقريبية: </span>
                    <span className="font-medium text-green-600">{recipe.estimatedCost} جنيه</span>
                  </div>
                )}

                {/* Available Ingredients */}
                {selectedIngredients.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">المكونات المتاحة لديك:</p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients
                        .filter(ingredient => 
                          selectedIngredients.some(selected => 
                            ingredient.toLowerCase().includes(selected.toLowerCase()) ||
                            selected.toLowerCase().includes(ingredient.toLowerCase())
                          )
                        )
                        .slice(0, 3)
                        .map((ingredient, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-green-100 text-green-700 border-green-200"
                          >
                            {ingredient}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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