import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('authUser');
            setUser(null);
          }
        } else {
          localStorage.removeItem('authUser');
          setUser(null);
        }
      } catch (e) {
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    // Allow role switching to complete before redirecting
    if (location.state?.fromRoleSwitch) {
      return <Navigate to="/dashboard" replace state={{}} />;
    }
    
    return user.role === 'admin' 
      ? <Navigate to="/admin-dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;