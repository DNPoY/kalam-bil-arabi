import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart, Trash2 } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { getRecipeById, Recipe } from "@/data/recipes";
import { toast } from "sonner";

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const recipes = favorites.map((id: string) => getRecipeById(id)).filter(Boolean) as Recipe[];
    setFavoriteRecipes(recipes);
  };

  const removeFromFavorites = (recipeId: string, recipeName: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = favorites.filter((id: string) => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    loadFavorites();
    toast.info(`تم حذف "${recipeName}" من المفضلة`);
  };

  const clearAllFavorites = () => {
    localStorage.removeItem('favorites');
    setFavoriteRecipes([]);
    toast.info("تم مسح كل المفضلة");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل': return 'bg-green-100 text-green-700 border-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'صعب': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
            <h1 className="text-xl font-bold text-primary">المفضلة</h1>
            {favoriteRecipes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFavorites}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl mb-4">
              ⭐
            </div>
            <CardTitle>الوصفات المفضلة</CardTitle>
            <CardDescription>
              {favoriteRecipes.length === 0 
                ? "لم تقم بحفظ أي وصفات بعد"
                : `لديك ${favoriteRecipes.length} وصفة محفوظة`
              }
            </CardDescription>
          </CardHeader>
        </Card>

        {favoriteRecipes.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لا توجد وصفات مفضلة
              </h3>
              <p className="text-muted-foreground mb-6">
                ابدأ في استكشاف الوصفات وأضف المفضلة منها هنا
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => navigate('/recipes')}
                  className="bg-primary hover:bg-primary/90"
                >
                  استكشف الوصفات
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/add-ingredients')}
                >
                  أضف مكونات
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="hover:shadow-warm transition-all duration-300 cursor-pointer group border border-border/50 hover:border-primary/20"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {recipe.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                          {recipe.name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {recipe.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(recipe.id, recipe.name);
                      }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
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

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/recipe/${recipe.id}`);
                      }}
                      className="flex-1 text-xs"
                    >
                      عرض الوصفة
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(recipe.id, recipe.name);
                      }}
                      className="text-red-500 hover:text-red-600 hover:border-red-500 text-xs"
                    >
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {favoriteRecipes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/recipes')}
                  className="h-auto p-4 flex flex-col space-y-2"
                >
                  <span className="text-2xl">📖</span>
                  <span className="text-sm">استكشف المزيد</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/add-ingredients')}
                  className="h-auto p-4 flex flex-col space-y-2"
                >
                  <span className="text-2xl">🥬</span>
                  <span className="text-sm">أضف مكونات</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/search')}
                  className="h-auto p-4 flex flex-col space-y-2"
                >
                  <span className="text-2xl">🔍</span>
                  <span className="text-sm">بحث متقدم</span>
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

export default Favorites;