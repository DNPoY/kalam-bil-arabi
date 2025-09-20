import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, Heart, Clock } from "lucide-react";

interface RecipeAnalyticsProps {
  recipeId: string;
  recipeName: string;
}

export const RecipeAnalytics = ({ recipeId, recipeName }: RecipeAnalyticsProps) => {
  const [analytics, setAnalytics] = useState({
    views: 0,
    favorites: 0,
    completions: 0,
    averageRating: 0,
    popularityTrend: [] as any[],
    userDemographics: [] as any[]
  });

  useEffect(() => {
    loadAnalytics();
  }, [recipeId]);

  const loadAnalytics = () => {
    // محاكاة بيانات التحليلات
    const mockData = {
      views: Math.floor(Math.random() * 1000) + 100,
      favorites: Math.floor(Math.random() * 200) + 20,
      completions: Math.floor(Math.random() * 150) + 15,
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      popularityTrend: [
        { day: 'السبت', views: Math.floor(Math.random() * 50) + 10 },
        { day: 'الأحد', views: Math.floor(Math.random() * 50) + 10 },
        { day: 'الاثنين', views: Math.floor(Math.random() * 50) + 10 },
        { day: 'الثلاثاء', views: Math.floor(Math.random() * 50) + 10 },
        { day: 'الأربعاء', views: Math.floor(Math.random() * 50) + 10 },
        { day: 'الخميس', views: Math.floor(Math.random() * 50) + 10 },
        { day: 'الجمعة', views: Math.floor(Math.random() * 50) + 10 }
      ],
      userDemographics: [
        { name: 'مبتدئين', value: 40, color: '#8884d8' },
        { name: 'متوسطين', value: 35, color: '#82ca9d' },
        { name: 'خبراء', value: 25, color: '#ffc658' }
      ]
    };

    setAnalytics(mockData);
  };

  const getPopularityScore = () => {
    const maxViews = 1000;
    const score = Math.min((analytics.views / maxViews) * 100, 100);
    return Math.round(score);
  };

  const getEngagementRate = () => {
    if (analytics.views === 0) return 0;
    return Math.round(((analytics.favorites + analytics.completions) / analytics.views) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          تحليلات الوصفة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Eye className="w-6 h-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{analytics.views}</p>
            <p className="text-xs text-muted-foreground">مشاهدة</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <Heart className="w-6 h-6 mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold text-red-600">{analytics.favorites}</p>
            <p className="text-xs text-muted-foreground">إعجاب</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Clock className="w-6 h-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{analytics.completions}</p>
            <p className="text-xs text-muted-foreground">طبخة مكتملة</p>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <TrendingUp className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{analytics.averageRating}</p>
            <p className="text-xs text-muted-foreground">متوسط التقييم</p>
          </div>
        </div>

        {/* Popularity Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">نقاط الشعبية</span>
            <span className="text-sm text-muted-foreground">{getPopularityScore()}/100</span>
          </div>
          <Progress value={getPopularityScore()} className="h-3" />
        </div>

        {/* Engagement Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">معدل التفاعل</span>
            <span className="text-sm text-muted-foreground">{getEngagementRate()}%</span>
          </div>
          <Progress value={getEngagementRate()} className="h-3" />
        </div>

        {/* Weekly Trend */}
        <div>
          <h4 className="text-sm font-medium mb-3">اتجاه المشاهدات الأسبوعي</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.popularityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Demographics */}
        <div>
          <h4 className="text-sm font-medium mb-3">توزيع المستخدمين</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.userDemographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  dataKey="value"
                >
                  {analytics.userDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {analytics.userDemographics.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-muted/30 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-2">💡 رؤى ذكية</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {getPopularityScore() > 80 && (
              <li>• وصفة شعبية جداً بين المستخدمين</li>
            )}
            {getEngagementRate() > 15 && (
              <li>• معدل تفاعل عالي - المستخدمون يحبونها</li>
            )}
            {analytics.averageRating > 4.5 && (
              <li>• تقييم ممتاز من المستخدمين</li>
            )}
            {analytics.completions > 50 && (
              <li>• كثير من الناس طبخوها بنجاح</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};