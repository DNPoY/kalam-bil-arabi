import { useState, useEffect } from 'react';
import { recipes, Recipe } from '@/data/recipes';

interface UserBehavior {
  favorites: string[];
  recentSearches: string[];
  cookingHistory: string[];
  preferredCategories: string[];
  averageCookTime: number;
  budgetPreference: 'low' | 'medium' | 'high';
}

interface AIRecommendation {
  recipe: Recipe;
  score: number;
  reason: string;
}

export const useAI = () => {
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    favorites: [],
    recentSearches: [],
    cookingHistory: [],
    preferredCategories: [],
    averageCookTime: 0,
    budgetPreference: 'medium'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeUserBehavior();
  }, []);

  const analyzeUserBehavior = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '{}');
    
    // تحليل الوصفات المفضلة
    const favoriteRecipes = favorites.map((id: string) => 
      recipes.find(r => r.id === id)
    ).filter(Boolean) as Recipe[];
    
    const preferredCategories = [...new Set(favoriteRecipes.map(r => r.category))];
    const averageCookTime = favoriteRecipes.length > 0 
      ? favoriteRecipes.reduce((sum, r) => sum + r.cookTime + r.prepTime, 0) / favoriteRecipes.length
      : 30;

    // تحليل الميزانية بناءً على الوصفات المفضلة
    const averageCost = favoriteRecipes.length > 0
      ? favoriteRecipes.reduce((sum, r) => sum + (r.estimatedCost || 50), 0) / favoriteRecipes.length
      : 50;
    
    const budgetPreference: 'low' | 'medium' | 'high' = 
      averageCost < 40 ? 'low' : averageCost > 80 ? 'high' : 'medium';

    setUserBehavior({
      favorites,
      recentSearches,
      cookingHistory: Object.values(mealPlan).flat().filter(Boolean) as string[],
      preferredCategories,
      averageCookTime,
      budgetPreference
    });
  };

  const getPersonalizedRecommendations = (count: number = 5): AIRecommendation[] => {
    setIsAnalyzing(true);
    
    const recommendations = recipes
      .filter(recipe => !userBehavior.favorites.includes(recipe.id))
      .map(recipe => {
        let score = 0;
        let reasons: string[] = [];

        // تقييم بناءً على الفئة المفضلة
        if (userBehavior.preferredCategories.includes(recipe.category)) {
          score += 30;
          reasons.push(`يناسب تفضيلك لـ${recipe.category}`);
        }

        // تقييم بناءً على وقت الطبخ
        const timeDiff = Math.abs((recipe.cookTime + recipe.prepTime) - userBehavior.averageCookTime);
        if (timeDiff <= 15) {
          score += 20;
          reasons.push('وقت طبخ مناسب لك');
        }

        // تقييم بناءً على الميزانية
        const recipeCost = recipe.estimatedCost || 50;
        if (
          (userBehavior.budgetPreference === 'low' && recipeCost <= 40) ||
          (userBehavior.budgetPreference === 'medium' && recipeCost <= 80) ||
          (userBehavior.budgetPreference === 'high')
        ) {
          score += 15;
          reasons.push('يناسب ميزانيتك');
        }

        // تقييم بناءً على البحوث الأخيرة
        const hasSearchedIngredients = recipe.ingredients.some(ingredient =>
          userBehavior.recentSearches.some(search =>
            ingredient.toLowerCase().includes(search.toLowerCase())
          )
        );
        if (hasSearchedIngredients) {
          score += 25;
          reasons.push('يحتوي على مكونات بحثت عنها');
        }

        // إضافة عشوائية للتنويع
        score += Math.random() * 10;

        return {
          recipe,
          score,
          reason: reasons.join(' • ') || 'وصفة مميزة'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, count);

    setIsAnalyzing(false);
    return recommendations;
  };

  const optimizeShoppingList = (ingredients: string[]): string[] => {
    // تجميع المكونات المتشابهة
    const optimized = [...new Set(ingredients)];
    
    // ترتيب حسب الفئات (خضروات، لحوم، إلخ)
    const categories = {
      vegetables: ['طماطم', 'بصل', 'ثوم', 'جزر', 'كوسة', 'باذنجان'],
      meat: ['لحمة', 'فراخ', 'سمك'],
      dairy: ['لبن', 'جبنة', 'زبدة', 'بيض'],
      grains: ['أرز', 'مكرونة', 'عدس', 'حمص'],
      spices: ['ملح', 'فلفل', 'كمون', 'كسبرة']
    };

    return optimized.sort((a, b) => {
      const getCategoryIndex = (ingredient: string) => {
        for (const [category, items] of Object.entries(categories)) {
          if (items.some(item => ingredient.includes(item))) {
            return Object.keys(categories).indexOf(category);
          }
        }
        return 999;
      };

      return getCategoryIndex(a) - getCategoryIndex(b);
    });
  };

  const generateWeeklyPlan = (): { [day: string]: Recipe[] } => {
    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const plan: { [day: string]: Recipe[] } = {};

    days.forEach(day => {
      const dayRecipes: Recipe[] = [];
      
      // إفطار سهل
      const breakfastOptions = recipes.filter(r => 
        r.category === 'سهل وسريع' && r.cookTime <= 20
      );
      if (breakfastOptions.length > 0) {
        const breakfast = breakfastOptions[Math.floor(Math.random() * Math.min(3, breakfastOptions.length))];
        if (breakfast) dayRecipes.push(breakfast);
      }
      
      // غداء متنوع
      const lunchOptions = recipes.filter(r => 
        userBehavior.preferredCategories.length === 0 || 
        userBehavior.preferredCategories.includes(r.category)
      );
      if (lunchOptions.length > 0) {
        const lunch = lunchOptions[Math.floor(Math.random() * Math.min(5, lunchOptions.length))];
        if (lunch) dayRecipes.push(lunch);
      }
      
      // عشاء خفيف
      const dinnerOptions = recipes.filter(r => 
        r.cookTime <= 30 && !dayRecipes.includes(r)
      );
      if (dinnerOptions.length > 0) {
        const dinner = dinnerOptions[Math.floor(Math.random() * Math.min(3, dinnerOptions.length))];
        if (dinner) dayRecipes.push(dinner);
      }

      plan[day] = dayRecipes;
    });

    return plan;
  };

  const generateSmartSuggestions = (currentIngredients: string[]) => {
    const suggestions = [];
    
    // اقتراح وصفات بناءً على المكونات المتاحة
    const compatibleRecipes = recipes.filter(recipe => 
      recipe.ingredients.some(ingredient =>
        currentIngredients.some(current => 
          ingredient.toLowerCase().includes(current.toLowerCase()) ||
          current.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    ).slice(0, 5);

    suggestions.push({
      type: 'recipes',
      title: 'وصفات مقترحة بناءً على مكوناتك',
      data: compatibleRecipes
    });

    // اقتراح مكونات مكملة
    const complementaryIngredients = [];
    compatibleRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (!currentIngredients.includes(ingredient) && 
            !complementaryIngredients.includes(ingredient)) {
          complementaryIngredients.push(ingredient);
        }
      });
    });

    suggestions.push({
      type: 'ingredients',
      title: 'مكونات مقترحة لتكملة وصفاتك',
      data: complementaryIngredients.slice(0, 8)
    });

    return suggestions;
  };

  const predictTrends = () => {
    // محاكاة تحليل الاتجاهات
    const trends = [
      {
        category: 'سهل وسريع',
        growth: 25,
        reason: 'زيادة الطلب على الوصفات السريعة'
      },
      {
        category: 'طواجن',
        growth: 15,
        reason: 'شعبية الطبخ التقليدي'
      },
      {
        category: 'شوربة',
        growth: 20,
        reason: 'موسم الشتاء'
      }
    ];

    return trends;
  };

  return {
    userBehavior,
    isAnalyzing,
    analyzeUserBehavior,
    getPersonalizedRecommendations,
    optimizeShoppingList,
    generateWeeklyPlan,
    generateSmartSuggestions,
    predictTrends
  };
};