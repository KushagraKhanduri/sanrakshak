import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, AlertTriangle, Info, MessageSquare, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDetailsDialog from './NotificationDetailsDialog';
import { useTheme } from '../context/ThemeProvider';

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

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'alert':
      return <AlertTriangle size={16} className="text-white" />;
    case 'request':
      return <Package size={16} className="text-white" />;
    case 'response':
      return <MessageSquare size={16} className="text-white" />;
    case 'update':
      return <Info size={16} className="text-white" />;
    default:
      return <Bell size={16} className="text-white" />;
  }
};

const getIconBackgroundColor = (type: NotificationType, isLight: boolean) => {
  switch (type) {
    case 'alert':
      return isLight ? "bg-red-500" : "bg-red-500/80";
    case 'request':
      return isLight ? "bg-amber-500" : "bg-amber-500/80";
    case 'response':
      return isLight ? "bg-blue-500" : "bg-blue-500/80";
    case 'update':
      return isLight ? "bg-emerald-500" : "bg-emerald-500/80";
    default:
      return isLight ? "bg-purple-500" : "bg-purple-500/80";
  }
};

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

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  
  useEffect(() => {
    const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else if (user.id) {
      const initialNotifications: Notification[] = [
        {
          id: '1',
          type: 'alert',
          title: 'Weather Alert',
          message: 'Flash flood warning for your area. Move to higher ground immediately.',
          time: Date.now() - 1800000,
          read: false,
          source: 'Weather Department',
          location: 'Jabalpur, Central Region'
        },
        {
          id: '2',
          type: 'request',
          title: 'Request Received',
          message: 'Your request for water supplies has been acknowledged.',
          time: Date.now() - 3600000,
          read: false,
          source: 'Relief Management Center',
          location: 'Distribution Center, Jabalpur'
        },
        {
          id: '3',
          type: 'response',
          title: 'Response to Your Offer',
          message: 'Mark Johnson has responded to your shelter offer.',
          time: Date.now() - 86400000,
          read: true,
          source: 'Community Connect Portal',
          location: 'South Jabalpur'
        },
        {
          id: '4',
          type: 'update',
          title: 'Resource Update',
          message: 'New medical supplies are available at Central Hospital.',
          time: Date.now() - 43200000,
          read: false,
          source: 'Health Department',
          location: 'Central Hospital, Jabalpur'
        }
      ];
      
      setNotifications(initialNotifications);
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(initialNotifications));
    }
  }, [user.id]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
  };
  
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailsDialogOpen(true);
    markAsRead(notification.id);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className="p-2 rounded-full hover:bg-white/5 transition-colors focus-ring relative"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <Bell size={20} className={unreadCount > 0 ? "text-blue-500" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed sm:absolute right-2 sm:right-0 top-16 sm:top-auto sm:mt-2 
              w-[calc(100vw-1rem)] sm:w-80 md:w-96
              ${isLight ? "bg-white border border-gray-300" : "bg-black border border-white/10"} 
              shadow-xl rounded-xl z-50 overflow-hidden
            `}
          >
            <div className={`p-4 ${isLight ? "border-b border-gray-200" : "border-b border-white/10"} flex justify-between items-center`}>
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className={`text-xs flex items-center ${isLight ? "text-blue-600 hover:text-blue-800" : "text-blue-400 hover:text-blue-300"}`}
                  >
                    <CheckCheck size={14} className="mr-1" />
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-full ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
              {notifications.length > 0 ? (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        p-3 
                        ${isLight ? "border-b border-gray-200 hover:bg-gray-50" : "border-b border-white/5 hover:bg-white/5"} 
                        cursor-pointer transition-colors 
                        ${!notification.read ? (isLight ? "bg-blue-50" : "bg-blue-900/10") : ''}
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-2 rounded-full flex-shrink-0 ${getIconBackgroundColor(notification.type, isLight)}`}>
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                            <span className={`text-xs ${isLight ? "text-gray-600" : "text-white"} whitespace-nowrap flex-shrink-0`}>
                              {formatTime(notification.time)}
                            </span>
                          </div>
                          <p className={`text-sm ${isLight ? "text-gray-800" : "text-white"} mt-1 line-clamp-2`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className={`${isLight ? "text-gray-700" : "text-gray-400"} text-sm`}>No notifications yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <NotificationDetailsDialog
        notification={selectedNotification}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
};

export default Notifications;