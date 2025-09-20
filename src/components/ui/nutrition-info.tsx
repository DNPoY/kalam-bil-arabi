import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface NutritionInfoProps {
  servings: number;
  estimatedCalories?: number;
  ingredients: string[];
}

export const NutritionInfo = ({ servings, estimatedCalories, ingredients }: NutritionInfoProps) => {
  // تقدير القيم الغذائية بناءً على المكونات
  const estimateNutrition = () => {
    const baseCalories = estimatedCalories || 400;
    const protein = Math.round(baseCalories * 0.15 / 4); // 15% من السعرات بروتين
    const carbs = Math.round(baseCalories * 0.55 / 4); // 55% كربوهيدرات
    const fat = Math.round(baseCalories * 0.30 / 9); // 30% دهون
    
    return {
      calories: baseCalories,
      protein,
      carbs,
      fat,
      fiber: Math.round(baseCalories / 100), // تقدير الألياف
      sodium: Math.round(baseCalories * 2) // تقدير الصوديوم
    };
  };

  const nutrition = estimateNutrition();

  const getHealthScore = () => {
    let score = 50; // نقطة البداية
    
    // زيادة النقاط للمكونات الصحية
    const healthyIngredients = ['خضروات', 'فواكه', 'عدس', 'حمص', 'أرز', 'سمك'];
    const unhealthyIngredients = ['زيت', 'سمن', 'سكر', 'ملح'];
    
    ingredients.forEach(ingredient => {
      if (healthyIngredients.some(healthy => ingredient.includes(healthy))) {
        score += 10;
      }
      if (unhealthyIngredients.some(unhealthy => ingredient.includes(unhealthy))) {
        score -= 5;
      }
    });
    
    return Math.min(Math.max(score, 0), 100);
  };

  const healthScore = getHealthScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "صحي جداً", color: "bg-green-100 text-green-700" };
    if (score >= 60) return { text: "صحي", color: "bg-yellow-100 text-yellow-700" };
    return { text: "متوسط", color: "bg-red-100 text-red-700" };
  };

  const scoreBadge = getScoreBadge(healthScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🥗</span>
          المعلومات الغذائية
          <Badge className={scoreBadge.color}>
            {scoreBadge.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">النقاط الصحية:</span>
            <span className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>
              {healthScore}/100
            </span>
          </div>
          <Progress value={healthScore} className="w-full" />
        </div>

        {/* Nutrition Facts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-primary">{nutrition.calories}</p>
            <p className="text-xs text-muted-foreground">سعرة حرارية</p>
            <p className="text-xs text-muted-foreground">لكل حصة</p>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{nutrition.protein}g</p>
            <p className="text-xs text-muted-foreground">بروتين</p>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{nutrition.carbs}g</p>
            <p className="text-xs text-muted-foreground">كربوهيدرات</p>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{nutrition.fat}g</p>
            <p className="text-xs text-muted-foreground">دهون</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">الألياف:</span>
            <span className="font-medium">{nutrition.fiber}g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الصوديوم:</span>
            <span className="font-medium">{nutrition.sodium}mg</span>
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="font-medium text-green-800 mb-2">💡 نصائح صحية</h4>
          <ul className="text-sm text-green-700 space-y-1">
            {healthScore >= 80 && (
              <li>• وصفة صحية ومتوازنة غذائياً</li>
            )}
            {ingredients.some(ing => ing.includes('خضروات') || ing.includes('طماطم')) && (
              <li>• غنية بالفيتامينات والمعادن</li>
            )}
            {ingredients.some(ing => ing.includes('عدس') || ing.includes('حمص')) && (
              <li>• مصدر جيد للبروتين النباتي</li>
            )}
            {nutrition.calories < 300 && (
              <li>• منخفضة السعرات الحرارية</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};