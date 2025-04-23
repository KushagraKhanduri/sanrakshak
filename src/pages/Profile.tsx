
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useToast } from "@/hooks/use-toast";
import { User, Mail, CheckSquare, AlertTriangle, UserCheck, ArrowRightLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [actingAs, setActingAs] = useState<string>('');
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    requestsMade: 0,
    requestsHelped: 0,
    responseReceived: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem('authUser');
      if (!authUser) {
        redirectToLogin();
        return;
      }
      
      try {
        const userData = JSON.parse(authUser);
        if (!userData || !userData.id) {
          localStorage.removeItem('authUser');
          redirectToLogin();
          return;
        }
        
        setUser(userData);
        setActingAs(userData.role);
        
        const allRequests = JSON.parse(localStorage.getItem('resourceRequests') || '[]');
        const userRequests = allRequests.filter((req: any) => req.userId === userData.id);
        setRequests(userRequests);
        
        setStats({
          requestsMade: userRequests.filter((req: any) => req.type === 'need').length,
          requestsHelped: userRequests.filter((req: any) => req.type === 'offer').length,
          responseReceived: 0
        });
        
        setIsLoading(false);
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem('authUser');
        redirectToLogin();
      }
    };
    
    checkAuth();
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authUser') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const redirectToLogin = () => {
    toast({
      title: "Authentication Required",
      description: "Please sign in to view your profile",
    });
    navigate('/login');
  };

  const handleRoleSwitch = () => {
    if (!user || !user.canVolunteer) return;
    
    const newRole = actingAs === 'victim' ? 'volunteer' : 'victim';
    setActingAs(newRole);
    
    const updatedUser = { ...user, role: newRole };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Role Switched",
      description: `You are now acting as a ${newRole}`,
    });
    
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className={`h-6 ${isLight ? "bg-gray-200" : "bg-white/10"} rounded w-48 mb-4`}></div>
            <div className={`h-4 ${isLight ? "bg-gray-200" : "bg-white/10"} rounded w-64 mb-3`}></div>
            <div className={`h-4 ${isLight ? "bg-gray-200" : "bg-white/10"} rounded w-32`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="mb-4">Please sign in to view your profile</p>
            <button 
              onClick={() => navigate('/login')}
              className={`px-4 py-2 ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/20"} rounded-lg`}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-white dark:bg-slate-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className={isLight ? "text-gray-600 mt-1" : "text-gray-400 mt-1"}>Manage your account and view your activity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedTransition className="md:col-span-1">
              <div className={`rounded-xl p-6 ${isLight ? "border border-gray-200 bg-white shadow-soft" : "glass-dark border border-white/10"}`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-full ${isLight ? "bg-gray-100" : "bg-white/10"} flex items-center justify-center mb-4`}>
                    <User size={36} />
                  </div>
                  
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Mail size={14} className="mr-1" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className={`flex items-center mt-2 ${isLight ? "bg-gray-100" : "bg-white/10"} px-3 py-1 rounded-full text-xs font-medium`}>
                    {user.role === 'victim' && <AlertTriangle size={12} className="mr-1" />}
                    {user.role === 'volunteer' && <UserCheck size={12} className="mr-1" />}
                    {user.role === 'ngo' && <CheckSquare size={12} className="mr-1" />}
                    {user.role === 'government' && <CheckSquare size={12} className="mr-1" />}
                    <span className="capitalize">{user.role}</span>
                  </div>
                  
                  {user.canVolunteer && (
                    <button 
                      onClick={handleRoleSwitch}
                      className={`mt-4 flex items-center text-sm ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/15"} px-3 py-2 rounded-lg transition-colors`}
                    >
                      <ArrowRightLeft size={14} className="mr-1.5" />
                      <span>
                        Switch to {actingAs === 'victim' ? 'Volunteer' : 'Victim'} Mode
                      </span>
                    </button>
                  )}
                </div>
                
                <div className={`mt-6 border-t ${isLight ? "border-gray-200" : "border-white/10"} pt-6`}>
                  <h3 className="font-medium mb-3">Activity Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className={isLight ? "text-gray-600" : "text-gray-400"}>Requests Made</span>
                      <span>{stats.requestsMade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isLight ? "text-gray-600" : "text-gray-400"}>People Helped</span>
                      <span>{stats.requestsHelped}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isLight ? "text-gray-600" : "text-gray-400"}>Responses Received</span>
                      <span>{stats.responseReceived}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedTransition>
            
            <AnimatedTransition className="md:col-span-2">
              <div className={`rounded-xl p-6 ${isLight ? "border border-gray-200 bg-white shadow-soft" : "glass-dark border border-white/10"}`}>
                <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
                
                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div 
                        key={request.id}
                        className={`p-4 border rounded-lg ${isLight ? "border-gray-200" : "border-white/10"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                request.type === 'need' 
                                  ? isLight ? "bg-blue-500" : "bg-white" 
                                  : isLight ? "bg-green-500" : "bg-gray-400"
                              }`}></span>
                              <h3 className="font-medium">{request.title}</h3>
                            </div>
                            <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} mt-1`}>
                              {request.type === 'need' ? 'Requested' : 'Offered'}: {request.category}
                            </p>
                          </div>
                          <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="mt-2 text-sm">{request.description}</p>
                        
                        <div className={`mt-2 flex items-center text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          <span>Location: {request.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className={isLight ? "text-gray-600" : "text-gray-400"}>You haven't made any requests yet</p>
                    <button 
                      onClick={() => navigate('/connect')}
                      className={`mt-4 px-4 py-2 ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/15"} rounded-lg transition-colors`}
                    >
                      Request or Offer Resources
                    </button>
                  </div>
                )}
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
