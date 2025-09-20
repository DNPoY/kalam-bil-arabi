import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes, DatabaseRecipe } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function RecipeManagement() {
  const { isAuthenticated, signInAsGuest } = useAuth();
  const { 
    createRecipe, 
    updateRecipe, 
    deleteRecipe, 
    fetchMyRecipes, 
    uploadRecipeImage 
  } = useRecipes();

  const [myRecipes, setMyRecipes] = useState<DatabaseRecipe[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<DatabaseRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    prep_time: number;
    cook_time: number;
    difficulty: 'سهل' | 'متوسط' | 'صعب';
    category: 'محشي' | 'شوربة' | 'طواجن' | 'سهل وسريع' | 'تحضير طويل';
    servings: number;
    estimated_cost: number;
    ingredients: string[];
    instructions: string[];
    alternatives: any;
    is_public: boolean;
    is_featured: boolean;
  }>({
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

  const loadMyRecipes = async () => {
    const recipes = await fetchMyRecipes();
    setMyRecipes(recipes as DatabaseRecipe[]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMyRecipes();
    }
  }, [isAuthenticated]);

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
  };

  const openEditDialog = (recipe: DatabaseRecipe) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      difficulty: recipe.difficulty as 'سهل' | 'متوسط' | 'صعب',
      category: recipe.category as 'محشي' | 'شوربة' | 'طواجن' | 'سهل وسريع' | 'تحضير طويل',
      servings: recipe.servings,
      estimated_cost: recipe.estimated_cost || 0,
      ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
      instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
      alternatives: recipe.alternatives || {},
      is_public: recipe.is_public,
      is_featured: recipe.is_featured
    });
    setIsDialogOpen(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم الوصفة');
      return;
    }

    setLoading(true);

    try {
      // Filter out empty ingredients and instructions
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
        instructions: formData.instructions.filter(inst => inst.trim() !== '')
      };

      let imageUrl = editingRecipe?.image_url || null;

      // Upload image if provided
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

      setIsDialogOpen(false);
      resetForm();
      loadMyRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الوصفة؟')) {
      await deleteRecipe(recipeId);
      loadMyRecipes();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">إدارة الوصفات</h1>
          <p className="text-muted-foreground mb-6">يجب تسجيل الدخول لإدارة الوصفات</p>
          <Button onClick={signInAsGuest}>تسجيل الدخول كضيف</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الوصفات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة وصفة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecipe ? 'تعديل الوصفة' : 'إضافة وصفة جديدة'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <Label htmlFor="image">صورة الوصفة</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <Separator />

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

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'جاري الحفظ...' : editingRecipe ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {myRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">لم تقم بإضافة أي وصفات بعد</p>
            </CardContent>
          </Card>
        ) : (
          myRecipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {recipe.name}
                      {recipe.is_featured && (
                        <Badge variant="secondary">مميزة</Badge>
                      )}
                      {!recipe.is_public && (
                        <Badge variant="outline">خاصة</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recipe.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(recipe)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">التصنيف:</span> {recipe.category}
                  </div>
                  <div>
                    <span className="font-medium">الصعوبة:</span> {recipe.difficulty}
                  </div>
                  <div>
                    <span className="font-medium">الوقت:</span> {recipe.prep_time + recipe.cook_time} دقيقة
                  </div>
                  <div>
                    <span className="font-medium">عدد الأشخاص:</span> {recipe.servings}
                  </div>
                </div>
                <div className="mt-4">
                  <span className="font-medium">المكونات:</span> {recipe.ingredients.join('، ')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}