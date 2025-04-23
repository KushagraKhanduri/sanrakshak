import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { AlertTriangle, Bell, Clock, Filter, BellOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BackButton from '@/components/BackButton';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  timestamp: number;
  read: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const { theme } = useTheme();
  
  // Modern color scheme with vibrant accents
  const colors = {
    primary: theme === 'light' ? '#6366F1' : '#818CF8',
    secondary: theme === 'light' ? '#10B981' : '#34D399',
    danger: theme === 'light' ? '#EF4444' : '#F87171',
    warning: theme === 'light' ? '#F59E0B' : '#FBBF24',
    accent: theme === 'light' ? '#EC4899' : '#F472B6',
    background: theme === 'light' ? '#FFFFFF' : '#0F172A',
    card: theme === 'light' ? '#FFFFFF' : '#1E293B',
    text: theme === 'light' ? '#334155' : '#E2E8F0',
    border: theme === 'light' ? '#E2E8F0' : '#334155'
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedAlerts = localStorage.getItem('alerts');
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    } else {
      const sampleAlerts: Alert[] = [
        {
          id: '1',
          title: 'Flash Flood Warning',
          message: 'Flash flood warning issued for southern areas. Avoid low-lying areas and prepare for possible evacuation.',
          severity: 'critical',
          source: 'Emergency Management Agency',
          timestamp: Date.now() - 1800000,
          read: false
        },
        {
          id: '2',
          title: 'Medical Supply Distribution',
          message: 'Medical supplies will be distributed at Central Hospital from 2-6pm today. Bring ID.',
          severity: 'info',
          source: 'Health Department',
          timestamp: Date.now() - 7200000,
          read: false
        },
        {
          id: '3',
          title: 'Road Closure Update',
          message: 'Main Street remains closed due to debris. Use alternate routes via North Avenue.',
          severity: 'warning',
          source: 'Transportation Department',
          timestamp: Date.now() - 10800000,
          read: true
        },
        {
          id: '4',
          title: 'Power Restoration Progress',
          message: 'Power has been restored to 70% of affected areas. Estimated full restoration by tomorrow evening.',
          severity: 'info',
          source: 'Utility Company',
          timestamp: Date.now() - 14400000,
          read: true
        },
        {
          id: '5',
          title: 'Contaminated Water Advisory',
          message: 'Water may be contaminated in Zone 3. Boil water before consumption or use bottled water until further notice.',
          severity: 'critical',
          source: 'Water Authority',
          timestamp: Date.now() - 36000000,
          read: false
        }
      ];
      
      setAlerts(sampleAlerts);
      localStorage.setItem('alerts', JSON.stringify(sampleAlerts));
    }
  }, []);
  
  const markAsRead = (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage alerts",
      });
      return;
    }
    
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    );
    
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alert Updated",
      description: "Alert marked as read",
    });
  };
  
  const markAllAsRead = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage alerts",
      });
      return;
    }
    
    const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alerts Updated",
      description: "All alerts marked as read",
    });
  };
  
  const filteredAlerts = alerts
    .filter(alert => filter === 'all' || alert.severity === filter)
    .filter(alert => readFilter === 'all' || (readFilter === 'unread' && !alert.read))
    .sort((a, b) => b.timestamp - a.timestamp);
  
  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return `bg-gradient-to-br from-red-500/10 to-pink-500/10 ${theme === 'light' ? 'text-red-700' : 'text-red-300'}`;
      case 'warning':
        return `bg-gradient-to-br from-amber-500/10 to-yellow-500/10 ${theme === 'light' ? 'text-amber-700' : 'text-amber-300'}`;
      case 'info':
      default:
        return `bg-gradient-to-br from-blue-500/10 to-indigo-500/10 ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.background }}>
      <Header title="Emergency Alerts" />
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <BackButton />
            </div>
          
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Emergency Alerts</h1>
                <p style={{ color: colors.text }}>Stay informed about critical situations and updates</p>
              </div>
              
              <Button
                onClick={markAllAsRead}
                disabled={!user || alerts.every(alert => alert.read)}
                className={`flex items-center space-x-2 transition-all duration-300 disabled:opacity-50 ${
                  theme === 'light' 
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                }`}
              >
                <Bell size={18} />
                <span>Mark All as Read</span>
              </Button>
            </div>
            
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <Filter size={16} style={{ color: colors.text }} />
                <span className="text-sm" style={{ color: colors.text }}>Filter:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setFilter('all')}
                  variant={filter === 'all' ? 'default' : 'outline'}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'all' 
                      ? 'bg-indigo-500 text-white' 
                      : theme === 'light' 
                        ? 'text-gray-800 border-gray-300' 
                        : 'text-white border-gray-600'
                  }`}
                >
                  All
                </Button>
                <Button
                  onClick={() => setFilter('critical')}
                  variant={filter === 'critical' ? 'default' : 'outline'}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'critical' 
                      ? 'bg-red-500 text-white' 
                      : theme === 'light' 
                        ? 'text-gray-800 border-gray-300' 
                        : 'text-white border-gray-600'
                  }`}
                >
                  Critical
                </Button>
                <Button
                  onClick={() => setFilter('warning')}
                  variant={filter === 'warning' ? 'default' : 'outline'}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'warning' 
                      ? 'bg-amber-500 text-white' 
                      : theme === 'light' 
                        ? 'text-gray-800 border-gray-300' 
                        : 'text-white border-gray-600'
                  }`}
                >
                  Warning
                </Button>
                <Button
                  onClick={() => setFilter('info')}
                  variant={filter === 'info' ? 'default' : 'outline'}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'info' 
                      ? 'bg-blue-500 text-white' 
                      : theme === 'light' 
                        ? 'text-gray-800 border-gray-300' 
                        : 'text-white border-gray-600'
                  }`}
                >
                  Info
                </Button>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
                <Button
                  onClick={() => setReadFilter('all')}
                  variant={readFilter === 'all' ? 'default' : 'outline'}
                  className={`px-3 py-1 rounded-full text-sm ${
                    readFilter === 'all' 
                      ? 'bg-indigo-500 text-white' 
                      : theme === 'light' 
                        ? 'text-gray-800 border-gray-300' 
                        : 'text-white border-gray-600'
                  }`}
                >
                  All
                </Button>
                <Button
                  onClick={() => setReadFilter('unread')}
                  variant={readFilter === 'unread' ? 'default' : 'outline'}
                  className={`px-3 py-1 rounded-full text-sm ${
                    readFilter === 'unread' 
                      ? 'bg-indigo-500 text-white' 
                      : theme === 'light' 
                        ? 'text-gray-800 border-gray-300' 
                        : 'text-white border-gray-600'
                  }`}
                >
                  Unread Only
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredAlerts.map(alert => (
                <div 
                key={alert.id}
                className={`rounded-xl p-6 drop-shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm ${
                  theme === 'light' 
                    ? 'border-gray-200' 
                    : 'border-gray-700 hover:bg-black/30'
                } ${!alert.read ? (theme === 'light' ? 'ring-2 ring-indigo-200' : 'ring-2 ring-indigo-500/30') : ''}`}
                style={{
                  backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.5)',
                  borderColor: colors.border
                }}
              >
              
                  {!alert.read && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-400'} rounded-full animate-pulse`}></div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`p-3 rounded-xl ${getSeverityColor(alert.severity)}`}>
                      <AlertTriangle size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg" style={{ color: colors.text }}>{alert.title}</h3>
                      <p className="mt-2" style={{ color: colors.text, opacity: 0.9 }}>{alert.message}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                        <span className="flex items-center">
                          <Bell size={14} className="mr-1" />
                          {alert.source}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {!alert.read && (
                      <Button
                        onClick={() => markAsRead(alert.id)}
                        className={`self-end md:self-center transition-all duration-200 rounded-lg px-4 py-2 text-sm flex items-center ${
                          theme === 'light'
                            ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        }`}
                      >
                        <BellOff size={14} className="mr-1" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredAlerts.length === 0 && (
                <div 
                  className="text-center py-12 rounded-xl border"
                  style={{
                    backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  <Bell size={48} className={`mx-auto mb-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-300'}`} />
                  <h3 className="text-xl font-semibold mb-2">No Alerts</h3>
                  <p className="mb-4">
                    There are no alerts matching your current filters.
                  </p>
                  <Button
                    onClick={() => {
                      setFilter('all');
                      setReadFilter('all');
                    }}
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      theme === 'light'
                        ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    }`}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

export default Alerts;