
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Lock, Mail, User, ArrowRight, UserCheck, Building, UserCog, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import BackButton from '@/components/BackButton';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('victim');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminField, setShowAdminField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      try {
        const parsedUser = JSON.parse(authUser);
        if (parsedUser && parsedUser.id) {
          navigate('/dashboard', { replace: true });
        }
      } catch (e) {
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
      }
    }
  }, [navigate]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    if (role === 'admin' && adminCode !== 'admin123') {
      setError('Invalid admin code');
      setIsLoading(false);
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((user: any) => user.email === email.toLowerCase());
    
    if (existingUser) {
      setError('Email is already registered');
      setIsLoading(false);
      
      toast({
        title: "Account Already Exists",
        description: "Redirecting you to the login page...",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password,
      name,
      role,
      profileImg: null,
      createdAt: Date.now(),
      canVolunteer: role === 'victim' ? true : false,
      isActive: true
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    localStorage.setItem('authUser', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      profileImg: newUser.profileImg,
      canVolunteer: newUser.canVolunteer
    }));
    
    window.dispatchEvent(new Event('auth-state-changed'));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Account Created",
      description: "Welcome to Relief Connect!",
    });
    
    setIsLoading(false);
    
    if (role === 'admin') {
      navigate('/admin-dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'victim':
        return <User size={16} className="mr-2" />;
      case 'volunteer':
        return <UserCheck size={16} className="mr-2" />;
      case 'ngo':
        return <Building size={16} className="mr-2" />;
      case 'government':
        return <UserCog size={16} className="mr-2" />;
      case 'admin':
        return <Shield size={16} className="mr-2" />;
      default:
        return <User size={16} className="mr-2" />;
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setShowAdminField(selectedRole === 'admin');
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-white" : "bg-black"} text-foreground flex flex-col`}>
      <div className="p-4">
        <BackButton />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatedTransition className="w-full max-w-md">
          <div className={`${isLight ? "border border-gray-200 shadow-soft bg-white" : "glass-dark border border-white/10"} rounded-xl p-6 sm:p-8`}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
              <p className={isLight ? "text-gray-600" : "text-gray-400"}>Join Relief Connect and help your community</p>
            </div>
            
            {error && (
              <div className={`mb-4 p-3 ${isLight ? "bg-red-50 border border-red-100 text-red-600" : "bg-white/5 border border-white/10 text-red-400"} rounded-lg text-sm`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`w-full ${isLight ? "bg-white border-gray-200 placeholder:text-gray-400 focus:ring-gray-400" : "bg-black/40 border-white/10 placeholder:text-gray-500 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full ${isLight ? "bg-white border-gray-200 placeholder:text-gray-400 focus:ring-gray-400" : "bg-black/40 border-white/10 placeholder:text-gray-500 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className={`w-full ${isLight ? "bg-white border-gray-200 placeholder:text-gray-400 focus:ring-gray-400" : "bg-black/40 border-white/10 placeholder:text-gray-500 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full ${isLight ? "bg-white border-gray-200 placeholder:text-gray-400 focus:ring-gray-400" : "bg-black/40 border-white/10 placeholder:text-gray-500 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="role" className="text-sm font-medium">
                  I am...
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <select
                    id="role"
                    value={role}
                    onChange={handleRoleChange}
                    className={`w-full ${isLight ? "bg-white border-gray-200 focus:ring-gray-400" : "bg-black/40 border-white/10 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 appearance-none focus:ring-1 focus:outline-none`}
                  >
                    <option value="victim">Someone affected by disaster</option>
                    <option value="volunteer">A volunteer</option>
                    <option value="ngo">From an NGO</option>
                    <option value="government">From a government agency</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {role === 'victim' && (
                  <p className={`mt-1 text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>As someone affected, you can also volunteer to help others</p>
                )}
                {role === 'admin' && (
                  <p className={`mt-1 text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Administrators manage emergency responses and allocate resources</p>
                )}
              </div>
              
              {showAdminField && (
                <div className="space-y-1">
                  <label htmlFor="adminCode" className="text-sm font-medium">
                    Admin Authorization Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                    </div>
                    <input
                      id="adminCode"
                      type="password"
                      placeholder="Enter admin code"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      required={role === 'admin'}
                      className={`w-full ${isLight ? "bg-white border-gray-200 placeholder:text-gray-400 focus:ring-gray-400" : "bg-black/40 border-white/10 placeholder:text-gray-500 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:outline-none`}
                    />
                  </div>
                  <p className={`mt-1 text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Contact system administrator for this code</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg font-medium py-3 flex items-center justify-center transition-colors disabled:opacity-50 ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Account
                    <ArrowRight size={16} className="ml-1" />
                  </span>
                )}
              </button>
              
              <div className="text-center text-sm">
                <span className={isLight ? "text-gray-600" : "text-gray-400"}>Already have an account? </span>
                <Link to="/login" className={isLight ? "text-black hover:underline" : "text-white hover:underline"}>
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Signup;
