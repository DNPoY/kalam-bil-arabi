import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="py-3">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              لا يوجد اتصال بالإنترنت
            </span>
            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
              وضع عدم الاتصال
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};