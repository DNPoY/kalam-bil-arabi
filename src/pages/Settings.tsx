import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Bell, Globe, Trash2, Heart, Book } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { toast } from "sonner";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recentSearchesCount, setRecentSearchesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // جلب الإعدادات المحفوظة
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedLanguage = localStorage.getItem('language') || 'ar';
    
    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);
    setLanguage(savedLanguage);

    // تطبيق الوضع المظلم
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // حساب عدد المفضلة والبحوث الأخيرة
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setFavoritesCount(favorites.length);
    setRecentSearchesCount(recentSearches.length);
  }, []);

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', enabled.toString());
    
    if (enabled) {
      document.documentElement.classList.add('dark');
      toast.success("تم تفعيل الوضع المظلم");
    } else {
      document.documentElement.classList.remove('dark');
      toast.success("تم إلغاء الوضع المظلم");
    }
  };

  const toggleNotifications = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', enabled.toString());
    
    if (enabled) {
      toast.success("تم تفعيل الإشعارات");
    } else {
      toast.info("تم إلغاء الإشعارات");
    }
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    if (newLanguage === 'ar') {
      toast.success("تم تغيير اللغة إلى العربية");
    } else {
      toast.success("Language changed to English");
    }
  };

  const clearFavorites = () => {
    localStorage.removeItem('favorites');
    setFavoritesCount(0);
    toast.info("تم مسح كل المفضلة");
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearchesCount(0);
    toast.info("تم مسح تاريخ البحث");
  };

  const clearAllData = () => {
    localStorage.removeItem('favorites');
    localStorage.removeItem('recentSearches');
    localStorage.removeItem('selectedIngredients');
    setFavoritesCount(0);
    setRecentSearchesCount(0);
    toast.success("تم مسح كل البيانات");
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
            <h1 className="text-xl font-bold text-primary">الإعدادات</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* App Info */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl mb-4">
              ⚙️
            </div>
            <CardTitle>إعدادات في التلاجة</CardTitle>
            <CardDescription>
              تخصيص تجربتك في التطبيق
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              إعدادات العرض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="font-medium">الوضع المظلم</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  وضع مريح للعينين في الإضاءة المنخفضة
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <Separator />

            {/* Language */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium">اللغة</span>
              </div>
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">إشعارات التطبيق</span>
                <p className="text-sm text-muted-foreground">
                  اقتراحات يومية ونصائح طبخ
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={toggleNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              إدارة البيانات
            </CardTitle>
            <CardDescription>
              مسح البيانات المحفوظة في التطبيق
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Favorites */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-red-500" />
                <div>
                  <span className="font-medium">المفضلة</span>
                  <p className="text-sm text-muted-foreground">
                    {favoritesCount} وصفة محفوظة
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFavorites}
                disabled={favoritesCount === 0}
                className="text-red-500 hover:text-red-600"
              >
                مسح
              </Button>
            </div>

            {/* Recent Searches */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Book className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="font-medium">تاريخ البحث</span>
                  <p className="text-sm text-muted-foreground">
                    {recentSearchesCount} عملية بحث
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearRecentSearches}
                disabled={recentSearchesCount === 0}
                className="text-blue-500 hover:text-blue-600"
              >
                مسح
              </Button>
            </div>

            <Separator />

            {/* Clear All Data */}
            <Button 
              variant="destructive" 
              onClick={clearAllData}
              className="w-full"
              disabled={favoritesCount === 0 && recentSearchesCount === 0}
            >
              <Trash2 className="w-4 h-4 ml-2" />
              مسح كل البيانات
            </Button>
          </CardContent>
        </Card>

        {/* Performance Monitor */}
        <PerformanceMonitor />

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>حول التطبيق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">في التلاجة</h3>
              <p className="text-sm text-muted-foreground">
                الإصدار 1.0.0
              </p>
              <p className="text-sm text-muted-foreground">
                تطبيق للبحث عن الوصفات المصرية بناءً على المكونات المتاحة
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{favoritesCount}</p>
                <p className="text-sm text-muted-foreground">وصفة مفضلة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{recentSearchesCount}</p>
                <p className="text-sm text-muted-foreground">عملية بحث</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/recipes')}
                className="h-auto p-4 flex flex-col space-y-2"
              >
                <span className="text-2xl">📖</span>
                <span className="text-sm">تصفح الوصفات</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/add-ingredients')}
                className="h-auto p-4 flex flex-col space-y-2"
              >
                <span className="text-2xl">🥬</span>
                <span className="text-sm">أضف مكونات</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;