import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Clock, Users, X } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { recipes, Recipe } from "@/data/recipes";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const popularSearches = [
    "كشري", "ملوخية", "محشي", "بطاطس", "أرز باللبن", 
    "بامية", "فراخ", "شوربة", "طواجن", "مقلي"
  ];

  useEffect(() => {
    // جلب عمليات البحث الأخيرة
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const searchTimeout = setTimeout(() => {
      const filtered = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const performSearch = (query: string) => {
    setSearchQuery(query);
    
    // حفظ في عمليات البحث الأخيرة
    if (query.trim()) {
      const newRecentSearches = [
        query,
        ...recentSearches.filter(item => item !== query)
      ].slice(0, 5); // الاحتفاظ بآخر 5 عمليات بحث
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
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
            <h1 className="text-xl font-bold text-primary">البحث</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="w-5 h-5" />
              ابحث عن وصفة
            </CardTitle>
            <CardDescription>
              ابحث بالاسم، المكونات، أو نوع الطبق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                placeholder="مثال: كشري، ملوخية، طماطم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>نتائج البحث</span>
                {isSearching && (
                  <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                )}
              </CardTitle>
              <CardDescription>
                {isSearching 
                  ? "جاري البحث..." 
                  : searchResults.length === 0 
                    ? "لم يتم العثور على نتائج"
                    : `تم العثور على ${searchResults.length} وصفة`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-muted-foreground">جرب كلمات بحث مختلفة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((recipe) => (
                    <div 
                      key={recipe.id}
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/20 hover:shadow-soft cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {recipe.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {recipe.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {recipe.description}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{recipe.prepTime + recipe.cookTime} د</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{recipe.servings}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}
                          >
                            {recipe.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">عمليات البحث الأخيرة</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-muted-foreground hover:text-destructive"
                >
                  مسح الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => performSearch(search)}
                    className="text-sm hover:bg-primary hover:text-primary-foreground"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">بحث شائع</CardTitle>
              <CardDescription>
                أكلات مصرية مشهورة يبحث عنها المستخدمون
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    onClick={() => performSearch(search)}
                    className="justify-start text-right hover:bg-primary hover:text-primary-foreground"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {!searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">طرق أخرى للاستكشاف</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/add-ingredients')}
                  className="h-auto p-4 flex flex-col space-y-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="text-2xl">🥬</span>
                  <span className="text-sm font-medium">أضف مكونات</span>
                  <span className="text-xs text-muted-foreground">ابحث بالمكونات المتاحة</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/recipes')}
                  className="h-auto p-4 flex flex-col space-y-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="text-2xl">📖</span>
                  <span className="text-sm font-medium">تصفح الوصفات</span>
                  <span className="text-xs text-muted-foreground">استكشف كل الوصفات</span>
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

export default Search;