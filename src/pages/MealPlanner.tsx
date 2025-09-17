import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Trash2, RefreshCw, ShoppingCart } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { recipes, Recipe, getRecipeById } from "@/data/recipes";
import { toast } from "sonner";

interface MealPlan {
  [key: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const navigate = useNavigate();

  const daysOfWeek = [
    { key: "saturday", name: "السبت", emoji: "🌅" },
    { key: "sunday", name: "الأحد", emoji: "☀️" },
    { key: "monday", name: "الاثنين", emoji: "🌟" },
    { key: "tuesday", name: "الثلاثاء", emoji: "⭐" },
    { key: "wednesday", name: "الأربعاء", emoji: "🌙" },
    { key: "thursday", name: "الخميس", emoji: "✨" },
    { key: "friday", name: "الجمعة", emoji: "🎉" }
  ];

  const mealTypes = [
    { key: "breakfast", name: "الفطار", emoji: "🌅" },
    { key: "lunch", name: "الغداء", emoji: "☀️" },
    { key: "dinner", name: "العشاء", emoji: "🌙" }
  ];

  useEffect(() => {
    loadMealPlan();
  }, []);

  const loadMealPlan = () => {
    const stored = localStorage.getItem('mealPlan');
    if (stored) {
      setMealPlan(JSON.parse(stored));
    }
  };

  const saveMealPlan = (newPlan: MealPlan) => {
    setMealPlan(newPlan);
    localStorage.setItem('mealPlan', JSON.stringify(newPlan));
  };

  const addMealToPlan = () => {
    if (!selectedDay || !selectedMeal || !selectedRecipe) {
      toast.error("برجاء اختيار اليوم والوجبة والوصفة");
      return;
    }

    const recipe = getRecipeById(selectedRecipe);
    if (!recipe) return;

    const newPlan = {
      ...mealPlan,
      [selectedDay]: {
        ...mealPlan[selectedDay],
        [selectedMeal]: selectedRecipe
      }
    };

    saveMealPlan(newPlan);
    
    const dayName = daysOfWeek.find(d => d.key === selectedDay)?.name;
    const mealName = mealTypes.find(m => m.key === selectedMeal)?.name;
    
    toast.success(`تم إضافة ${recipe.name} لـ${mealName} يوم ${dayName}`);
    
    // إعادة تعيين الاختيارات
    setSelectedDay("");
    setSelectedMeal("");
    setSelectedRecipe("");
  };

  const removeMealFromPlan = (day: string, meal: string) => {
    const newPlan = { ...mealPlan };
    if (newPlan[day]) {
      delete newPlan[day][meal];
      if (Object.keys(newPlan[day]).length === 0) {
        delete newPlan[day];
      }
    }
    saveMealPlan(newPlan);
    toast.info("تم حذف الوجبة من المخطط");
  };

  const generateRandomPlan = () => {
    const newPlan: MealPlan = {};
    
    daysOfWeek.forEach(day => {
      newPlan[day.key] = {};
      mealTypes.forEach(meal => {
        // اختيار وصفة عشوائية
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        newPlan[day.key][meal.key] = randomRecipe.id;
      });
    });

    saveMealPlan(newPlan);
    toast.success("تم إنشاء مخطط وجبات عشوائي!");
  };

  const clearPlan = () => {
    setMealPlan({});
    localStorage.removeItem('mealPlan');
    toast.info("تم مسح مخطط الوجبات");
  };

  const generateShoppingList = () => {
    const allIngredients: string[] = [];
    
    Object.values(mealPlan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(recipeId => {
        if (recipeId) {
          const recipe = getRecipeById(recipeId);
          if (recipe) {
            allIngredients.push(...recipe.ingredients);
          }
        }
      });
    });

    // إزالة المكررات
    const uniqueIngredients = [...new Set(allIngredients)];
    
    // حفظ في قائمة التسوق
    const existingList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    const newItems = uniqueIngredients.map(ingredient => ({
      id: Date.now().toString() + Math.random(),
      name: ingredient,
      quantity: "1",
      category: "أخرى",
      checked: false,
      urgent: false
    }));

    localStorage.setItem('shoppingList', JSON.stringify([...existingList, ...newItems]));
    
    toast.success(`تم إضافة ${uniqueIngredients.length} مكون لقائمة التسوق`);
    navigate('/shopping-list');
  };

