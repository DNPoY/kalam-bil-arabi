import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Share2, Facebook, MessageCircle, Copy, Heart, Star, Twitter, Instagram, Mail } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  recipeName: string;
  recipeDescription: string;
  recipeId: string;
  rating?: number;
}

export const SocialShare = ({ recipeName, recipeDescription, recipeId, rating }: SocialShareProps) => {
  const [shareText, setShareText] = useState(`جربت وصفة ${recipeName} وكانت رائعة! 🍽️`);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n\n${recipeDescription}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
    toast.success("تم فتح واتساب للمشاركة");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&t=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success("تم فتح فيسبوك للمشاركة");
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${shareText}\n${window.location.href}`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success("تم فتح تويتر للمشاركة");
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct text sharing, so we'll copy to clipboard
    copyToClipboard();
    toast.info("تم نسخ النص - يمكنك لصقه في إنستغرام");
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`وصفة ${recipeName}`);
    const body = encodeURIComponent(`${shareText}\n\n${recipeDescription}\n\nمن تطبيق "في التلاجة"`);
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = url;
    toast.success("تم فتح تطبيق البريد الإلكتروني");
  };

  const copyToClipboard = async () => {
    const fullText = `${shareText}\n\n${recipeDescription}\n\nمن تطبيق "في التلاجة"`;
    
    try {
      await navigator.clipboard.writeText(fullText);
      toast.success("تم نسخ النص للحافظة");
    } catch (error) {
      toast.error("فشل في النسخ");
    }
  };

  const shareNatively = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeName,
          text: shareText,
          url: window.location.href,
        });
        toast.success("تم مشاركة الوصفة");
      } catch (error) {
        // المستخدم ألغى المشاركة
      }
    } else {
      copyToClipboard();
    }
  };

  const addToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast.success("تم إضافة الوصفة للمفضلة");
    } else {
      toast.info("الوصفة موجودة في المفضلة بالفعل");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          شارك الوصفة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={shareToWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="w-4 h-4 ml-2" />
            واتساب
          </Button>
          
          <Button 
            onClick={shareToFacebook}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Facebook className="w-4 h-4 ml-2" />
            فيسبوك
          </Button>
          
          <Button 
            onClick={shareToTwitter}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Twitter className="w-4 h-4 ml-2" />
            تويتر
          </Button>
          
          <Button 
            onClick={shareToInstagram}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Instagram className="w-4 h-4 ml-2" />
            إنستغرام
          </Button>
          
          <Button 
            onClick={shareByEmail}
            variant="outline"
          >
            <Mail className="w-4 h-4 ml-2" />
            إيميل
          </Button>
          
          <Button 
            onClick={copyToClipboard}
            variant="outline"
          >
            <Copy className="w-4 h-4 ml-2" />
            نسخ
          </Button>
          
          <Button 
            onClick={addToFavorites}
            variant="outline"
            className="text-red-500 hover:text-red-600"
          >
            <Heart className="w-4 h-4 ml-2" />
            مفضلة
          </Button>
          
          <Button 
            onClick={shareNatively}
            variant="outline"
            className="text-primary"
          >
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </Button>
        </div>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-3">
              تخصيص المشاركة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تخصيص رسالة المشاركة</DialogTitle>
              <DialogDescription>
                اكتب رسالة شخصية لمشاركة الوصفة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="اكتب رسالتك هنا..."
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="min-h-[100px]"
              />
              
              {rating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">تقييمي:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rating 
                            ? "text-yellow-500 fill-current" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={shareNatively} className="flex-1">
                  مشاركة
                </Button>
                <Button onClick={copyToClipboard} variant="outline">
                  نسخ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">معاينة المشاركة:</p>
          <p className="text-sm">{shareText}</p>
          {rating && (
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= rating 
                      ? "text-yellow-500 fill-current" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};