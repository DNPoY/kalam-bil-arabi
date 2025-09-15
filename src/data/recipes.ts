export interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  category: 'محشي' | 'شوربة' | 'طواجن' | 'مقلية' | 'مشوية';
  ingredients: string[];
  instructions: string[];
  description: string;
  servings: number;
  estimatedCost?: number;
  alternatives?: { [key: string]: string };
}

export const recipes: Recipe[] = [
  {
    id: 'molokhia',
    name: 'ملوخية بالفراخ',
    image: '🍲',
    prepTime: 15,
    cookTime: 45,
    difficulty: 'متوسط',
    category: 'شوربة',
    servings: 4,
    estimatedCost: 80,
    description: 'أكلة مصرية تقليدية وشعبية، طعمها مميز ومفيدة جداً',
    ingredients: [
      'فراخ مقطعة',
      'ملوخية مفرومة',
      'شوربة فراخ',
      'ثوم',
      'كسبرة ناشفة',
      'ملح',
      'فلفل أسود',
      'سمن أو زيت'
    ],
    instructions: [
      'اسلقي الفراخ في ماء مغلي مع البصل والحبهان والملح',
      'أخرجي الفراخ واتركي الشوربة على النار',
      'في مقلاة، حمري الثوم المفروم في السمن',
      'أضيفي الكسبرة الناشفة المطحونة',
      'أضيفي الملوخية واستمري في التحريك',
      'أضيفي الشوربة تدريجياً واتركيها تغلي',
      'تبلي بالملح والفلفل الأسود',
      'اتركيها تنضج لمدة 10 دقائق'
    ],
    alternatives: {
      'كسبرة ناشفة': 'بقدونس مجفف',
      'سمن': 'زيت ذرة أو عباد الشمس'
    }
  },
  {
    id: 'koshari',
    name: 'كشري',
    image: '🍚',
    prepTime: 20,
    cookTime: 40,
    difficulty: 'متوسط',
    category: 'مقلية',
    servings: 6,
    estimatedCost: 45,
    description: 'الأكلة الشعبية الأولى في مصر، مليانة طاقة ومشبعة',
    ingredients: [
      'أرز أبيض',
      'عدس أسود',
      'شعرية',
      'حمص حب',
      'بصل',
      'طماطم',
      'ثوم',
      'خل',
      'صلصة طماطم',
      'زيت',
      'شطة',
      'كمون'
    ],
    instructions: [
      'اسلقي العدس والحمص منفصلين حتى ينضجوا',
      'اطبخي الأرز مع الشعرية المحمرة',
      'قطعي البصل شرائح واقليه حتى يذبل ويحمر',
      'اعملي الصلصة: حمري الثوم في الزيت، أضيفي الطماطم والصلصة',
      'تبلي الصلصة بالملح والفلفل والكمون',
      'اعملي الدقة: ثوم وخل وشطة وملح',
      'في الطبق، ضعي طبقة من الأرز ثم العدس والحمص',
      'أضيفي الصلصة والبصل المحمر والدقة'
    ],
    alternatives: {
      'عدس أسود': 'عدس أحمر',
      'خل': 'عصير ليمون'
    }
  },
  {
    id: 'mahshi',
    name: 'محشي كرنب',
    image: '🥬',
    prepTime: 30,
    cookTime: 60,
    difficulty: 'صعب',
    category: 'محشي',
    servings: 6,
    estimatedCost: 70,
    description: 'محشي لذيذ ومشبع، يحتاج صبر في التحضير بس النتيجة تستاهل',
    ingredients: [
      'كرنب كبير',
      'أرز',
      'لحمة مفرومة',
      'بصل',
      'طماطم',
      'بقدونس',
      'شبت',
      'ملح',
      'فلفل أسود',
      'بهارات مشكلة',
      'زيت'
    ],
    instructions: [
      'اسلقي الكرنب في ماء مغلي حتى تلين الأوراق',
      'اتركي الكرنب يبرد وافصلي الأوراق بحرص',
      'اخلطي الأرز مع اللحمة المفرومة والبصل المبشور',
      'أضيفي الطماطم المبشورة والخضرة المفرومة',
      'تبلي الخلطة بالملح والفلفل والبهارات',
      'ضعي ملعقة من الحشو في كل ورقة كرنب واطويها',
      'رصي المحشي في الحلة مع شرائح الطماطم',
      'أضيفي الماء واتركيه ينضج على نار هادئة لمدة ساعة'
    ],
    alternatives: {
      'لحمة مفرومة': 'فراخ مفرومة',
      'شبت': 'بقدونس إضافي'
    }
  },
  {
    id: 'roz-bel-laban',
    name: 'أرز باللبن',
    image: '🍚',
    prepTime: 10,
    cookTime: 30,
    difficulty: 'سهل',
    category: 'مقلية',
    servings: 4,
    estimatedCost: 25,
    description: 'حلو مصري تقليدي، خفيف ولذيذ ومحبوب من الكل',
    ingredients: [
      'أرز مسلوق',
      'لبن',
      'سكر',
      'نشا',
      'فانيليا',
      'قرفة',
      'جوز هند مبشور',
      'زبيب'
    ],
    instructions: [
      'اسلقي الأرز جيداً حتى يصبح طرياً',
      'في إناء آخر، ضعي اللبن على النار',
      'أضيفي السكر وحركي حتى يذوب',
      'اخلطي النشا في قليل من اللبن البارد',
      'أضيفي النشا المذاب للبن المغلي مع التحريك',
      'أضيفي الأرز المسلوق واتركي الخليط ينضج',
      'أضيفي الفانيليا في النهاية',
      'اسكبيه في أكواب وزينيه بالقرفة والجوز هند'
    ],
    alternatives: {
      'نشا': 'دقيق مذاب في لبن',
      'جوز هند': 'لوز مقطع'
    }
  },
  {
    id: 'batates-bel-salsa',
    name: 'بطاطس بالصلصة',
    image: '🥔',
    prepTime: 15,
    cookTime: 25,
    difficulty: 'سهل',
    category: 'طواجن',
    servings: 4,
    estimatedCost: 30,
    description: 'أكلة سريعة وسهلة، مناسبة للغداء أو العشاء',
    ingredients: [
      'بطاطس',
      'طماطم',
      'بصل',
      'ثوم',
      'صلصة طماطم',
      'فلفل أخضر',
      'زيت',
      'ملح',
      'فلفل أسود',
      'بهارات'
    ],
    instructions: [
      'قشري البطاطس وقطعيها مكعبات',
      'اقلي البطاطس في الزيت حتى تحمر قليلاً',
      'في مقلاة أخرى، حمري البصل والثوم',
      'أضيفي الطماطم المقطعة والفلفل الأخضر',
      'أضيفي الصلصة والتوابل',
      'أضيفي البطاطس المقلية للصلصة',
      'أضيفي قليل من الماء واتركيها تنضج',
      'تقدم مع الأرز الأبيض'
    ],
    alternatives: {
      'فلفل أخضر': 'جزر مقطع',
      'صلصة طماطم': 'طماطم مبشورة إضافية'
    }
  },
  {
    id: 'bamya',
    name: 'بامية باللحمة',
    image: '🟢',
    prepTime: 20,
    cookTime: 45,
    difficulty: 'متوسط',
    category: 'طواجن',
    servings: 5,
    estimatedCost: 90,
    description: 'طبق شعبي مصري، البامية طعمها مميز مع اللحمة',
    ingredients: [
      'بامية',
      'لحمة مقطعة مكعبات',
      'طماطم',
      'بصل',
      'ثوم',
      'صلصة طماطم',
      'زيت',
      'خل',
      'ملح',
      'فلفل أسود',
      'كزبرة خضراء'
    ],
    instructions: [
      'نظفي البامية واغسليها بالخل',
      'في مقلاة، حمري قطع اللحمة في الزيت',
      'أخرجي اللحمة واتركيها جانباً',
      'في نفس المقلاة، حمري البصل والثوم',
      'أضيفي الطماطم والصلصة',
      'أعيدي اللحمة للمقلاة وأضيفي الماء',
      'اتركي اللحمة تنضج ثم أضيفي البامية',
      'تبلي بالملح والفلفل واتركيها تنضج'
    ],
    alternatives: {
      'كزبرة خضراء': 'بقدونس',
      'خل': 'عصير ليمون'
    }
  }
];

export const getRecipesByIngredients = (ingredients: string[]): Recipe[] => {
  return recipes.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    return ingredients.some(ingredient => 
      recipeIngredients.some(recipeIng => 
        recipeIng.includes(ingredient.toLowerCase()) || 
        ingredient.toLowerCase().includes(recipeIng)
      )
    );
  });
};

export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

export const getRandomRecipe = (): Recipe => {
  const randomIndex = Math.floor(Math.random() * recipes.length);
  return recipes[randomIndex];
};