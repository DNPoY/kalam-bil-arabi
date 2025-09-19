import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserPlus, UserCheck, Mail, Phone, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const navigate = useNavigate();
  const { signInAsGuest } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const signUp = async () => {
    if (!email || !password || !confirmPassword) {
      toast.error("برجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("كلمة المرور وتأكيدها غير متطابقتين");
      return;
    }

    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      // Configure redirect URL for both web and mobile
      const redirectUrl = window.location.protocol === 'file:' || window.location.protocol === 'app:' 
        ? 'app.lovable.ee7c66bbb34b4d68b7814288b6d07871://auth'
        : `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || email,
            is_guest: false
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("هذا البريد الإلكتروني مسجل بالفعل");
        } else {
          toast.error("خطأ في التسجيل: " + error.message);
        }
      } else {
        toast.success("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (!email || !password) {
      toast.error("برجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("بيانات تسجيل الدخول غير صحيحة");
        } else {
          toast.error("خطأ في تسجيل الدخول: " + error.message);
        }
      } else {
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    signInAsGuest();
    toast.success("مرحباً بك كضيف!");
    navigate("/");
  };

  const signInWithPhone = async () => {
    if (!phoneNumber) {
      toast.error("برجاء إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        toast.error("خطأ في إرسال رمز التحقق: " + error.message);
      } else {
        toast.success("تم إرسال رمز التحقق لهاتفك");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      toast.error("برجاء إدخال البريد الإلكتروني أولاً");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast.error("خطأ في إرسال رابط إعادة التعيين");
      } else {
        toast.success("تم إرسال رابط إعادة تعيين كلمة المرور لبريدك الإلكتروني");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">مرحباً بك</CardTitle>
          <CardDescription>سجل دخولك أو أنشئ حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  disabled={loading}
                />
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetPassword}
                disabled={loading || !email}
                className="w-full text-sm text-muted-foreground hover:text-primary"
              >
                نسيت كلمة المرور؟
              </Button>
              
              <Button 
                onClick={signIn} 
                className="w-full" 
                disabled={loading}
              >
                <User className="w-4 h-4 mr-2" />
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">الاسم (اختياري)</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="أدخل اسمك"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">البريد الإلكتروني</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">كلمة المرور</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  disabled={loading}
                />
              </div>
              <Button 
                onClick={signUp} 
                className="w-full" 
                disabled={loading}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t space-y-4">
            {/* Phone Authentication Option */}
            {!showPhoneAuth ? (
              <Button 
                variant="outline" 
                onClick={() => setShowPhoneAuth(true)}
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                disabled={loading}
              >
                <Phone className="w-4 h-4 mr-2" />
                تسجيل الدخول برقم الهاتف
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+20 1xxxxxxxxx"
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={signInWithPhone}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading || !phoneNumber}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    إرسال رمز التحقق
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowPhoneAuth(false)}
                    disabled={loading}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">أو</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={continueAsGuest} 
              className="w-full"
              disabled={loading}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {loading ? "جاري الدخول..." : "الدخول كضيف"}
            </Button>
            
            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-1">أمان وخصوصية</h4>
                  <p className="text-sm text-green-700">
                    بياناتك محمية بأعلى معايير الأمان. يمكنك استخدام التطبيق كضيف دون الحاجة لإنشاء حساب.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;