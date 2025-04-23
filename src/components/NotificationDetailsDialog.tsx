
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, AlertTriangle, Info, MessageSquare, Package, MapPin, Clock, User } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { cn } from '@/lib/utils';

type NotificationType = 'alert' | 'request' | 'response' | 'system' | 'update';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: number;
  read: boolean;
  link?: string;
  source?: string;
  location?: string;
}

interface NotificationDetailsDialogProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationIcon = ({ type, isLight }: { type: NotificationType, isLight: boolean }) => {
  const getIconClass = isLight ? "text-black" : "text-white";
  
  switch (type) {
    case 'alert':
      return <AlertTriangle size={16} className={getIconClass} />;
    case 'request':
      return <Package size={16} className={getIconClass} />;
    case 'response':
      return <MessageSquare size={16} className={getIconClass} />;
    case 'update':
      return <Info size={16} className={getIconClass} />;
    default:
      return <Bell size={16} className={getIconClass} />;
  }
};

export const NotificationDetailsDialog: React.FC<NotificationDetailsDialogProps> = ({
  notification,
  open,
  onOpenChange,
  onMarkAsRead
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  if (!notification) return null;
  
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-full",
              isLight
                ? notification.type === 'alert' ? 'bg-red-100' : 'bg-gray-100'
                : notification.type === 'alert' ? 'bg-white/20' : 'bg-white/10'
            )}>
              <NotificationIcon type={notification.type} isLight={isLight} />
            </div>
            <DialogTitle>{notification.title}</DialogTitle>
          </div>
          <DialogDescription className="text-right text-sm text-gray-400">
            {formatTime(notification.time)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className={cn("mb-4", isLight ? "text-gray-800" : "")}>{notification.message}</p>
          
          {(notification.source || notification.location) && (
            <div className={cn(
              "space-y-2 mt-4 text-sm",
              isLight ? "text-gray-600" : "text-gray-400"
            )}>
              {notification.source && (
                <div className="flex items-center">
                  <Bell size={14} className="mr-2" />
                  <span>Source: {notification.source}</span>
                </div>
              )}
              {notification.location && (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  <span>Location: {notification.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock size={14} className="mr-2" />
                <span>Received: {formatTime(notification.time)}</span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => onMarkAsRead(notification.id)}
            >
              <CheckCheck size={16} className="mr-2" />
              Mark as read
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDetailsDialog;
