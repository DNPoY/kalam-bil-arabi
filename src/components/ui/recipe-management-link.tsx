import { Link } from 'react-router-dom';
import { Button } from './button';
import { Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const RecipeManagementLink = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <Link to="/recipe-management">
      <Button variant="outline" size="sm" className="gap-2">
        <Settings className="h-4 w-4" />
        إدارة الوصفات
      </Button>
    </Link>
  );
};