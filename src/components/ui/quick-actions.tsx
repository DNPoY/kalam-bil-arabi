import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  color?: string;
  badge?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  columns?: number;
}

const defaultActions: QuickAction[] = [
  {
    id: 'add-ingredients',
    title: 'أضف مكونات',
    description: 'اكتب أو صور المكونات',
    icon: '🥬',
    path: '/add-ingredients',
    color: 'hover:bg-green-50'
  },
  {
    id: 'recipes',
    title: 'تصفح الوصفات',
    description: 'استكشف كل الوصفات',
    icon: '📖',
    path: '/recipes',
    color: 'hover:bg-blue-50'
  },
  {
    id: 'favorites',
    title: 'المفضلة',
    description: 'وصفاتك المحفوظة',
    icon: '⭐',
    path: '/favorites',
    color: 'hover:bg-yellow-50'
  },
  {
    id: 'search',
    title: 'بحث متقدم',
    description: 'ابحث بالاسم أو المكونات',
    icon: '🔍',
    path: '/search',
    color: 'hover:bg-purple-50'
  },
  {
    id: 'meal-planner',
    title: 'مخطط الوجبات',
    description: 'خطط وجباتك الأسبوعية',
    icon: '📅',
    path: '/meal-planner',
    color: 'hover:bg-orange-50'
  },
  {
    id: 'shopping-list',
    title: 'قائمة التسوق',
    description: 'قائمة المشتريات الذكية',
    icon: '🛒',
    path: '/shopping-list',
    color: 'hover:bg-pink-50'
  }
];

export const QuickActions = ({ 
  actions = defaultActions, 
  title = "إجراءات سريعة",
  columns = 2 
}: QuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-${columns} md:grid-cols-${Math.min(columns * 2, 4)} gap-4`}>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              onClick={() => navigate(action.path)}
              className={`h-auto p-4 flex flex-col space-y-2 ${action.color || 'hover:bg-accent/10'}`}
            >
              <span className="text-2xl">{action.icon}</span>
              <div className="text-center">
                <span className="text-sm font-medium block">{action.title}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
              {action.badge && (
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};