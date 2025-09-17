import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Trash2, Share2, MapPin, DollarSign } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { toast } from "sonner";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  price?: number;
  checked: boolean;
  urgent: boolean;
}

const ShoppingListPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");
  const [newCategory, setNewCategory] = useState("خضروات");
  const [filter, setFilter] = useState("all");
  const [totalEstimate, setTotalEstimate] = useState(0);
  const navigate = useNavigate();

  const categories = [
    "خضروات", "فواكه", "لحوم", "دواجن", "أسماك", "ألبان", 
    "حبوب", "توابل", "معلبات", "مخبوزات", "مشروبات", "أخرى"
  ];

  const categoryEmojis: { [key: string]: string } = {
    "خضروات": "🥬",
    "فواكه": "🍎",
    "لحوم": "🥩",
    "دواجن": "🐔",
    "أسماك": "🐟",
    "ألبان": "🥛",
    "حبوب": "🌾",
    "توابل": "🧂",
    "معلبات": "🥫",
    "مخبوزات": "🍞",
    "مشروبات": "🥤",
    "أخرى": "📦"
  };

  useEffect(() => {
    loadShoppingList();
  }, []);

  useEffect(() => {
    // حساب التكلفة التقديرية
    const total = items.reduce((sum, item) => {
      return sum + (item.price || 0) * parseInt(item.quantity || "1");
    }, 0);
    setTotalEstimate(total);
  }, [items]);

  const loadShoppingList = () => {
    const stored = localStorage.getItem('shoppingList');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  };

  const saveShoppingList = (newItems: ShoppingItem[]) => {
    setItems(newItems);
    localStorage.setItem('shoppingList', JSON.stringify(newItems));
  };

  const addItem = () => {
    if (!newItem.trim()) {
      toast.error("أدخل اسم المنتج");
      return;
    }

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      quantity: newQuantity,
      category: newCategory,
      checked: false,
      urgent: false
    };

    const newItems = [...items, item];
    saveShoppingList(newItems);
    
    setNewItem("");
    setNewQuantity("1");
    toast.success(`تم إضافة ${item.name}`);
  };

  const toggleItem = (id: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveShoppingList(newItems);
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    const newItems = items.filter(item => item.id !== id);
    saveShoppingList(newItems);
    toast.info(`تم حذف ${item?.name}`);
  };

  const toggleUrgent = (id: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, urgent: !item.urgent } : item
    );
    saveShoppingList(newItems);
  };

  const clearCompleted = () => {
    const newItems = items.filter(item => !item.checked);
    saveShoppingList(newItems);
    toast.info("تم مسح العناصر المكتملة");
  };

  const shareList = async () => {
    const listText = `قائمة التسوق:\n\n${
      items.map((item, index) => 
        `${index + 1}. ${item.name} - ${item.quantity} (${item.category})`
      ).join('\n')
    }\n\nالتكلفة التقديرية: ${totalEstimate} جنيه`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'قائمة التسوق',
          text: listText,
        });
        toast.success("تم مشاركة القائمة");
      } catch (error) {
        navigator.clipboard.writeText(listText);
        toast.success("تم نسخ القائمة للحافظة");
      }
    } else {
      navigator.clipboard.writeText(listText);
      toast.success("تم نسخ القائمة للحافظة");
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === "completed") return item.checked;
    if (filter === "pending") return !item.checked;
    if (filter === "urgent") return item.urgent;
    return true;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as { [key: string]: ShoppingItem[] });

  const completedCount = items.filter(item => item.checked).length;

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
            <h1 className="text-xl font-bold text-primary">قائمة التسوق</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={shareList}
                disabled={items.length === 0}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              {completedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompleted}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              ملخص القائمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{items.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي العناصر</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                <p className="text-sm text-muted-foreground">مكتمل</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{items.filter(i => i.urgent).length}</p>
                <p className="text-sm text-muted-foreground">عاجل</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalEstimate}</p>
                <p className="text-sm text-muted-foreground">جنيه (تقديري)</p>
              </div>
            </div>
            
            {items.length > 0 && (
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / items.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {Math.round((completedCount / items.length) * 100)}% مكتمل
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Item */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إضافة منتج جديد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="اسم المنتج"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="md:col-span-2"
              />
              <Input
                placeholder="الكمية"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {categoryEmojis[category]} {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addItem} className="w-full" disabled={!newItem.trim()}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة للقائمة
            </Button>
          </CardContent>
        </Card>

        {/* Filter */}
        {items.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل العناصر</SelectItem>
                  <SelectItem value="pending">غير مكتمل</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="urgent">عاجل</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Shopping List */}
        {Object.keys(groupedItems).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                قائمة التسوق فارغة
              </h3>
              <p className="text-muted-foreground mb-6">
                ابدأ بإضافة المنتجات التي تحتاجها
              </p>
              <Button onClick={() => navigate('/add-ingredients')}>
                أضف من الوصفات
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{categoryEmojis[category]}</span>
                    {category}
                    <Badge variant="outline" className="ml-auto">
                      {categoryItems.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          item.checked 
                            ? 'bg-green-50 border-green-200 opacity-75' 
                            : item.urgent
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-background border-border hover:border-primary/20'
                        }`}
                      >
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
                            }`}>
                              {item.name}
                            </span>
                            {item.urgent && !item.checked && (
                              <Badge variant="destructive" className="text-xs">
                                عاجل
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            الكمية: {item.quantity}
                            {item.price && ` • ${item.price * parseInt(item.quantity)} جنيه`}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUrgent(item.id)}
                            className={`text-xs ${
                              item.urgent ? 'text-orange-600' : 'text-muted-foreground'
                            }`}
                          >
                            ⚡
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {items.length > 0 && (
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
                  <span className="text-sm">أضف من الوصفات</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={shareList}
                  className="h-auto p-4 flex flex-col space-y-2"
                >
                  <span className="text-2xl">📤</span>
                  <span className="text-sm">مشاركة القائمة</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // فتح خرائط جوجل للبحث عن أقرب سوبر ماركت
                    window.open('https://maps.google.com/search/supermarket+near+me', '_blank');
                  }}
                  className="h-auto p-4 flex flex-col space-y-2"
                >
                  <span className="text-2xl">📍</span>
                  <span className="text-sm">أقرب سوبر ماركت</span>
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

export default ShoppingListPage;