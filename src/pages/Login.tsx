
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Lock, Mail, ArrowRight, Shield, User } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { useTheme } from '../context/ThemeProvider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        try {
          const parsedUser = JSON.parse(authUser);
          if (parsedUser && parsedUser.id) {
            if (parsedUser.role === 'admin') {
              navigate('/admin-dashboard', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }
        } catch (e) {
          console.error("Invalid authUser data:", e);
          localStorage.removeItem('authUser');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const usersJson = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersJson);
      
      const user = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        if (!user.isActive) {
          setError('Your account has been deactivated. Please contact support.');
          setIsLoading(false);
          return;
        }
        
        if (isAdmin && user.role !== 'admin') {
          setError('You do not have administrator access.');
          setIsLoading(false);
          return;
        }
        
        const authUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'victim',
          profileImg: user.profileImg,
          canVolunteer: user.canVolunteer
        };
        
        localStorage.setItem('authUser', JSON.stringify(authUser));
        
        window.dispatchEvent(new Event('auth-state-changed')); 
        window.dispatchEvent(new Event('storage'));
        
        toast({
          title: "Login Successful",
          description: `Welcome back to ${isAdmin ? 'the admin panel' : 'Relief Connect'}`,
        });
        
        setEmail('');
        setPassword('');
        
        if (user.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    setError('');
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-white" : "bg-black"} text-foreground flex flex-col`}>
      <div className="p-4">
        <BackButton />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatedTransition className="w-full max-w-md">
          <div className={`${isLight ? "border border-gray-200 shadow-soft bg-white" : "glass-dark"} rounded-xl p-6 sm:p-8`}>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                Welcome Back
              </h1>
              <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                Sign in to your Relief Connect account
              </p>
            </div>
            
            <div className="mb-6 flex rounded-lg overflow-hidden h-9">
              <button 
                className={`flex-1 py-1.5 flex items-center justify-center gap-2 transition-colors ${!isAdmin ? 
                  (isLight ? 'bg-black text-white font-medium' : 'bg-primary text-black font-medium') : 
                  (isLight ? 'bg-gray-100 text-gray-500' : 'bg-black/40 text-gray-400')}`}
                onClick={() => !isAdmin ? null : toggleAdminMode()}
              >
                <User size={16} />
                <span>User</span>
              </button>
              
              <button 
                className={`flex-1 py-1.5 flex items-center justify-center gap-2 transition-colors ${isAdmin ? 
                  (isLight ? 'bg-black text-white font-medium' : 'bg-primary text-black font-medium') : 
                  (isLight ? 'bg-gray-100 text-gray-500' : 'bg-black/40 text-gray-400')}`}
                onClick={() => isAdmin ? null : toggleAdminMode()}
              >
                <Shield size={16} />
                <span>Admin</span>
              </button>
            </div>
            
            {error && (
              <div className={`mb-4 p-3 ${isLight ? "bg-red-50 border border-red-100 text-red-600" : "bg-white/5 border border-white/10 text-red-400"} rounded-lg text-sm`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pl-3 ${isLight ? 
                      "bg-white border-gray-200 text-black placeholder:text-gray-400" : 
                      "bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:ring-white/30"}`}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className={`text-sm ${isLight ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-primary"}`}>
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pl-2 ${isLight ? 
                      "bg-white border-gray-200 text-black placeholder:text-gray-400" : 
                      "bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:ring-white/30"}`}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg font-medium py-2 flex items-center justify-center transition-colors disabled:opacity-50 h-9 ${isLight ? 
                  "bg-black text-white hover:bg-gray-800" : 
                  "bg-white text-black hover:bg-white/90"}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign in
                    <ArrowRight size={16} className="ml-1" />
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm">
                <span className={isLight ? "text-gray-600" : "text-gray-400"}>Don't have an account? </span>
                <Link to="/signup" className={isLight ? "text-black hover:underline" : "text-white hover:underline"}>
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Login;
