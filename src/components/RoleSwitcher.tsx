import React, { useState, useEffect } from 'react';
import { User, UserCheck, Building, Shield, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const RoleSwitcher: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const loadUser = () => {
      try {
        const authUser = localStorage.getItem('authUser');
        setCurrentUser(authUser ? JSON.parse(authUser) : null);
      } catch (e) {
        console.error("Error parsing auth user:", e);
        localStorage.removeItem('authUser');
        setCurrentUser(null);
      }
    };
    
    loadUser();
    
    const handleStorageChange = () => {
      loadUser();
    };
    
    window.addEventListener('auth-state-changed', loadUser);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('auth-state-changed', loadUser);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const switchRole = (role: 'victim' | 'volunteer' | 'ngo' | 'government') => {
    if (!currentUser) return;
    
    try {
      const updatedUser = { ...currentUser, role };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      toast({
        title: "Role Changed",
        description: `You are now viewing as: ${getRoleName(role)}`,
        duration: 3000,
      });
      
      // Notify other components
      window.dispatchEvent(new Event('auth-changed'));
      window.dispatchEvent(new CustomEvent('role-changed', { detail: { role } }));
      
      setIsMenuOpen(false);
      
      // Vercel-optimized navigation
      if (location.pathname === '/dashboard') {
        navigate('/dashboard', { 
          replace: true, 
          state: { roleSwitch: true } 
        });
      } else {
        navigate('/dashboard', { state: { roleSwitch: true } });
      }
    } catch (e) {
      console.error("Failed to switch role:", e);
      toast({
        title: "Error",
        description: "Failed to switch roles. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getRoleName = (role: string): string => {
    switch (role) {
      case 'victim': return 'Affected Person';
      case 'volunteer': return 'Volunteer';
      case 'ngo': return 'NGO';
      case 'government': return 'Government';
      default: return role;
    }
  };
  
  if (!currentUser || 
      currentUser.role === 'admin' || 
      location.pathname.includes('/admin')) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="p-2 rounded-md bg-black/60 hover:bg-black/80 border border-white/10 text-white shadow-md transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Switch role"
      >
        Switch Role
      </button>
      
      {isMenuOpen && (
        <div className="absolute bottom-12 right-0 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden w-48 shadow-xl animate-in fade-in zoom-in-95">
          <div className="p-2 text-xs border-b border-white/10">
            View As:
          </div>
          
          {(['victim', 'volunteer', 'ngo', 'government'] as const).map((role) => (
            <button
              key={role}
              className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                currentUser.role === role ? 'bg-white/5' : ''
              }`}
              onClick={() => switchRole(role)}
            >
              {role === 'victim' && <User size={16} className="mr-2" />}
              {role === 'volunteer' && <UserCheck size={16} className="mr-2" />}
              {role === 'ngo' && <Building size={16} className="mr-2" />}
              {role === 'government' && <Shield size={16} className="mr-2" />}
              <span className="flex-1 text-left">{getRoleName(role)}</span>
              {currentUser.role === role && <Check size={16} className="text-green-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;