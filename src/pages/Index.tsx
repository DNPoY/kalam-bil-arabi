import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import BottomNavigation from "@/components/ui/bottom-navigation";
import fridgeHero from "@/assets/fridge-hero.jpg";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success("تم تسجيل الخروج بنجاح");
      navigate('/auth');
    } else {
      toast.error("حدث خطأ في تسجيل الخروج");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-food-cream via-secondary to-accent/20 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-food-cream via-secondary to-accent/20 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-8 animate-fade-in">
          {/* App Logo */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-6 rounded-3xl shadow-warm overflow-hidden">
              <img 
                src={fridgeHero} 
                alt="في التلاجة" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
              🍽️ في التلاجة
            </div>
          </div>

          {/* App Title */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              في التلاجة
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              اعرف تطبخ إيه من اللي عندك!
            </p>
          </div>

          {/* Loading indicator */}
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-food-cream to-secondary/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-soft border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src={fridgeHero} alt="في التلاجة" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">في التلاجة</h1>
                <p className="text-sm text-muted-foreground">
                  مرحباً {user?.user_metadata?.display_name || user?.email || 'ضيف'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/recipe-management')}
                className="text-muted-foreground hover:text-primary"
              >
                <ChefHat className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="text-muted-foreground hover:text-primary"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            أهلاً وسهلاً! 👋
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ضيف المكونات اللي عندك في البيت، وهنقترح عليك أحلى الوصفات المصرية اللي تقدر تعملها
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Add Ingredients Card */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border hover:shadow-warm transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🥬
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">أضف مكونات</h3>
                <p className="text-muted-foreground mb-6">
                  اكتب المكونات اللي عندك أو صور محتويات التلاجة
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => navigate('/add-ingredients')}
                  >
                    ✍️ اكتب المكونات
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => navigate('/camera')}
                  >
                    📸 صور المكونات
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Random Recipe Card */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border hover:shadow-warm transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🎲
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">أكلة عشوائية اليوم</h3>
                <p className="text-muted-foreground mb-6">
                  اكتشف وصفة مصرية جديدة كل يوم
                </p>
                <div className="bg-accent/20 rounded-xl p-4 mb-6">
                  <div className="w-12 h-12 mx-auto bg-food-red rounded-lg mb-3 flex items-center justify-center text-white text-xl">
                    🍲
                  </div>
                  <h4 className="font-bold text-accent-foreground">ملوخية بالفراخ</h4>
                  <p className="text-sm text-muted-foreground">⏱️ 45 دقيقة • 🔥 متوسط</p>
                </div>
                <Button 
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={() => navigate('/recipe/molokhia')}
                >
                  🍽️ شوف الوصفة
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">إيه اللي تقدر تعمله كمان؟</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              variant="ghost" 
              className="h-auto p-4 flex flex-col space-y-2 hover:bg-accent/10"
              onClick={() => navigate('/recipes')}
            >
              <span className="text-2xl">📖</span>
              <span className="text-sm">تصفح الوصفات</span>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-4 flex flex-col space-y-2 hover:bg-accent/10"
              onClick={() => navigate('/community')}
            >
              <span className="text-2xl">👥</span>
              <span className="text-sm">مجتمع الطباخين</span>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-4 flex flex-col space-y-2 hover:bg-accent/10"
              onClick={() => navigate('/ai-recommendations')}
            >
              <span className="text-2xl">🤖</span>
              <span className="text-sm">الذكاء الاصطناعي</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Button 
              variant="ghost" 
              className="h-auto p-4 flex flex-col space-y-2 hover:bg-accent/10"
              onClick={() => navigate('/favorites')}
            >
              <span className="text-2xl">⭐</span>
              <span className="text-sm">المفضلة</span>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-4 flex flex-col space-y-2 hover:bg-accent/10"
              onClick={() => navigate('/search')}
            >
              <span className="text-2xl">🔍</span>
              <span className="text-sm">بحث</span>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-4 flex flex-col space-y-2 hover:bg-accent/10"
              onClick={() => navigate('/shopping-list')}
            >
              <span className="text-2xl">🛒</span>
              <span className="text-sm">قائمة التسوق</span>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-4 flex flex-col space-y-2 hover:bg-accent/10"
              onClick={() => navigate('/settings')}
            >
              <span className="text-2xl">⚙️</span>
              <span className="text-sm">الإعدادات</span>
            </Button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
