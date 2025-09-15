import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, RotateCcw } from "lucide-react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { toast } from "sonner";

const CameraPage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Mock AI analysis - في التطبيق الحقيقي، هذا سيكون API call
  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    
    // محاكاة AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // مكونات وهمية للتجربة
    const mockIngredients = [
      "طماطم", "بصل", "جزر", "بطاطس", "فلفل أخضر", 
      "خيار", "خس", "بيض", "لبن", "جبنة"
    ];
    
    // اختيار عشوائي من المكونات
    const randomIngredients = mockIngredients
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 3);
    
    setDetectedIngredients(randomIngredients);
    setIsAnalyzing(false);
    toast.success(`تم اكتشاف ${randomIngredients.length} مكون!`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setDetectedIngredients([]);
    setIsAnalyzing(false);
  };

  const proceedWithIngredients = () => {
    if (detectedIngredients.length === 0) {
      toast.error("لم يتم اكتشاف أي مكونات");
      return;
    }
    
    localStorage.setItem('selectedIngredients', JSON.stringify(detectedIngredients));
    navigate('/recipes');
    toast.success("تم حفظ المكونات، جاري البحث عن الوصفات...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-food-cream to-secondary/30 pb-20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-soft border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/add-ingredients')}
              className="text-muted-foreground hover:text-primary"
            >
              ← رجوع
            </Button>
            <h1 className="text-xl font-bold text-primary">تصوير المكونات</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {!capturedImage ? (
          <>
            {/* Camera Instructions */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-4xl mb-4">
                  📸
                </div>
                <CardTitle>صور محتويات التلاجة</CardTitle>
                <CardDescription>
                  التقط صورة للمكونات المتاحة وسنتعرف عليها تلقائياً باستخدام الذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleCameraCapture}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Camera className="w-5 h-5 ml-2" />
                    فتح الكاميرا
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleGalleryUpload}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Upload className="w-5 h-5 ml-2" />
                    اختر من المعرض
                  </Button>
                </div>

                {/* Tips */}
                <div className="bg-accent/10 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-accent-foreground mb-2">💡 نصائح للحصول على أفضل النتائج:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• تأكد من وضوح الإضاءة</li>
                    <li>• ضع المكونات في مكان واضح</li>
                    <li>• تجنب التداخل بين المكونات</li>
                    <li>• اقترب من المكونات بشكل كافٍ</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Captured Image */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      ✅ تم التحليل بنجاح
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={capturedImage} 
                    alt="Captured ingredients" 
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={resetCapture}
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  <RotateCcw className="w-4 h-4 ml-2" />
                  التقط صورة جديدة
                </Button>
              </CardContent>
            </Card>

            {/* Detected Ingredients */}
            {detectedIngredients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">المكونات المكتشفة ({detectedIngredients.length})</CardTitle>
                  <CardDescription>
                    راجع المكونات المكتشفة وأضف أو احذف حسب الحاجة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {detectedIngredients.map((ingredient, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-sm py-2 px-3 bg-primary/10 text-primary border border-primary/20"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={proceedWithIngredients}
                      className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90"
                      size="lg"
                    >
                      🔍 ابحث عن وصفات
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/add-ingredients')}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      ✏️ تعديل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isAnalyzing && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium text-foreground">جاري تحليل الصورة...</p>
                  <p className="text-sm text-muted-foreground">الذكاء الاصطناعي يتعرف على المكونات</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default CameraPage;