import React from 'react';
import { cn } from '@/lib/utils';
import { User, Phone, MapPin, Clock, BadgeHelp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeProvider";

interface UserProfileProps {
  name: string;
  role: 'victim' | 'volunteer' | 'government' | 'ngo';
  contactInfo: string;
  location: string;
  lastActive: string;
  skills?: string[];
  needsHelp?: string[];
  className?: string;
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  role,
  contactInfo,
  location,
  lastActive,
  skills = [],
  needsHelp = [],
  className,
  userId = 'default-id',
}) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Color scheme matching ResourceCard
  const colors = {
    primary: isLight ? '#6366F1' : '#818CF8',
    secondary: isLight ? '#10B981' : '#34D399',
    danger: isLight ? '#EF4444' : '#F87171',
    warning: isLight ? '#F59E0B' : '#FBBF24',
    accent: isLight ? '#EC4899' : '#F472B6',
    background: isLight ? '#F8FAFC' : '#0F172A',
    card: isLight ? '#FFFFFF' : '#1E293B',
    text: isLight ? '#334155' : '#E2E8F0',
    border: isLight ? '#E2E8F0' : '#334155'
  };
  
  const getRoleDisplay = () => {
    switch (role) {
      case 'victim':
        return { 
          label: 'Needs Assistance', 
          icon: BadgeHelp, 
          bgClass: 'bg-red-500/10',
          textColor: 'text-red-500'
        };
      case 'volunteer':
        return { 
          label: 'Volunteer', 
          icon: User, 
          bgClass: 'bg-blue-500/10',
          textColor: 'text-blue-500'
        };
      case 'government':
        return { 
          label: 'Government', 
          icon: Shield, 
          bgClass: 'bg-purple-500/10',
          textColor: 'text-purple-500'
        };
      case 'ngo':
        return { 
          label: 'NGO', 
          icon: Shield, 
          bgClass: 'bg-green-500/10',
          textColor: 'text-green-500'
        };
      default:
        return { 
          label: 'User', 
          icon: User, 
          bgClass: 'bg-gray-500/10',
          textColor: 'text-gray-500'
        };
    }
  };
  
  const roleInfo = getRoleDisplay();
  const RoleIcon = roleInfo.icon;

  const handleConnect = () => {
    // Create a connection record in localStorage
    const currentUser = localStorage.getItem('authUser');
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect with others",
      });
      return;
    }

    const connections = JSON.parse(localStorage.getItem('connections') || '[]');
    const parsedUser = JSON.parse(currentUser);
    
    // Check if connection already exists
    const existingConnection = connections.find(
      (conn: any) => conn.userId === parsedUser.id && conn.connectedTo === userId
    );
    
    if (!existingConnection) {
      connections.push({
        id: `conn-${Date.now()}`,
        userId: parsedUser.id,
        connectedTo: userId,
        userName: parsedUser.name,
        connectedName: name,
        timestamp: Date.now(),
        status: 'pending'
      });
      
      localStorage.setItem('connections', JSON.stringify(connections));
      
      toast({
        title: "Connection Request Sent",
        description: `You've requested to connect with ${name}`,
      });
    } else {
      toast({
        title: "Already Connected",
        description: `You're already connected with ${name}`,
      });
    }
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm',
        className
      )}
      style={{
        backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
        borderColor: colors.border
      }}
    >
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div 
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              roleInfo.bgClass,
              roleInfo.textColor
            )}
          >
            <RoleIcon size={20} />
          </div>
          <div className="ml-3">
            <h3 
              className="font-semibold"
              style={{ color: colors.text }}
            >
              {name}
            </h3>
            <div className="flex items-center mt-0.5">
              <span 
                className={cn(
                  'text-xs rounded-full px-2 py-0.5',
                  roleInfo.bgClass,
                  roleInfo.textColor
                )}
              >
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm" style={{ color: colors.text, opacity: 0.9 }}>
            <Phone size={14} className="mr-2" style={{ opacity: 0.7 }} />
            <span>{contactInfo}</span>
          </div>
          <div className="flex items-center text-sm" style={{ color: colors.text, opacity: 0.9 }}>
            <MapPin size={14} className="mr-2" style={{ opacity: 0.7 }} />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm" style={{ color: colors.text, opacity: 0.9 }}>
            <Clock size={14} className="mr-2" style={{ opacity: 0.7 }} />
            <span>Last active: {lastActive}</span>
          </div>
        </div>
        
        {role === 'volunteer' && skills.length > 0 && (
          <div className="mb-4">
            <h4 
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: colors.text, opacity: 0.7 }}
            >
              Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: isLight ? 'rgba(99,102,241,0.1)' : 'rgba(129,140,248,0.1)',
                    color: colors.primary
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {role === 'victim' && needsHelp.length > 0 && (
          <div className="mb-4">
            <h4 
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: colors.text, opacity: 0.7 }}
            >
              Needs Assistance With
            </h4>
            <div className="flex flex-wrap gap-1">
              {needsHelp.map((need, index) => (
                <span 
                  key={index} 
                  className="text-xs rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: isLight ? 'rgba(239,68,68,0.1)' : 'rgba(248,113,113,0.1)',
                    color: colors.danger
                  }}
                >
                  {need}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-3">
          <button 
            onClick={handleConnect} 
            className="flex-1 py-1.5 rounded-full text-sm font-medium hover:shadow-md hover:scale-[1.02] transition-all shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
              color: 'white'
            }}
          >
            {role === 'victim' ? 'Provide Help' : 'Connect'}
          </button>
          <Link 
            to={`/chat/${userId}`} 
            className="flex-1 py-1.5 rounded-full text-sm font-medium text-center hover:shadow-md hover:scale-[1.02] transition-all shadow-sm"
            style={{
              backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.9)',
              color: colors.text,
              borderColor: colors.border
            }}
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;