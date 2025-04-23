
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ResourceRouteRedirect = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  // This part ensures resources are still routed correctly
  if (user.role === 'victim') {
    return <Navigate to="/victim-resources" replace />;
  } else if (user.role === 'volunteer' || user.role === 'ngo' || user.role === 'government') {
    return <Navigate to="/volunteer-resources" replace />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

export default ResourceRouteRedirect;
