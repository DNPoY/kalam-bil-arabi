import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Check, 
  X, 
  Eye, 
  Edit, 
  Trash2, 
  Upload, 
  Star, 
  Users, 
  TrendingUp,
  Plus,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRecipes, DatabaseRecipe } from "@/hooks/useRecipes";
import { toast } from "sonner";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    recipes, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe, 
    uploadRecipeImage,
    fetchRecipes 
  } = useRecipes();

  const [pendingRecipes, setPendingRecipes] = useState<DatabaseRecipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<DatabaseRecipe[]>([]);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    pendingApproval: 0,
    featuredRecipes: 0,
    totalUsers: 0
  });
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<DatabaseRecipe | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prep_time: 15,
    cook_time: 30,
    difficulty: 'سهل' as const,
    category: 'سهل وسريع' as const,
    servings: 4,
    estimated_cost: 50,
    ingredients: [''],
    instructions: [''],
    alternatives: {},
    is_public: true,
    is_featured: false
  });

  // فحص صلاحيات الأدمن
  const isAdmin = user?.email === 'admin@example.com' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!isAdmin) {
      toast.error("ليس لديك صلاحية للوصول لهذه الصفحة");
      navigate('/');
      return;
    }

    loadAdminData();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadAdminData = async () => {
    try {
      await fetchRecipes();
      
      // محاكاة بيانات الأدمن
      const mockPending = recipes.filter(r => !r.is_public).slice(0, 3);
      const mockFeatured = recipes.filter(r => r.is_featured);
      
      setPendingRecipes(mockPending);
      setFeaturedRecipes(mockFeatured);
      
      setStats({
        totalRecipes: recipes.length,
        pendingApproval: mockPending.length,
        featuredRecipes: mockFeatured.length,
        totalUsers: 1247 // محاكاة
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const approveRecipe = async (recipeId: string) => {
    try {
      await updateRecipe(recipeId, { is_public: true });
      toast.success("تم الموافقة على الوصفة");
      loadAdminData();
    } catch (error) {
      toast.error("حدث خطأ في الموافقة على الوصفة");
    }
  };

  const rejectRecipe = async (recipeId: string) => {
    try {
      await deleteRecipe(recipeId);
      toast.success("تم رفض الوصفة");
      loadAdminData();
    } catch (error) {
      toast.error("حدث خطأ في رفض الوصفة");
    }
  };

  const toggleFeatured = async (recipeId: string, currentStatus: boolean) => {
    try {
      await updateRecipe(recipeId, { is_featured: !currentStatus });
      toast.success(currentStatus ? "تم إلغاء التمييز" : "تم تمييز الوصفة");
      loadAdminData();
    } catch (error) {
      toast.error("حدث خطأ في تحديث حالة التمييز");
    }
  };

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const handleAddInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleRemoveInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      prep_time: 15,
      cook_time: 30,
      difficulty: 'سهل',
      category: 'سهل وسريع',
      servings: 4,
      estimated_cost: 50,
      ingredients: [''],
      instructions: [''],
      alternatives: {},
      is_public: true,
      is_featured: false
    });
    setEditingRecipe(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم الوصفة');
      return;
    }

    try {
      // تنظيف البيانات
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
        instructions: formData.instructions.filter(inst => inst.trim() !== '')
      };

      let imageUrl = editingRecipe?.image_url || null;

      // رفع الصورة إذا تم اختيارها
      if (imageFile) {
        const tempId = editingRecipe?.id || Date.now().toString();
        imageUrl = await uploadRecipeImage(imageFile, tempId);
      }

      const recipeData = {
        ...cleanedData,
        image_url: imageUrl
      };

      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, recipeData);
      } else {
        await createRecipe(recipeData);
      }

      setShowAddRecipe(false);
      resetForm();
      loadAdminData();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-food-cream to-secondary/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">غير مصرح</h3>
            <p className="text-sm text-muted-foreground">ليس لديك صلاحية للوصول لهذه الصفحة</p>
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
            <h1 className="text-xl font-bold text-primary">لوحة تحكم الأدمن</h1>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              <Shield className="w-3 h-3 ml-1" />
              أدمن
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              إحصائيات عامة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.totalRecipes}</p>
                <p className="text-sm text-muted-foreground">إجمالي الوصفات</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApproval}</p>
                <p className="text-sm text-muted-foreground">في انتظار الموافقة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.featuredRecipes}</p>
                <p className="text-sm text-muted-foreground">وصفات مميزة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">المستخدمين</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">الوصفات المعلقة</TabsTrigger>
            <TabsTrigger value="featured">الوصفات المميزة</TabsTrigger>
            <TabsTrigger value="add">إضافة وصفة</TabsTrigger>
          </TabsList>

          {/* Pending Recipes */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  الوصفات في انتظار الموافقة ({pendingRecipes.length})
                </CardTitle>
                <CardDescription>
                  راجع الوصفات المرسلة من الأعضاء ووافق عليها أو ارفضها
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRecipes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">✅</div>
                    <p className="text-muted-foreground">لا توجد وصفات في انتظار الموافقة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRecipes.map((recipe) => (
                      <Card key={recipe.id} className="border-orange-200">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{recipe.name}</CardTitle>
                              <CardDescription>{recipe.description}</CardDescription>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>⏱️ {recipe.prep_time + recipe.cook_time} د</span>
                                <span>🔥 {recipe.difficulty}</span>
                                <span>👥 {recipe.servings}</span>
                                <Badge variant="outline">{recipe.category}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveRecipe(recipe.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectRecipe(recipe.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium mb-2">المكونات:</h5>
                              <div className="flex flex-wrap gap-1">
                                {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {ingredient}
                                  </Badge>
                                ))}
                                {recipe.ingredients.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{recipe.ingredients.length - 5}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">أول خطوة:</h5>
                              <p className="text-sm text-muted-foreground">
                                {recipe.instructions[0]?.substring(0, 100)}...
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Recipes */}
          <TabsContent value="featured" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  الوصفات المميزة ({featuredRecipes.length})
                </CardTitle>
                <CardDescription>
                  إدارة الوصفات المميزة التي تظهر في الصفحة الرئيسية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipes.map((recipe) => (
                    <Card key={recipe.id} className={recipe.is_featured ? "border-yellow-200 bg-yellow-50" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {recipe.name}
                              {recipe.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-700">
                                  <Star className="w-3 h-3 ml-1" />
                                  مميز
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{recipe.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFeatured(recipe.id, recipe.is_featured)}
                              className={recipe.is_featured ? "text-yellow-600" : ""}
                            >
                              <Star className={`w-4 h-4 ${recipe.is_featured ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRecipe(recipe);
                                setFormData({
                                  name: recipe.name,
                                  description: recipe.description || '',
                                  prep_time: recipe.prep_time,
                                  cook_time: recipe.cook_time,
                                  difficulty: recipe.difficulty as any,
                                  category: recipe.category as any,
                                  servings: recipe.servings,
                                  estimated_cost: recipe.estimated_cost || 0,
                                  ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
                                  instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
                                  alternatives: recipe.alternatives || {},
                                  is_public: recipe.is_public,
                                  is_featured: recipe.is_featured
                                });
                                setShowAddRecipe(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (confirm('هل أنت متأكد من حذف هذه الوصفة؟')) {
                                  deleteRecipe(recipe.id);
                                  loadAdminData();
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Recipe */}
          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة وصفة جديدة
                </CardTitle>
                <CardDescription>
                  أضف وصفة جديدة مع صورة من مكتبتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">اسم الوصفة *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">التصنيف</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="محشي">محشي</SelectItem>
                          <SelectItem value="شوربة">شوربة</SelectItem>
                          <SelectItem value="طواجن">طواجن</SelectItem>
                          <SelectItem value="سهل وسريع">سهل وسريع</SelectItem>
                          <SelectItem value="تحضير طويل">تحضير طويل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label htmlFor="image">صورة الوصفة</Label>
                    <div className="space-y-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {imagePreview && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                          <img 
                            src={imagePreview} 
                            alt="معاينة الصورة"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-1 right-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipe Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="prep_time">وقت التحضير (دقيقة)</Label>
                      <Input
                        id="prep_time"
                        type="number"
                        value={formData.prep_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, prep_time: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cook_time">وقت الطبخ (دقيقة)</Label>
                      <Input
                        id="cook_time"
                        type="number"
                        value={formData.cook_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, cook_time: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="servings">عدد الأشخاص</Label>
                      <Input
                        id="servings"
                        type="number"
                        value={formData.servings}
                        onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="estimated_cost">التكلفة المتوقعة (جنيه)</Label>
                      <Input
                        id="estimated_cost"
                        type="number"
                        value={formData.estimated_cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">الصعوبة</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="سهل">سهل</SelectItem>
                        <SelectItem value="متوسط">متوسط</SelectItem>
                        <SelectItem value="صعب">صعب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Ingredients */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>المكونات *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            placeholder="أدخل المكون"
                          />
                          {formData.ingredients.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveIngredient(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>خطوات التحضير *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddInstruction}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={instruction}
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                            placeholder={`الخطوة ${index + 1}`}
                            rows={2}
                          />
                          {formData.instructions.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveInstruction(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Admin Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_public">نشر الوصفة للعامة</Label>
                      <Switch
                        id="is_public"
                        checked={formData.is_public}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_featured">وصفة مميزة</Label>
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      إعادة تعيين
                    </Button>
                    <Button type="submit">
                      {editingRecipe ? 'تحديث الوصفة' : 'إضافة الوصفة'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/recipes')}
                className="h-auto p-4 flex flex-col space-y-2"
              >
                <span className="text-2xl">📖</span>
                <span className="text-sm">عرض كل الوصفات</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/community')}
                className="h-auto p-4 flex flex-col space-y-2"
              >
                <span className="text-2xl">👥</span>
                <span className="text-sm">مجتمع الطباخين</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/settings')}
                className="h-auto p-4 flex flex-col space-y-2"
              >
                <span className="text-2xl">⚙️</span>
                <span className="text-sm">إعدادات التطبيق</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;