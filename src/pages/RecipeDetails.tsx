import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Clock, Users, DollarSign, Play, Pause, Volume2 } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { getRecipeById, Recipe } from "@/data/recipes";
import { toast } from "sonner";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (id) {
      const foundRecipe = getRecipeById(id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        
        // جلب المكونات المحددة
        const storedIngredients = localStorage.getItem('selectedIngredients');
        if (storedIngredients) {
          setSelectedIngredients(JSON.parse(storedIngredients));
        }
        
        // فحص المفضلة
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(id));
      } else {
        navigate('/recipes');
      }
    }
  }, [id, navigate]);

  const toggleFavorite = () => {
    if (!recipe) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((fav: string) => fav !== recipe.id);
      toast.info("تم حذف الوصفة من المفضلة");
    } else {
      newFavorites = [...favorites, recipe.id];
      toast.success("تم إضافة الوصفة للمفضلة");
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

  const isIngredientAvailable = (ingredient: string) => {
    return selectedIngredients.some(selected => 
      ingredient.toLowerCase().includes(selected.toLowerCase()) ||
      selected.toLowerCase().includes(ingredient.toLowerCase())
    );
  };

  const handleTextToSpeech = () => {
    if (!recipe) return;
    
    if (isPlaying) {
      // إيقاف القراءة
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    // بدء القراءة
    const textToRead = `
      وصفة ${recipe.name}.
      ${recipe.description}.
      المكونات المطلوبة: ${recipe.ingredients.join('، ')}.
      طريقة التحضير: ${recipe.instructions.join('. ')}
    `;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error("حدث خطأ في تشغيل الصوت");
    };
    
    window.speechSynthesis.speak(utterance);
    toast.success("بدأت قراءة الوصفة");
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-food-cream to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p>جاري تحميل الوصفة...</p>
        </div>
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
              onClick={() => navigate('/recipes')}
              className="text-muted-foreground hover:text-primary"
            >
              ← رجوع
            </Button>
            <h1 className="text-lg font-bold text-primary truncate mx-4">
              {recipe.name}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={`${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Recipe Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden shadow-warm mb-4">
              <img 
                src={recipe.image} 
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardTitle className="text-2xl text-foreground">{recipe.name}</CardTitle>
            <CardDescription className="text-lg">{recipe.description}</CardDescription>
            
            {/* Recipe Info */}
            <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{recipe.prepTime + recipe.cookTime} دقيقة</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">{recipe.servings} أشخاص</span>
              </div>
              {recipe.estimatedCost && (
                <div className="flex items-center gap-2 text-green-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">{recipe.estimatedCost} جنيه</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm">
                {recipe.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-sm ${getDifficultyColor(recipe.difficulty)}`}
              >
                {recipe.difficulty}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Audio Controls */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleTextToSpeech}
              className={`w-full ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'} text-white`}
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 ml-2" />
                  إيقاف القراءة
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 ml-2" />
                  استمع للوصفة
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              استمع للوصفة كاملة بالصوت أثناء الطبخ
            </p>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              المكونات المطلوبة
            </CardTitle>
            {selectedIngredients.length > 0 && (
              <CardDescription>
                ✅ الأخضر: متوفر لديك • ❌ الأحمر: مطلوب شراءه
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {recipe.ingredients.map((ingredient, index) => {
                const available = isIngredientAvailable(ingredient);
                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      selectedIngredients.length > 0
                        ? available 
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <span className="font-medium">{ingredient}</span>
                    {selectedIngredients.length > 0 && (
                      <span className="text-sm">
                        {available ? '✅ متوفر' : '❌ مطلوب'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alternatives */}
        {recipe.alternatives && Object.keys(recipe.alternatives).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🔄</span>
                بدائل ذكية
              </CardTitle>
              <CardDescription>
                إذا لم يتوفر لديك بعض المكونات، يمكنك استخدام هذه البدائل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(recipe.alternatives).map(([original, alternative]) => (
                  <div key={original} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">{original}</span>
                      <span className="text-muted-foreground">←</span>
                      <span className="font-medium text-primary">{alternative}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">👩‍🍳</span>
              طريقة التحضير
            </CardTitle>
            <CardDescription>
              اتبع هذه الخطوات بالترتيب للحصول على أفضل النتائج
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground leading-relaxed">{instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={toggleFavorite}
            variant={isFavorite ? "default" : "outline"}
            size="lg"
            className={isFavorite ? "bg-red-500 hover:bg-red-600 text-white" : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}
          >
            <Heart className={`w-5 h-5 ml-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'محفوظ في المفضلة' : 'أضف للمفضلة'}
          </Button>
          
          <Button 
            onClick={() => navigate('/recipes')}
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            🔍 ابحث عن وصفات أخرى
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default RecipeDetails;