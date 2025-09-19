import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserPlus, UserCheck } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (!email || !password) {
      toast.error("برجاء إدخال البريد الإلكتروني وكلمة المرور");
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Configure redirect URL for both web and mobile
      const redirectUrl = window.location.protocol === 'file:' || window.location.protocol === 'app:' 
        ? 'app.lovable.ee7c66bbb34b4d68b7814288b6d07871://auth'
        : `${window.location.origin}/`;
        
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        toast.error("خطأ في تسجيل الدخول بجوجل");
        console.error('Google auth error:', error);
      }
    } catch (error) {
      toast.error("خطأ في تسجيل الدخول بجوجل");
      console.error('Google auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      // Configure redirect URL for both web and mobile
      const redirectUrl = window.location.protocol === 'file:' || window.location.protocol === 'app:' 
        ? 'app.lovable.ee7c66bbb34b4d68b7814288b6d07871://auth'
        : `${window.location.origin}/`;
        
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        toast.error("خطأ في تسجيل الدخول بفيسبوك");
        console.error('Facebook auth error:', error);
      }
    } catch (error) {
      toast.error("خطأ في تسجيل الدخول بفيسبوك");
      console.error('Facebook auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">مرحباً بك</CardTitle>
          <CardDescription>اختر طريقة الدخول المناسبة لك</CardDescription>
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
                  placeholder="أدخل كلمة المرور"
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
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={signInWithGoogle}
                variant="outline" 
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                disabled={loading}
              >
                <FaGoogle className="ml-2 h-4 w-4 text-red-500" />
                جوجل
              </Button>
              
              <Button 
                onClick={signInWithFacebook}
                variant="outline" 
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                disabled={loading}
              >
                <FaFacebookF className="ml-2 h-4 w-4 text-blue-600" />
                فيسبوك
              </Button>
            </div>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;