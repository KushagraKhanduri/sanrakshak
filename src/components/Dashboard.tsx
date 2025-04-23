import React, { useState, useEffect, useCallback } from 'react';
import VictimDashboard from './dashboards/VictimDashboard';
import VolunteerDashboard from './dashboards/VolunteerDashboard';
import NGODashboard from './dashboards/NGODashboard';
import GovernmentDashboard from './dashboards/GovernmentDashboard';
import { Info, Map, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';
import { useTheme } from '@/context/ThemeProvider';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'updates' | 'map'>('resources');
  const [userRole, setUserRole] = useState<'victim' | 'volunteer' | 'ngo' | 'government' | null>(null);
  const [dashboardKey, setDashboardKey] = useState(Date.now());
  const resourceData = useResourceData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // Color scheme matching other components
  const colors = {
    primary: isLight ? '#6366F1' : '#818CF8',
    secondary: isLight ? '#10B981' : '#34D399',
    danger: isLight ? '#EF4444' : '#F87171',
    warning: isLight ? '#F59E0B' : '#FBBF24',
    accent: isLight ? '#EC4899' : '#F472B6',
    background: isLight ? '#FFFFFF' : '#0F172A', // Slightly darker white for light mode
    card: isLight ? '#FFFFFF' : '#1E293B',
    text: isLight ? '#334155' : '#E2E8F0',
    border: isLight ? '#E2E8F0' : '#334155'
  };

  const fetchUserRole = useCallback(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      setUserRole(user.role);
      console.info('Rendering dashboard for role:', user.role);
    } else {
      setUserRole('victim');
      console.warn('No role specified, defaulting to Victim dashboard');
    }
  }, [navigate]);
  
  useEffect(() => {
    fetchUserRole();
    
    const handleAuthChange = () => {
      fetchUserRole();
      setDashboardKey(Date.now());
    };
    
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      setDashboardKey(parseInt(refreshParam));
    }
    
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('role-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('role-changed', handleAuthChange);
    };
  }, [fetchUserRole, searchParams]);
  
  useEffect(() => {
    const handleResourceUpdate = () => {
      window.dispatchEvent(new Event('resource-updated'));
      console.log('Resource updated in Dashboard component');
    };
    
    window.addEventListener('resource-created', handleResourceUpdate);
    window.addEventListener('response-created', handleResourceUpdate);
    window.addEventListener('response-updated', handleResourceUpdate);
    
    return () => {
      window.removeEventListener('resource-created', handleResourceUpdate);
      window.removeEventListener('response-created', handleResourceUpdate);
      window.removeEventListener('response-updated', handleResourceUpdate);
    };
  }, []);
  
  const EmergencyAlert = () => (
    <div className="mb-6">
      {/* Emergency alert content remains commented out */}
    </div>
  );
  
  const renderDashboardByRole = () => {
    switch (userRole) {
      case 'victim':
        return <VictimDashboard key={dashboardKey} resourceData={resourceData} />;
      case 'volunteer':
        return <VolunteerDashboard key={dashboardKey} resourceData={resourceData} />;
      case 'ngo':
        return <NGODashboard key={dashboardKey} resourceData={resourceData} />;
      case 'government':
        return <GovernmentDashboard key={dashboardKey} resourceData={resourceData} />;
      default:
        return <VictimDashboard key={dashboardKey} resourceData={resourceData} />;
    }
  };
  
  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto px-4 py-8">
        <EmergencyAlert />
        {renderDashboardByRole()}
      </div>
    </div>
  );
};

export default Dashboard;