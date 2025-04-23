import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, Info, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';

interface StatusUpdateProps {
  id?: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high';
  className?: string;
}

const StatusUpdate: React.FC<StatusUpdateProps> = ({
  id = "status-1",
  title,
  message,
  source,
  timestamp,
  priority = 'medium',
  className,
}) => {
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

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return {
          borderColor: colors.danger,
          icon: <AlertTriangle size={16} className="text-red-500" />,
          bgClass: 'bg-red-500/10'
        };
      case 'medium':
        return {
          borderColor: colors.warning,
          icon: <Bell size={16} className="text-amber-500" />,
          bgClass: 'bg-amber-500/10'
        };
      case 'low':
        return {
          borderColor: colors.primary,
          icon: <Info size={16} className="text-blue-500" />,
          bgClass: 'bg-blue-500/10'
        };
      default:
        return {
          borderColor: colors.warning,
          icon: <Bell size={16} className="text-amber-500" />,
          bgClass: 'bg-amber-500/10'
        };
    }
  };

  const priorityStyles = getPriorityStyles();

  return (
    <div 
      className={cn(
        'rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105',
        priorityStyles.bgClass,
        className
      )}
      style={{
        backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
        borderLeft: `4px solid ${priorityStyles.borderColor}`,
        borderColor: colors.border
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="pt-0.5">
            {priorityStyles.icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 
                className="font-semibold text-lg"
                style={{ color: colors.text }}
              >
                {title}
              </h3>
              <div 
                className="flex items-center text-xs"
                style={{ color: colors.text, opacity: 0.8 }}
              >
                <Clock size={12} className="mr-1" />
                <span>{timestamp}</span>
              </div>
            </div>
            
            <p 
              className="text-sm mb-4"
              style={{ color: colors.text, opacity: 0.9 }}
            >
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span 
            className="text-xs"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            Source: {source}
          </span>
          <Link 
            to={`/status/${id}`} 
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-all hover:shadow-md hover:scale-[1.03]",
              "shadow-sm"
            )}
            style={{
              backgroundColor: isLight ? 'rgba(99,102,241,0.1)' : 'rgba(129,140,248,0.1)',
              color: colors.primary,
              borderColor: colors.border
            }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdate;