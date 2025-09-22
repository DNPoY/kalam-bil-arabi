import { Link } from 'react-router-dom';
import { Button } from './button';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminLink = () => {
  const { user } = useAuth();
  
  // فحص صلاحيات الأدمن
  const isAdmin = user?.email === 'admin@example.com' || user?.user_metadata?.role === 'admin';

  if (!isAdmin) return null;

  return (
    <Link to="/admin">
      <Button variant="outline" size="sm" className="gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
        <Shield className="h-4 w-4" />
        لوحة الأدمن
      </Button>
    </Link>
  );
};