import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.id) {
            setUser(parsedUser);
            return;
          }
        }
        // Clear invalid or missing user
        localStorage.removeItem('authUser');
        setUser(null);
      } catch (e) {
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    // Listen for changes from role switcher and other tabs
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Handle role switch refresh without flashing
  if (location.pathname === '/dashboard' && location.state?.roleSwitch) {
    return <Navigate to="/dashboard" replace state={{}} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;