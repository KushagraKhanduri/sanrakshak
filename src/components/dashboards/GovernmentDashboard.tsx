import React, { useState, useEffect } from 'react';
import { BarChart, Building2, Users, FileText, AlertTriangle, UserCheck, Building } from 'lucide-react';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '../UserProfile';
import { Button } from '@/components/ui/button';
import RegisteredHelpersDialog from '../RegisteredHelpersDialog';
import { useTheme } from '@/context/ThemeProvider';
import { cn } from "@/lib/utils";

interface GovernmentDashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
}

const GovernmentDashboard: React.FC<GovernmentDashboardProps> = () => {
  const { theme } = useTheme();
  const [helperFilter, setHelperFilter] = useState<'all' | 'volunteer' | 'ngo'>('all');
  const [showAllHelpersDialog, setShowAllHelpersDialog] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  const isLight = theme === 'light';
  const colors = {
    primary: isLight ? '#6366F1' : '#818CF8',
    secondary: isLight ? '#10B981' : '#34D399',
    danger: isLight ? '#EF4444' : '#F87171',
    warning: isLight ? '#F59E0B' : '#FBBF24',
    accent: isLight ? '#EC4899' : '#F472B6',
    background: isLight ? '#FFFFFF' : '#0F172A',
    card: isLight ? '#FFFFFF' : '#1E293B',
    text: isLight ? '#334155' : '#E2E8F0',
    border: isLight ? '#E2E8F0' : '#334155'
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        const helpersOnly = parsedUsers
          .filter((user: any) => user.role === 'volunteer' || user.role === 'ngo')
          .slice(0, 4);
        setUsers(helpersOnly);
      } catch (error) {
        console.error('Error parsing stored users:', error);
        setUsers(getSampleUsers());
      }
    } else {
      setUsers(getSampleUsers());
    }
  }, []);

  const getSampleUsers = () => {
    return [
      {
        id: "volunteer-1",
        name: "Sarah Johnson",
        role: "volunteer",
        contactInfo: "sarah.j@example.com",
        location: "Central District",
        lastActive: "2 hours ago",
        skills: ["First Aid", "Search & Rescue", "Logistics"]
      },
      {
        id: "ngo-1",
        name: "Red Cross Chapter",
        role: "ngo",
        contactInfo: "local@redcross.org",
        location: "Multiple Districts",
        lastActive: "30 minutes ago"
      },
      {
        id: "volunteer-2",
        name: "Michael Chen",
        role: "volunteer",
        contactInfo: "m.chen@example.com",
        location: "North District",
        lastActive: "4 hours ago",
        skills: ["Medical", "Transportation", "Communication"]
      },
      {
        id: "ngo-2",
        name: "Community Relief Foundation",
        role: "ngo",
        contactInfo: "help@crf.org",
        location: "South District",
        lastActive: "1 hour ago"
      }
    ];
  };
  
  const filteredUsers = users.filter(user => {
    if (helperFilter === 'all') return true;
    return user.role === helperFilter;
  });
  
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-black/20 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-30 "></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Building2 size={20} className="mr-2" style={{ color: colors.primary }} />
                <h2 className="text-xl font-bold" style={{ color: colors.text }}>Government Response Hub</h2>
              </div>
              <p className="text-sm" style={{ color: colors.text }}>
                Coordinate disaster response efforts, manage infrastructure recovery, and analyze impact assessments.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/command-center" 
                className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md"
              >
                Command Center
              </Link>
              <Link 
                to="/recovery-plan" 
                className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md"
              >
                Recovery Plan
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <AnimatedTransition className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-red-100/50 dark:bg-red-900/20 mr-4">
                  <AlertTriangle className="text-red-500 dark:text-red-300" size={20} />
                </div>
                <div>
                  <h3 className="text-xs opacity-80" style={{ color: colors.text }}>Active Incidents</h3>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>3</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-100/50 dark:bg-blue-900/20 mr-4">
                  <Building2 className="text-blue-500 dark:text-blue-300" size={20} />
                </div>
                <div>
                  <h3 className="text-xs opacity-80" style={{ color: colors.text }}>Affected Areas</h3>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>12</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-green-100/50 dark:bg-green-900/20 mr-4">
                  <Users className="text-green-500 dark:text-green-300" size={20} />
                </div>
                <div>
                  <h3 className="text-xs opacity-80" style={{ color: colors.text }}>People Affected</h3>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>5,483</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-black/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-purple-100/50 dark:bg-purple-900/20 mr-4">
                  <FileText className="text-purple-500 dark:text-purple-300" size={20} />
                </div>
                <div>
                  <h3 className="text-xs opacity-80" style={{ color: colors.text }}>Response Plans</h3>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>7</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedTransition>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Volunteers and NGOs Section */}
          <AnimatedTransition delay={100} className="lg:col-span-2">
            <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-black/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="p-3 rounded-xl bg-indigo-100/50 dark:bg-indigo-900/20 mr-3">
                    <UserCheck className="text-indigo-500 dark:text-indigo-300" size={20} />
                  </div>
                  <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Registered Volunteers and NGOs</h2>
                </div>
                
                <div className="flex space-x-2">
                <Button 
                  variant={helperFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setHelperFilter('all')}
                  className={cn(
                    "shadow-md shadow-black/20",
                    helperFilter !== 'all' && "text-black dark:text-white"
                  )}
                >               
                  All
                </Button>
                <Button 
                  variant={helperFilter === 'volunteer' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setHelperFilter('volunteer')}
                  className={cn(
                    "shadow-md shadow-black/20",
                    helperFilter !== 'volunteer' && "text-black dark:text-white"
                  )}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Volunteers
                </Button>
                <Button 
                  variant={helperFilter === 'ngo' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setHelperFilter('ngo')}
                  className={cn(
                    "shadow-md shadow-black/20",
                    helperFilter !== 'ngo' && "text-black dark:text-white"
                  )}
                >
                  <Building className="h-4 w-4 mr-1" />
                  NGOs
                </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className="rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                  >
                    <UserProfile
                      name={user.name}
                      role={user.role as 'volunteer' | 'ngo'}
                      contactInfo={user.contactInfo}
                      location={user.location}
                      lastActive={user.lastActive}
                      skills={user.role === 'volunteer' ? user.skills : undefined}
                      userId={user.id}
                    />
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="col-span-2 py-10 text-center" style={{ color: colors.text }}>
                    <AlertTriangle className="mx-auto mb-2 h-10 w-10 opacity-30" />
                    <p>No {helperFilter === 'volunteer' ? 'volunteers' : 'NGOs'} found</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllHelpersDialog(true)}
                  className="px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-black/20 hover:scale-[1.02] transition-all duration-300 text-black dark:text-white"
                >
                  View All Registered Helpers
                </Button>
              </div>
            </div>
          </AnimatedTransition>
          
          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <AnimatedTransition delay={200}>
              <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-black/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-red-100/50 dark:bg-red-900/20 mr-3">
                    <AlertTriangle className="text-red-500 dark:text-red-300" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.text }}>Critical Alerts</h3>
                </div>
                
                <div className="space-y-4">
                  <StatusUpdate
                    id="govt-status-1"
                    title="Flooding in South District"
                    message="Water levels rising. Evacuation in progress. Emergency services deployed."
                    source="Emergency Management"
                    timestamp="35 minutes ago"
                    priority="high"
                  />
                  
                  <StatusUpdate
                    id="govt-status-2"
                    title="Bridge Structural Issues"
                    message="Highway 95 bridge showing damage. Engineers dispatched. Avoid area."
                    source="Transportation Department"
                    timestamp="2 hours ago"
                    priority="high"
                  />
                </div>
              </div>
            </AnimatedTransition>
            
            {/* Agency Coordination */}
            <AnimatedTransition delay={250}>
              <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-black/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-green-100/50 dark:bg-green-900/20 mr-3">
                    <Users className="text-green-500 dark:text-green-300" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.text }}>Agency Coordination</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-black/10 shadow-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span style={{ color: colors.text }}>Emergency Services</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-300">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-black/10 shadow-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span style={{ color: colors.text }}>Public Health</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-300">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-black/10 shadow-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span style={{ color: colors.text }}>Transportation</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-300">Limited</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-black/10 shadow-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span style={{ color: colors.text }}>Utilities</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-300">Limited</span>
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </div>
      
      <RegisteredHelpersDialog 
        open={showAllHelpersDialog} 
        onOpenChange={setShowAllHelpersDialog} 
      />
    </div>
  );
};

export default GovernmentDashboard;