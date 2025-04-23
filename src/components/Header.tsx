import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, Settings, User, LogOut, UserCheck, Building, ArrowRightLeft, Check, Shield, LayoutDashboard, BookOpen, Map } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Notifications from './Notifications';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeProvider';
import NavigationMenu from './NavigationMenu';
import { NavBar } from './ui/tubelight-navbar';

interface HeaderProps {
  title?: string;
  emergency?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Sanrakshak", 
  emergency = false 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const [user, setUser] = useState<any>(null);
  const [isAdminDashboard, setIsAdminDashboard] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    
    setIsAdminDashboard(
      window.location.pathname.includes('/admin-dashboard') || 
      window.location.pathname.includes('/admin')
    );
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);
  const toggleRoleSwitcher = () => setRoleSwitcherOpen(!roleSwitcherOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    setMenuOpen(false);
    setProfileOpen(false);
    
    window.dispatchEvent(new Event('auth-state-changed'));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Logged Out",
      description: "You have been signed out successfully",
    });
    
    navigate('/', { replace: true });
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setProfileOpen(false);
  };

  const switchRole = (role: 'victim' | 'volunteer' | 'ngo' | 'government') => {
    if (!user) return;
    
    const updatedUser = { ...user, role };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Role Changed",
      description: `You are now viewing as: ${getRoleName(role)}`,
      duration: 3000,
    });
    
    setRoleSwitcherOpen(false);
    
    if (location.pathname === '/dashboard') {
      navigate('/dashboard', { replace: true });
      window.location.reload();
    } else {
      navigate('/dashboard');
    }

    window.dispatchEvent(new Event('auth-state-changed'));
    window.dispatchEvent(new CustomEvent('role-changed', { detail: { role } }));
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

  const mobileNavItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Resources",
      url: "/resources",
      icon: BookOpen
    },
    {
      name: "Map",
      url: "/map",
      icon: Map
    },
    {
      name: "Alerts",
      url: "/alerts",
      icon: Bell
    }
  ];
  
  const handleMobileNavChange = (url: string) => {
    navigate(url);
    setMenuOpen(false);
  };
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 w-full',
        scrolled 
          ? isLight 
            ? 'backdrop-blur-xl bg-white/50 shadow-sm border-b border-gray-200' 
            : 'backdrop-blur-xl bg-black/50 shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {emergency && (
              <div className="animate-pulse-subtle mr-2" />
            )}
            <div className="flex items-center">
              <span className="font-bold text-xl">Sanrakshak</span>
            </div>
          </Link>
          
          {!isAdminDashboard && <NavigationMenu />}
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role !== 'admin' && !isAdminDashboard && user.role && (
                  <div className="relative" ref={roleSwitcherRef}>
                    <button 
                      onClick={toggleRoleSwitcher}
                      className="flex items-center space-x-2 rounded-full hover:bg-white/5 p-1 transform transition-transform hover:scale-110"
                      aria-label="Switch Role"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                        <ArrowRightLeft size={16} />
                      </div>
                    </button>
                    
                    {roleSwitcherOpen && (
                      <div className={`absolute right-0 mt-2 w-48 ${isLight ? "bg-white border border-gray-200" : "bg-black border-white/10"} shadow-xl rounded-xl z-50 overflow-hidden`}>
                        <div className="flex justify-between items-center p-3 border-b border-white/10">
                          <p className="font-medium">Switch Role</p>
                          <button 
                            onClick={() => setRoleSwitcherOpen(false)}
                            className="p-1 rounded-full hover:bg-white/10"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div>
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 hover:scale-105 transition-transform ${user.role === 'victim' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('victim')}
                          >
                            <User size={16} className="mr-2" />
                            <span className="flex-1 text-left">Affected Person</span>
                            {user.role === 'victim' && <Check size={16} className="text-green-400" />}
                          </button>
                          
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 hover:scale-105 transition-transform ${user.role === 'volunteer' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('volunteer')}
                          >
                            <UserCheck size={16} className="mr-2" />
                            <span className="flex-1 text-left">Volunteer</span>
                            {user.role === 'volunteer' && <Check size={16} className="text-green-400" />}
                          </button>
                          
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 hover:scale-105 transition-transform ${user.role === 'ngo' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('ngo')}
                          >
                            <Building size={16} className="mr-2" />
                            <span className="flex-1 text-left">NGO</span>
                            {user.role === 'ngo' && <Check size={16} className="text-green-400" />}
                          </button>
                          
                          <button
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-white/10 hover:scale-105 transition-transform ${user.role === 'government' ? 'bg-white/5' : ''}`}
                            onClick={() => switchRole('government')}
                          >
                            <Shield size={16} className="mr-2" />
                            <span className="flex-1 text-left">Government</span>
                            {user.role === 'government' && <Check size={16} className="text-green-400" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!isAdminDashboard && (
                  <div ref={notificationsRef}>
                    <Notifications />
                  </div>
                )}
                
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 rounded-full hover:bg-white/5 p-1 transform transition-transform hover:scale-110"
                    aria-label="User profile"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                      <User size={16} />
                    </div>
                  </button>
                  
                  {profileOpen && (
                    <div className={`absolute right-0 mt-2 w-48 ${isLight ? "bg-white border border-gray-200" : "bg-black border border-white/10"} shadow-xl rounded-xl z-50 overflow-hidden`}>
                      <div className="flex justify-between items-center p-3 border-b border-white/10">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className={`${isLight ? "text-gray-600" : "text-gray-400"} text-xs mt-0.5`}>{user.email}</p>
                        </div>
                        <button 
                          onClick={() => setProfileOpen(false)}
                          className="p-1 rounded-full hover:bg-white/10"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div>
                        {user.role !== 'admin' && (
                          <>
                            <button 
                              onClick={() => handleNavigate('/profile')}
                              className={`flex items-center px-4 py-2 text-sm ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transition-colors w-full text-left`}
                            >
                              <User size={16} className="mr-2" />
                              <span>Profile</span>
                            </button>
                            <button 
                              onClick={() => handleNavigate('/settings')}
                              className={`flex items-center px-4 py-2 text-sm ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transition-colors w-full text-left`}
                            >
                              <Settings size={16} className="mr-2" />
                              <span>Settings</span>
                            </button>
                          </>
                        )}
                        <button 
                          onClick={handleLogout}
                          className={`flex items-center px-4 py-2 text-sm ${isLight ? "hover:bg-gray-100 border-t border-gray-200" : "hover:bg-white/5 border-t border-white/10"} transition-colors w-full text-left`}
                        >
                          <LogOut size={16} className="mr-2" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`text-sm font-medium py-1.5 px-3 rounded-lg ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transform transition-transform hover:scale-110`}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className={`text-sm font-medium py-1.5 px-3 rounded-lg ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"} transition-colors transform transition-transform hover:scale-110`}
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {user && user.role !== 'admin' && !isAdminDashboard && (
              <button 
                className="md:hidden p-2 rounded-full hover:bg-white/5 focus-ring transform transition-transform hover:scale-110"
                onClick={toggleMenu}
                aria-label="Menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Nav - Fixed below header */}
      {user && user.role !== 'admin' && !isAdminDashboard && menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 px-4 pt-2 pb-4 z-40">
          <NavBar 
            items={mobileNavItems} 
            onNavChange={handleMobileNavChange}
            className={cn(
              "w-full ",
              isLight 
                ? "bg-white/90 border border-gray-200 rounded-full " 
                : "bg-black/90 border border-white/10 rounded-full"
            )}
          />
        </div>
      )}
    </header>
  );
};

export default Header;