  const getTotalMeals = () => {
    return Object.values(mealPlan).reduce((total, dayMeals) => {
      return total + Object.keys(dayMeals).length;
    }, 0);
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
            <h1 className="text-xl font-bold text-primary">مخطط الوجبات</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateShoppingList}
                disabled={getTotalMeals() === 0}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPlan}
                disabled={getTotalMeals() === 0}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              مخطط الوجبات الأسبوعي
            </CardTitle>
            <CardDescription>
              خطط وجباتك للأسبوع واحصل على قائمة تسوق تلقائية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{getTotalMeals()}</p>
                <p className="text-sm text-muted-foreground">وجبة مخططة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{Object.keys(mealPlan).length}</p>
                <p className="text-sm text-muted-foreground">أيام مخططة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round((getTotalMeals() / 21) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">اكتمال الأسبوع</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {Object.values(mealPlan).reduce((total, dayMeals) => {
                    return total + Object.values(dayMeals).reduce((dayTotal, recipeId) => {
                      const recipe = getRecipeById(recipeId || "");
                      return dayTotal + (recipe?.estimatedCost || 0);
                    }, 0);
                  }, 0)}
                </p>
                <p className="text-sm text-muted-foreground">جنيه (تقديري)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Meal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إضافة وجبة للمخطط
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اليوم" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day.key} value={day.key}>
                      {day.emoji} {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوجبة" />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map(meal => (
                    <SelectItem key={meal.key} value={meal.key}>
                      {meal.emoji} {meal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوصفة" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={addMealToPlan}
                className="flex-1"
                disabled={!selectedDay || !selectedMeal || !selectedRecipe}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة للمخطط
              </Button>
              <Button 
                onClick={generateRandomPlan}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                مخطط عشوائي
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Plan */}
        {Object.keys(mealPlan).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لم تخطط أي وجبات بعد
              </h3>
              <p className="text-muted-foreground mb-6">
                ابدأ بإضافة وجبات لأيام الأسبوع أو أنشئ مخطط عشوائي
              </p>
              <Button onClick={generateRandomPlan}>
                <RefreshCw className="w-4 h-4 ml-2" />
                إنشاء مخطط عشوائي
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {daysOfWeek.map(day => {
              const dayMeals = mealPlan[day.key];
              if (!dayMeals || Object.keys(dayMeals).length === 0) return null;

              return (
                <Card key={day.key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{day.emoji}</span>
                      {day.name}
                      <Badge variant="outline" className="ml-auto">
                        {Object.keys(dayMeals).length} وجبة
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mealTypes.map(meal => {
                        const recipeId = dayMeals[meal.key];
                        const recipe = recipeId ? getRecipeById(recipeId) : null;

                        return (
                          <div key={meal.key} className="space-y-2">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <span>{meal.emoji}</span>
                              {meal.name}
                            </h4>
                            {recipe ? (
                              <div 
                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                                className="p-3 bg-muted/30 rounded-lg border cursor-pointer hover:border-primary/20 hover:shadow-soft transition-all group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                      {recipe.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {recipe.prepTime + recipe.cookTime} د • {recipe.difficulty}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeMealFromPlan(day.key, meal.key);
                                    }}
                                    className="text-red-500 hover:text-red-600 flex-shrink-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 bg-muted/10 rounded-lg border-2 border-dashed border-muted text-center">
                                <p className="text-xs text-muted-foreground">لم تحدد وجبة</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Actions */}
        {getTotalMeals() > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={generateShoppingList}
                  className="h-auto p-4 flex flex-col space-y-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <span className="text-2xl">🛒</span>
                  <span className="text-sm font-medium">إنشاء قائمة تسوق</span>
                  <span className="text-xs opacity-90">من كل الوجبات المخططة</span>
                </Button>
                <Button 
                  onClick={() => navigate('/recipes')}
                  variant="outline"
                  className="h-auto p-4 flex flex-col space-y-2"
                >
                  <span className="text-2xl">📖</span>
                  <span className="text-sm font-medium">استكشف وصفات جديدة</span>
                  <span className="text-xs text-muted-foreground">لإضافتها للمخطط</span>
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

export default MealPlanner;