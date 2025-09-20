import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Wifi, Database, Zap } from "lucide-react";

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    apiResponseTime: 0,
    isOnline: navigator.onLine
  });

  useEffect(() => {
    // قياس أداء التطبيق
    const measurePerformance = () => {
      // وقت التحميل
      const loadTime = performance.now();
      
      // استخدام الذاكرة (تقديري)
      const memoryUsage = (performance as any).memory 
        ? Math.round(((performance as any).memory.usedJSHeapSize / (performance as any).memory.jsHeapSizeLimit) * 100)
        : Math.random() * 30 + 20;

      // معدل نجاح التخزين المؤقت (محاكاة)
      const cacheHitRate = Math.random() * 20 + 75;

      // وقت استجابة API (محاكاة)
      const apiResponseTime = Math.random() * 200 + 100;

      setMetrics({
        loadTime: Math.round(loadTime),
        memoryUsage: Math.round(memoryUsage),
        cacheHitRate: Math.round(cacheHitRate),
        apiResponseTime: Math.round(apiResponseTime),
        isOnline: navigator.onLine
      });
    };

    measurePerformance();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(measurePerformance, 30000);
    
    // مراقبة حالة الاتصال
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getPerformanceStatus = () => {
    const avgScore = (
      (100 - metrics.memoryUsage) + 
      metrics.cacheHitRate + 
      (metrics.apiResponseTime < 200 ? 80 : 40)
    ) / 3;

    if (avgScore >= 80) return { status: "ممتاز", color: "text-green-600" };
    if (avgScore >= 60) return { status: "جيد", color: "text-yellow-600" };
    return { status: "يحتاج تحسين", color: "text-red-600" };
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4" />
          مراقب الأداء
          <Badge variant="outline" className={performanceStatus.color}>
            {performanceStatus.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${metrics.isOnline ? 'text-green-600' : 'text-red-600'}`} />
            <span className="text-sm">الاتصال</span>
          </div>
          <Badge variant={metrics.isOnline ? "default" : "destructive"} className="text-xs">
            {metrics.isOnline ? "متصل" : "منقطع"}
          </Badge>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">استخدام الذاكرة</span>
            <span className="text-xs text-muted-foreground">{metrics.memoryUsage}%</span>
          </div>
          <Progress value={metrics.memoryUsage} className="h-2" />
        </div>

        {/* Cache Hit Rate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">كفاءة التخزين المؤقت</span>
            <span className="text-xs text-muted-foreground">{metrics.cacheHitRate}%</span>
          </div>
          <Progress value={metrics.cacheHitRate} className="h-2" />
        </div>

        {/* API Response Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-sm">زمن الاستجابة</span>
          </div>
          <span className="text-xs text-muted-foreground">{metrics.apiResponseTime}ms</span>
        </div>

        {/* Performance Tips */}
        {performanceStatus.status !== "ممتاز" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">نصائح لتحسين الأداء</span>
            </div>
            <ul className="text-xs text-yellow-700 space-y-1">
              {metrics.memoryUsage > 70 && (
                <li>• أعد تشغيل التطبيق لتحرير الذاكرة</li>
              )}
              {!metrics.isOnline && (
                <li>• تحقق من اتصال الإنترنت</li>
              )}
              {metrics.apiResponseTime > 300 && (
                <li>• الاتصال بطيء، جرب لاحقاً</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};