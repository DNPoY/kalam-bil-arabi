import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Clock, Users, Heart, ChefHat } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { RecipeCard } from "@/components/ui/recipe-card";
import { RecipeFilters, RecipeFilters as RecipeFiltersType } from "@/components/ui/recipe-filters";
import { combineRecipes, getRecipesByIngredients } from "@/data/hybridRecipes";
import { useRecipes } from "@/hooks/useRecipes";
import { Recipe } from "@/data/recipes";
import { toast } from "sonner";

const Recipes = () => {
  const navigate = useNavigate();
  const { recipes: databaseRecipes, loading } = useRecipes();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const categories = [
    { key: "all", name: "الكل", emoji: "🍽️" },
    { key: "محشي", name: "محشي", emoji: "🥬" },
    { key: "شوربة", name: "شوربة", emoji: "🍲" },
    { key: "طواجن", name: "طواجن", emoji: "🍛" },
    { key: "سهل وسريع", name: "سهل وسريع", emoji: "⚡" },
    { key: "تحضير طويل", name: "تحضير طويل", emoji: "⏰" }
  ];

  useEffect(() => {
    // دمج الوصفات الثابتة مع وصفات قاعدة البيانات
    const combined = combineRecipes(databaseRecipes);
    setAllRecipes(combined);

    // جلب المكونات المحددة من localStorage
    const storedIngredients = localStorage.getItem('selectedIngredients');
    if (storedIngredients) {
      const ingredients = JSON.parse(storedIngredients);
      setSelectedIngredients(ingredients);
      
      // فلترة الوصفات بناءً على المكونات
      const matchingRecipes = getRecipesByIngredients(ingredients, databaseRecipes);
      setFilteredRecipes(matchingRecipes);
      
      if (ingredients.length > 0) {
        toast.success(`تم العثور على ${matchingRecipes.length} وصفة تحتوي على مكوناتك`);
      }
    } else {
      setFilteredRecipes(combined);
    }
  }, [databaseRecipes]);

  useEffect(() => {
    // تطبيق البحث والفلترة
    let filtered = allRecipes;

    // فلترة بالبحث
    if (searchQuery.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // فلترة بالفئة
    if (selectedCategory !== "all") {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    // إذا كان هناك مكونات محددة، أعطي أولوية للوصفات المطابقة
    if (selectedIngredients.length > 0) {
      filtered = filtered.sort((a, b) => {
        const aMatches = a.ingredients.filter(ingredient =>
          selectedIngredients.some(selected =>
            ingredient.toLowerCase().includes(selected.toLowerCase()) ||
            selected.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;

        const bMatches = b.ingredients.filter(ingredient =>
          selectedIngredients.some(selected =>
            ingredient.toLowerCase().includes(selected.toLowerCase()) ||
            selected.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;

        return bMatches - aMatches;
      });
    }

    setFilteredRecipes(filtered);
  }, [searchQuery, selectedCategory, allRecipes, selectedIngredients]);

  const handleFiltersChange = (filters: RecipeFiltersType) => {
    let filtered = allRecipes;

    // تطبيق فلاتر متقدمة
    if (filters.categories.length > 0) {
      filtered = filtered.filter(recipe => filters.categories.includes(recipe.category));
    }

    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(recipe => filters.difficulties.includes(recipe.difficulty));
    }

    if (filters.maxCookTime < 120) {
      filtered = filtered.filter(recipe => (recipe.prepTime + recipe.cookTime) <= filters.maxCookTime);
    }

    if (filters.maxCost < 200) {
      filtered = filtered.filter(recipe => (recipe.estimatedCost || 0) <= filters.maxCost);
    }

    if (filters.minServings > 1 || filters.maxServings < 10) {
      filtered = filtered.filter(recipe => 
        recipe.servings >= filters.minServings && recipe.servings <= filters.maxServings
      );
    }

    if (filters.quickOnly) {
      filtered = filtered.filter(recipe => (recipe.prepTime + recipe.cookTime) <= 30);
    }

    setFilteredRecipes(filtered);
  };

  const clearSelectedIngredients = () => {
    localStorage.removeItem('selectedIngredients');
    setSelectedIngredients([]);
    setFilteredRecipes(allRecipes);
    toast.info("تم مسح المكونات المحددة");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-food-cream to-secondary/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">جاري تحميل الوصفات...</h3>
            <p className="text-sm text-muted-foreground">يتم جلب أحدث الوصفات</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-primary">الوصفات</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-muted-foreground hover:text-primary"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في الوصفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">البحث بالمكونات المتاحة</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelectedIngredients}
                  className="text-muted-foreground hover:text-destructive"
                >
                  مسح
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedIngredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {ingredient}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                عرض الوصفات التي تحتوي على هذه المكونات أولاً
              </p>
            </CardContent>
          </Card>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <RecipeFilters onFiltersChange={handleFiltersChange} />
        )}

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            {categories.map(category => (
              <TabsTrigger key={category.key} value={category.key} className="text-xs">
                <span className="mr-1">{category.emoji}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                تم العثور على {filteredRecipes.length} وصفة
                {selectedCategory !== "all" && ` في فئة "${categories.find(c => c.key === selectedCategory)?.name}"`}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/add-ingredients')}
                >
                  🥬 أضف مكونات
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/search')}
                >
                  🔍 بحث متقدم
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لم يتم العثور على وصفات
              </h3>
              <p className="text-muted-foreground mb-6">
                جرب تغيير كلمات البحث أو الفلترة، أو أضف مكونات جديدة
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => navigate('/add-ingredients')}
                  className="bg-primary hover:bg-primary/90"
                >
                  أضف مكونات
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedIngredients([]);
                    localStorage.removeItem('selectedIngredients');
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showIngredientMatch={selectedIngredients.length > 0}
                availableIngredients={selectedIngredients}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/favorites')}
                className="h-auto p-4 flex flex-col space-y-2 hover:bg-red-50 hover:border-red-200"
              >
                <span className="text-2xl">⭐</span>
                <span className="text-sm">المفضلة</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/meal-planner')}
                className="h-auto p-4 flex flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200"
              >
                <span className="text-2xl">📅</span>
                <span className="text-sm">مخطط الوجبات</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/community')}
                className="h-auto p-4 flex flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200"
              >
                <span className="text-2xl">👥</span>
                <span className="text-sm">مجتمع الطباخين</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Recipes;