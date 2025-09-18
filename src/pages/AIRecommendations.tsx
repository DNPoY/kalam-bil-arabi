import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Clock, Heart, ShoppingCart, Calendar, Target, Sparkles } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { recipes, Recipe } from "@/data/recipes";
import { toast } from "sonner";

interface UserPreferences {
  favoriteCategories: string[];
  preferredDifficulty: string[];
  cookingFrequency: number;
  budgetRange: string;
  dietaryRestrictions: string[];
  cookingHistory: string[];
}

interface AIInsight {
  type: 'preference' | 'trend' | 'optimization' | 'discovery';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  recipes?: Recipe[];
}

const AIRecommendations = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    favoriteCategories: [],
    preferredDifficulty: [],
    cookingFrequency: 0,
    budgetRange: "",
    dietaryRestrictions: [],
    cookingHistory: []
  });
  
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [personalizedRecipes, setPersonalizedRecipes] = useState<Recipe[]>([]);
  const [smartShoppingList, setSmartShoppingList] = useState<string[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    analyzeUserBehavior();
  }, []);

  const analyzeUserBehavior = async () => {
    setLoading(true);
    
    // محاكاة تحليل سلوك المستخدم
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // جلب البيانات من localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const selectedIngredients = JSON.parse(localStorage.getItem('selectedIngredients') || '[]');
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '{}');
    
    // تحليل التفضيلات
    const favoriteRecipes = favorites.map((id: string) => recipes.find(r => r.id === id)).filter(Boolean);
    const favoriteCategories = [...new Set(favoriteRecipes.map((r: Recipe) => r.category))];
    const preferredDifficulty = [...new Set(favoriteRecipes.map((r: Recipe) => r.difficulty))];
    
    setUserPreferences({
      favoriteCategories,
      preferredDifficulty,
      cookingFrequency: Object.keys(mealPlan).length,
      budgetRange: "متوسط",
      dietaryRestrictions: [],
      cookingHistory: favorites
    });

    // إنشاء رؤى الذكاء الاصطناعي
    const insights: AIInsight[] = [
      {
        type: 'preference',
        title: 'تحليل تفضيلاتك الشخصية',
        description: `لاحظنا أنك تفضل ${favoriteCategories.join(' و ')} بمستوى صعوبة ${preferredDifficulty.join(' و ')}`,
        confidence: 85,
        actionable: true,
        recipes: favoriteRecipes.slice(0, 3)
      },
      {
        type: 'trend',
        title: 'الاتجاهات الحالية',
        description: 'الوصفات السريعة والصحية تحظى بشعبية كبيرة هذا الشهر',
        confidence: 92,
        actionable: true,
        recipes: recipes.filter(r => r.category === 'سهل وسريع').slice(0, 3)
      },
      {
        type: 'optimization',
        title: 'تحسين قائمة التسوق',
        description: 'يمكنك توفير 25% من تكلفة التسوق بتجميع المكونات المشتركة',
        confidence: 78,
        actionable: true
      },
      {
        type: 'discovery',
        title: 'اكتشاف وصفات جديدة',
        description: 'بناءً على تفضيلاتك، قد تعجبك هذه الوصفات الجديدة',
        confidence: 88,
        actionable: true,
        recipes: recipes.filter(r => !favorites.includes(r.id)).slice(0, 3)
      }
    ];

    setAiInsights(insights);
    
    // إنشاء توصيات شخصية
    const personalized = recipes
      .filter(recipe => 
        favoriteCategories.length === 0 || favoriteCategories.includes(recipe.category)
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
    
    setPersonalizedRecipes(personalized);
    
    // إنشاء قائمة تسوق ذكية
    const allIngredients = personalized.flatMap(r => r.ingredients);
    const uniqueIngredients = [...new Set(allIngredients)].slice(0, 10);
    setSmartShoppingList(uniqueIngredients);
    
    // إنشاء خطة أسبوعية
    const weeklyRecipes = recipes.sort(() => 0.5 - Math.random()).slice(0, 7);
    setWeeklyPlan(weeklyRecipes);
    
    setLoading(false);
    toast.success("تم تحليل تفضيلاتك بنجاح!");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'preference': return <Heart className="w-5 h-5" />;
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      case 'optimization': return <Target className="w-5 h-5" />;
      case 'discovery': return <Sparkles className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-food-cream to-secondary/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">جاري تحليل تفضيلاتك...</h3>
            <p className="text-sm text-muted-foreground">الذكاء الاصطناعي يحلل سلوكك في الطبخ</p>
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
            <h1 className="text-xl font-bold text-primary">الذكاء الاصطناعي</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={analyzeUserBehavior}
              className="text-muted-foreground hover:text-primary"
            >
              🔄
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* AI Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              نظرة عامة على تفضيلاتك
            </CardTitle>
            <CardDescription>
              تحليل ذكي لسلوكك في الطبخ وتفضيلاتك الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{userPreferences.cookingHistory.length}</p>
                <p className="text-sm text-muted-foreground">وصفة مفضلة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{userPreferences.favoriteCategories.length}</p>
                <p className="text-sm text-muted-foreground">فئة مفضلة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{userPreferences.cookingFrequency}</p>
                <p className="text-sm text-muted-foreground">أيام طبخ/أسبوع</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">92%</p>
                <p className="text-sm text-muted-foreground">دقة التوصيات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>رؤى الذكاء الاصطناعي</CardTitle>
            <CardDescription>
              تحليلات ذكية مبنية على سلوكك وتفضيلاتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-semibold">{insight.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}%
                      </span>
                      <Progress value={insight.confidence} className="w-16 h-2" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  
                  {insight.recipes && (
                    <div className="flex gap-2 mb-3">
                      {insight.recipes.map((recipe) => (
                        <Badge 
                          key={recipe.id} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => navigate(`/recipe/${recipe.id}`)}
                        >
                          {recipe.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      تطبيق التوصية
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different AI features */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">توصيات شخصية</TabsTrigger>
            <TabsTrigger value="shopping">قائمة ذكية</TabsTrigger>
            <TabsTrigger value="planning">تخطيط أسبوعي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>وصفات مخصصة لك</CardTitle>
                <CardDescription>
                  وصفات مختارة بعناية بناءً على تفضيلاتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalizedRecipes.map((recipe) => (
                    <div 
                      key={recipe.id}
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                      className="p-4 bg-muted/30 rounded-lg border cursor-pointer hover:border-primary/20 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{recipe.image}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{recipe.name}</h4>
                          <p className="text-sm text-muted-foreground">{recipe.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>⏱️ {recipe.prepTime + recipe.cookTime} د</span>
                        <span>🔥 {recipe.difficulty}</span>
                        <span>👥 {recipe.servings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shopping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  قائمة التسوق الذكية
                </CardTitle>
                <CardDescription>
                  مكونات محسنة بناءً على وصفاتك المفضلة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {smartShoppingList.map((ingredient, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg border text-center">
                      <span className="text-sm font-medium">{ingredient}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    localStorage.setItem('aiShoppingList', JSON.stringify(smartShoppingList));
                    navigate('/shopping-list');
                  }}
                >
                  إضافة للتسوق
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  خطة الأسبوع الذكية
                </CardTitle>
                <CardDescription>
                  خطة وجبات متوازنة ومتنوعة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyPlan.map((recipe, index) => (
                    <div key={recipe.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="text-2xl">{recipe.image}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{recipe.name}</h4>
                        <p className="text-sm text-muted-foreground">{recipe.category}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                      >
                        عرض
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    const plan = weeklyPlan.reduce((acc, recipe, index) => {
                      const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                      acc[days[index]] = { lunch: recipe.id };
                      return acc;
                    }, {} as any);
                    localStorage.setItem('mealPlan', JSON.stringify(plan));
                    navigate('/meal-planner');
                  }}
                >
                  تطبيق الخطة
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default AIRecommendations;