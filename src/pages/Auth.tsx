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

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const redirectUrl = `${window.location.origin}/`;
      
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

  const continueAsGuest = async () => {
    setLoading(true);
    try {
      // Create a guest account with a random email and skip email confirmation
      const guestEmail = `guest_${Date.now()}@temp.com`;
      const guestPassword = Math.random().toString(36).substring(2, 15);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: "ضيف",
            is_guest: true
          }
        }
      });

      if (error) {
        toast.error("خطأ في إنشاء حساب الضيف");
      } else {
        // Always try to sign in immediately after signup for guest accounts
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: guestEmail,
          password: guestPassword,
        });
        
        if (signInError) {
          toast.error("خطأ في تسجيل دخول الضيف");
        } else {
          toast.success("مرحباً بك كضيف!");
          // Give the auth state time to update before navigating
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
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
          
          <div className="mt-6 pt-6 border-t">
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