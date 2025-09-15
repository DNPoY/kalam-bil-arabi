import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Camera } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { toast } from "sonner";

const AddIngredients = () => {
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const navigate = useNavigate();

  const commonIngredients = [
    "طماطم", "بصل", "ثوم", "بطاطس", "جزر", "كوسة", "باذنجان", "فلفل أخضر",
    "أرز", "مكرونة", "عدس", "فاصوليا", "حمص", 
    "فراخ", "لحمة", "سمك", "بيض",
    "زيت", "سمن", "زبدة", "ملح", "فلفل أسود", "كمون", "كسبرة",
    "طحينة", "خل", "عصير ليمون", "صلصة طماطم"
  ];

  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !ingredients.includes(ingredient.trim())) {
      setIngredients([...ingredients, ingredient.trim()]);
      setCurrentIngredient("");
      toast.success(`تمت إضافة ${ingredient.trim()}`);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
    toast.info(`تم حذف ${ingredient}`);
  };

  const handleSearch = () => {
    if (ingredients.length === 0) {
      toast.error("أضف مكونات أولاً للبحث عن الوصفات");
      return;
    }
    
    localStorage.setItem('selectedIngredients', JSON.stringify(ingredients));
    navigate('/recipes');
    toast.success(`جاري البحث عن وصفات باستخدام ${ingredients.length} مكون`);
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
            <h1 className="text-xl font-bold text-primary">أضف المكونات</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Add Ingredient Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🥬</span>
              إيه المكونات اللي عندك؟
            </CardTitle>
            <CardDescription>
              اكتب اسم المكون واضغط إضافة، أو اختار من المكونات الشائعة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="مثال: طماطم، بصل، فراخ..."
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient(currentIngredient)}
                className="flex-1"
              />
              <Button 
                onClick={() => addIngredient(currentIngredient)}
                disabled={!currentIngredient.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Camera Option */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/camera')}
            >
              <Camera className="w-4 h-4 ml-2" />
              أو صور محتويات التلاجة
            </Button>
          </CardContent>
        </Card>

        {/* Current Ingredients */}
        {ingredients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المكونات المحددة ({ingredients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.map((ingredient) => (
                  <Badge 
                    key={ingredient} 
                    variant="secondary" 
                    className="text-sm py-1 px-3 bg-primary/10 text-primary border border-primary/20"
                  >
                    {ingredient}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-2 h-auto p-0 text-primary hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={handleSearch}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                size="lg"
              >
                🔍 ابحث عن وصفات ({ingredients.length} مكون)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Common Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">مكونات شائعة</CardTitle>
            <CardDescription>اضغط على أي مكون لإضافته بسرعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonIngredients.map((ingredient) => (
                <Button
                  key={ingredient}
                  variant="outline"
                  size="sm"
                  onClick={() => addIngredient(ingredient)}
                  disabled={ingredients.includes(ingredient)}
                  className={`justify-start text-right ${
                    ingredients.includes(ingredient) 
                      ? "bg-primary/20 text-primary border-primary" 
                      : "hover:bg-primary/10 hover:text-primary hover:border-primary"
                  }`}
                >
                  {ingredient}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default AddIngredients;