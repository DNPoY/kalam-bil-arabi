import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, Plus, Search, TrendingUp, Users, Award } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { Rating } from "@/components/ui/rating";
import { toast } from "sonner";

interface CommunityRecipe {
  id: string;
  name: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  rating: number;
  reviews: number;
  likes: number;
  difficulty: string;
  cookTime: number;
  category: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  createdAt: string;
  isLiked: boolean;
}

const Community = () => {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "طواجن",
    difficulty: "متوسط",
    cookTime: 30
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCommunityRecipes();
  }, []);

  const loadCommunityRecipes = () => {
    // محاكاة بيانات المجتمع
    const mockRecipes: CommunityRecipe[] = [
      {
        id: "community-1",
        name: "كشري أم محمد الأصلي",
        description: "وصفة كشري عائلية متوارثة من جدتي، بطعم مميز وسر خاص في الصلصة",
        image: "🍛",
        author: {
          name: "أم محمد",
          avatar: "👩‍🍳",
          level: "طباخة ماهرة"
        },
        rating: 4.8,
        reviews: 127,
        likes: 342,
        difficulty: "متوسط",
        cookTime: 45,
        category: "سهل وسريع",
        ingredients: ["أرز", "عدس", "شعرية", "حمص", "بصل", "طماطم"],
        instructions: ["اسلقي العدس والحمص", "حضري الأرز بالشعرية", "اعملي الصلصة الخاصة"],
        tags: ["تقليدي", "عائلي", "مصري"],
        createdAt: "2024-01-15",
        isLiked: false
      },
      {
        id: "community-2", 
        name: "ملوخية بالجمبري",
        description: "تطوير عصري على الملوخية التقليدية بإضافة الجمبري للطعم الرائع",
        image: "🦐",
        author: {
          name: "الشيف أحمد",
          avatar: "👨‍🍳",
          level: "شيف محترف"
        },
        rating: 4.6,
        reviews: 89,
        likes: 256,
        difficulty: "صعب",
        cookTime: 60,
        category: "شوربة",
        ingredients: ["ملوخية", "جمبري", "شوربة سمك", "ثوم", "كسبرة"],
        instructions: ["نظفي الجمبري", "حضري شوربة السمك", "أضيفي الملوخية"],
        tags: ["عصري", "مأكولات بحرية", "فاخر"],
        createdAt: "2024-01-10",
        isLiked: true
      },
      {
        id: "community-3",
        name: "محشي كوسة بالطريقة الشامية",
        description: "محشي كوسة لذيذ بلمسة شامية مميزة، مناسب للعزائم",
        image: "🥒",
        author: {
          name: "ست هالة",
          avatar: "👵",
          level: "خبيرة طبخ"
        },
        rating: 4.9,
        reviews: 203,
        likes: 445,
        difficulty: "صعب",
        cookTime: 90,
        category: "محشي",
        ingredients: ["كوسة", "أرز", "لحمة مفرومة", "نعناع", "بقدونس"],
        instructions: ["احفري الكوسة", "حضري الحشو", "اطبخي في الصلصة"],
        tags: ["شامي", "محشي", "عزائم"],
        createdAt: "2024-01-08",
        isLiked: false
      }
    ];

    setRecipes(mockRecipes);
  };

  const toggleLike = (recipeId: string) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === recipeId 
        ? { 
            ...recipe, 
            isLiked: !recipe.isLiked,
            likes: recipe.isLiked ? recipe.likes - 1 : recipe.likes + 1
          }
        : recipe
    ));
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      toast.success(recipe.isLiked ? "تم إلغاء الإعجاب" : "تم الإعجاب بالوصفة");
    }
  };

  const shareRecipe = async (recipe: CommunityRecipe) => {
    const shareText = `شوف الوصفة الرائعة دي: ${recipe.name} من ${recipe.author.name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: shareText,
        });
        toast.success("تم مشاركة الوصفة");
      } catch (error) {
        navigator.clipboard.writeText(shareText);
        toast.success("تم نسخ رابط الوصفة");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("تم نسخ رابط الوصفة");
    }
  };

  const submitRecipe = () => {
    if (!newRecipe.name || !newRecipe.description) {
      toast.error("برجاء ملء البيانات المطلوبة");
      return;
    }

    const recipe: CommunityRecipe = {
      id: `community-${Date.now()}`,
      name: newRecipe.name,
      description: newRecipe.description,
      image: "🍽️",
      author: {
        name: "أنت",
        avatar: "👤",
        level: "طباخ مبتدئ"
      },
      rating: 0,
      reviews: 0,
      likes: 0,
      difficulty: newRecipe.difficulty as any,
      cookTime: newRecipe.cookTime,
      category: newRecipe.category as any,
      ingredients: newRecipe.ingredients.split('\n').filter(i => i.trim()),
      instructions: newRecipe.instructions.split('\n').filter(i => i.trim()),
      tags: ["جديد"],
      createdAt: new Date().toISOString().split('T')[0],
      isLiked: false
    };

    setRecipes([recipe, ...recipes]);
    setShowAddRecipe(false);
    setNewRecipe({
      name: "",
      description: "",
      ingredients: "",
      instructions: "",
      category: "طواجن",
      difficulty: "متوسط",
      cookTime: 30
    });
    
    toast.success("تم إضافة وصفتك للمجتمع!");
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-xl font-bold text-primary">مجتمع الطباخين</h1>
            <Dialog open={showAddRecipe} onOpenChange={setShowAddRecipe}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>شارك وصفتك</DialogTitle>
                  <DialogDescription>
                    شارك وصفتك المميزة مع مجتمع الطباخين
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="اسم الوصفة"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                  />
                  <Textarea
                    placeholder="وصف الطبق وما يميزه..."
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}
                  />
                  <Textarea
                    placeholder="المكونات (كل مكون في سطر منفصل)"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
                  />
                  <Textarea
                    placeholder="طريقة التحضير (كل خطوة في سطر منفصل)"
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
                  />
                  <Button onClick={submitRecipe} className="w-full">
                    شارك الوصفة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Community Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              إحصائيات المجتمع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">1,247</p>
                <p className="text-sm text-muted-foreground">طباخ</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">3,892</p>
                <p className="text-sm text-muted-foreground">وصفة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">15,634</p>
                <p className="text-sm text-muted-foreground">تقييم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في وصفات المجتمع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="طواجن">طواجن</TabsTrigger>
                  <TabsTrigger value="محشي">محشي</TabsTrigger>
                  <TabsTrigger value="شوربة">شوربة</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Trending Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              الوصفات الرائجة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecipes.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl">{recipe.image}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{recipe.name}</h4>
                    <p className="text-sm text-muted-foreground">بواسطة {recipe.author.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{recipe.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Recipes */}
        <div className="space-y-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{recipe.author.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{recipe.author.name}</h3>
                      <p className="text-sm text-muted-foreground">{recipe.author.level}</p>
                      <p className="text-xs text-muted-foreground">{recipe.createdAt}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{recipe.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{recipe.image}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground mb-2">{recipe.name}</h2>
                    <p className="text-muted-foreground text-sm line-clamp-2">{recipe.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>⏱️ {recipe.cookTime} دقيقة</span>
                  <span>🔥 {recipe.difficulty}</span>
                  <div className="flex items-center gap-1">
                    <Rating value={recipe.rating} readonly size="sm" />
                    <span>({recipe.reviews})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(recipe.id)}
                      className={`${recipe.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart className={`w-4 h-4 ml-1 ${recipe.isLiked ? 'fill-current' : ''}`} />
                      {recipe.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageCircle className="w-4 h-4 ml-1" />
                      {recipe.reviews}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => shareRecipe(recipe)}
                      className="text-muted-foreground"
                    >
                      <Share2 className="w-4 h-4 ml-1" />
                      مشاركة
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    عرض الوصفة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لم يتم العثور على وصفات
              </h3>
              <p className="text-muted-foreground">
                جرب تغيير كلمات البحث أو الفلترة
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Community;