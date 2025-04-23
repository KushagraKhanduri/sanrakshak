
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '../context/ThemeProvider';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const handleGoBack = () => {
    // For login and signup pages, always go to landing page
    if (location.pathname === '/login' || location.pathname === '/signup') {
      navigate('/', { replace: true });
      return;
    }
    
    // For other pages, use the original logic
    const returnTo = searchParams.get('returnTo');
    if (returnTo) {
      navigate(`/${returnTo}`);
    } else {
      // Navigate based on user role
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        const user = JSON.parse(authUser);
        // Navigate to dashboard which will show the appropriate view based on role
        navigate('/dashboard');
      } else {
        // Default to landing page for unauthenticated users
        navigate('/');
      }
    }
  };
  
  return (
    <button
      onClick={handleGoBack}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors',
        isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10',
        className
      )}
      aria-label="Go back"
    >
      <ArrowLeft size={16} />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackButton;
