import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: "🏠", 
      label: "الرئيسية", 
      path: "/" 
    },
    { 
      icon: "🥬", 
      label: "المكونات", 
      path: "/add-ingredients" 
    },
    { 
      icon: "📖", 
      label: "الوصفات", 
      path: "/recipes" 
    },
    { 
      icon: "⭐", 
      label: "المفضلة", 
      path: "/favorites" 
    },
    { 
      icon: "🔍", 
      label: "بحث", 
      path: "/search" 
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t shadow-lg z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 p-3 min-w-0 flex-1 h-auto transition-colors ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;