import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Droplet, Home, ShoppingBag, Utensils, Heart, Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";

interface ResourceCardProps {
  type: 'need' | 'offer';
  category: 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
  title: string;
  description: string;
  location: string;
  locationDetails?: string;
  contact?: string;
  contactName?: string;
  urgent?: boolean;
  className?: string;
  requestId?: string;
  isRequested?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  type,
  category,
  title,
  description,
  location,
  locationDetails,
  contact,
  contactName,
  urgent = false,
  className,
  requestId = '',
  isRequested = false,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasResponded, setHasResponded] = useState(isRequested);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAlreadyResponded, setIsAlreadyResponded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Color scheme matching Dashboard
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
  
  useEffect(() => {
    const checkUserResponses = () => {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        const user = JSON.parse(authUser);
        setCurrentUser(user);
        
        if (requestId) {
          const shouldCheckResponses = 
            (user.role === 'victim' && type === 'offer') || 
            (['volunteer', 'ngo', 'government'].includes(user.role) && type === 'need');
          
          if (shouldCheckResponses) {
            const userResponses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
            const hasAlreadyResponded = userResponses.some((response: any) => response.requestId === requestId);
            setHasResponded(hasAlreadyResponded);
          } else {
            setHasResponded(false);
          }
        } else {
          setHasResponded(isRequested);
        }
      }
    };
    
    const checkGlobalResponses = () => {
      if (requestId) {
        let anyoneResponded = false;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('responses_')) {
            try {
              const responses = JSON.parse(localStorage.getItem(key) || '[]');
              if (responses.some((response: any) => response.requestId === requestId)) {
                anyoneResponded = true;
                break;
              }
            } catch (error) {
              console.error('Error checking responses:', error);
            }
          }
        }
        setIsAlreadyResponded(anyoneResponded);
      }
    };
    
    checkUserResponses();
    checkGlobalResponses();
    
    const handleResponseUpdate = () => {
      checkUserResponses();
      checkGlobalResponses();
    };
    
    window.addEventListener('response-created', handleResponseUpdate);
    window.addEventListener('response-updated', handleResponseUpdate);
    window.addEventListener('resource-updated', handleResourceUpdate);
    window.addEventListener('auth-changed', handleResponseUpdate);
    
    return () => {
      window.removeEventListener('response-created', handleResponseUpdate);
      window.removeEventListener('response-updated', handleResponseUpdate);
      window.removeEventListener('resource-updated', handleResourceUpdate);
      window.removeEventListener('auth-changed', handleResponseUpdate);
    };
  }, [requestId, isRequested, type]);
  
  useEffect(() => {
    if (isRequested !== undefined) {
      if (currentUser) {
        const isUserRoleCompatible = 
          (currentUser.role === 'victim' && type === 'offer') || 
          (['volunteer', 'ngo', 'government'].includes(currentUser.role) && type === 'need');
        
        setHasResponded(isUserRoleCompatible && isRequested);
      } else {
        setHasResponded(isRequested);
      }
    }
  }, [isRequested, currentUser, type]);
  
  useEffect(() => {
    const syncResponseState = () => {
      if (currentUser && requestId) {
        const isUserRoleCompatible = 
          (currentUser.role === 'victim' && type === 'offer') || 
          (['volunteer', 'ngo', 'government'].includes(currentUser.role) && type === 'need');
        
        if (isUserRoleCompatible) {
          const userResponses = JSON.parse(localStorage.getItem(`responses_${currentUser.id}`) || '[]');
          const hasAlreadyResponded = userResponses.some((response: any) => response.requestId === requestId);
          setHasResponded(hasAlreadyResponded);
        } else {
          setHasResponded(false);
        }
      }
      
      if (requestId) {
        let anyoneResponded = false;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('responses_')) {
            try {
              const responses = JSON.parse(localStorage.getItem(key) || '[]');
              if (responses.some((response: any) => response.requestId === requestId)) {
                anyoneResponded = true;
                break;
              }
            } catch (error) {
              console.error('Error checking responses:', error);
            }
          }
        }
        setIsAlreadyResponded(anyoneResponded);
      }
    };
    
    syncResponseState();
    
    window.addEventListener('popstate', syncResponseState);
    
    return () => {
      window.removeEventListener('popstate', syncResponseState);
    };
  }, [currentUser, requestId, type]);
  
  const handleResourceUpdate = () => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      setCurrentUser(user);
      
      if (requestId) {
        const shouldCheckResponses = 
          (user.role === 'victim' && type === 'offer') || 
          (['volunteer', 'ngo', 'government'].includes(user.role) && type === 'need');
        
        if (shouldCheckResponses) {
          const userResponses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
          const hasAlreadyResponded = userResponses.some((response: any) => response.requestId === requestId);
          setHasResponded(hasAlreadyResponded);
        } else {
          setHasResponded(false);
        }
        
        let anyoneResponded = false;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('responses_')) {
            try {
              const responses = JSON.parse(localStorage.getItem(key) || '[]');
              if (responses.some((response: any) => response.requestId === requestId)) {
                anyoneResponded = true;
                break;
              }
            } catch (error) {
              console.error('Error checking responses:', error);
            }
          }
        }
        setIsAlreadyResponded(anyoneResponded);
      }
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'water':
        return <Droplet size={18} />;
      case 'shelter':
        return <Home size={18} />;
      case 'food':
        return <Utensils size={18} />;
      case 'supplies':
        return <ShoppingBag size={18} />;
      case 'medical':
        return <Heart size={18} />;
      case 'safety':
        return <Shield size={18} />;
      default:
        return <Droplet size={18} />;
    }
  };

  const canInteract = () => {
    if (!currentUser) return false;
    
    if ((currentUser.role === 'volunteer' || currentUser.role === 'ngo' || currentUser.role === 'government') && type === 'need') {
      return true;
    }
    
    if (currentUser.role === 'victim' && type === 'offer') {
      return true;
    }
    
    return false;
  };

  const handleRequestClick = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request or respond",
      });
      navigate('/login');
      return;
    }
    
    if (!canInteract()) {
      if ((currentUser.role === 'volunteer' || currentUser.role === 'ngo' || currentUser.role === 'government') && type === 'offer') {
        toast({
          title: "Action Not Available",
          description: "As a volunteer, you can only respond to needs, not request resources",
        });
      } else if (currentUser.role === 'victim' && type === 'need') {
        toast({
          title: "Action Not Available",
          description: "As someone affected, you can only request resources, not respond to needs",
        });
      }
      return;
    }
    
    if (isAlreadyResponded && type === 'need') {
      toast({
        title: "Already In Progress",
        description: "This request is already being addressed by another volunteer or organization",
      });
      return;
    }
    
    setIsRequesting(true);
    
    setTimeout(() => {
      setIsRequesting(false);
      setHasResponded(true);
      setIsAlreadyResponded(true);
      
      const responseId = Date.now().toString();
      const userResponses = JSON.parse(localStorage.getItem(`responses_${currentUser.id}`) || '[]');
      
      const existingResponseIndex = userResponses.findIndex((response: any) => response.requestId === requestId);
      
      const newResponse = {
        id: responseId,
        requestId,
        type: type === 'need' ? 'offer' : 'request',
        category,
        title,
        time: Date.now(),
        status: 'pending',
        responderName: currentUser.name || currentUser.email || 'User',
        responderRole: currentUser.role,
        responderUserId: currentUser.id
      };
      
      if (existingResponseIndex === -1) {
        localStorage.setItem(`responses_${currentUser.id}`, JSON.stringify([newResponse, ...userResponses]));
        
        const notifications = JSON.parse(localStorage.getItem(`notifications_${currentUser.id}`) || '[]');
        
        const newNotification = {
          id: Date.now().toString(),
          type: type === 'need' ? 'response' : 'request',
          title: type === 'need' ? 'You offered help' : 'You requested resource',
          message: `You have ${type === 'need' ? 'offered to help with' : 'requested'}: ${title}`,
          time: Date.now(),
          read: false,
          link: '/connect'
        };
        
        localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify([newNotification, ...notifications]));
        
        const respondedRequests = JSON.parse(localStorage.getItem(`responded_requests_${currentUser.id}`) || '[]');
        if (!respondedRequests.includes(requestId)) {
          respondedRequests.push(requestId);
          localStorage.setItem(`responded_requests_${currentUser.id}`, JSON.stringify(respondedRequests));
        }
        
        if (type === 'need') {
          const storedResources = localStorage.getItem('resources');
          if (storedResources) {
            try {
              const resources = JSON.parse(storedResources);
              const updatedResources = resources.map((resource: any) => {
                if (resource.id === requestId) {
                  return {
                    ...resource,
                    status: 'addressing',
                    assignedTo: currentUser.name || currentUser.email || 'Volunteer'
                  };
                }
                return resource;
              });
              localStorage.setItem('resources', JSON.stringify(updatedResources));
            } catch (error) {
              console.error('Error updating resources:', error);
            }
          }
        }
        
        toast({
          title: type === 'need' ? "Response Sent" : "Request Sent",
          description: type === 'need' 
            ? "Your offer to help has been sent" 
            : "Your request has been submitted",
        });
        
        window.dispatchEvent(new Event('response-created'));
        window.dispatchEvent(new Event('resource-updated'));
      }
    }, 1000);
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-2xl transition-all shadow-xl backdrop-blur-sm hover:scale-105 duration-300',
        'shadow-[0_0_10px_0_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_0_rgba(0,0,0,0.6)]',
        className
      )}
      style={{
        backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
        borderColor: colors.border
      }}
    >
      {urgent && (
        <div 
          className="absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-bl-lg"
          style={{
            backgroundColor: colors.danger,
            color: 'white'
          }}
        >
          Urgent
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div 
            className="p-2 rounded-full mr-3"
            style={{
              backgroundColor: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(129,140,248,0.1)',
              color: colors.primary
            }}
          >
            {getCategoryIcon()}
          </div>
          <div>
            <p 
              className="text-xs uppercase tracking-wider"
              style={{ color: colors.text, opacity: 0.8 }}
            >
              {type === 'need' ? 'Needed' : 'Offered'}
            </p>
            <h3 
              className="font-semibold text-lg mt-0.5"
              style={{ color: colors.text }}
            >
              {title}
            </h3>
          </div>
        </div>
        
        <p 
          className="text-sm mb-4 line-clamp-2"
          style={{ color: colors.text, opacity: 0.9 }}
        >
          {description}
        </p>
        
        <div 
          className="text-xs mb-4"
          style={{ color: colors.text, opacity: 0.8 }}
        >
          <p>Location: {location}</p>
          {locationDetails && <p className="mt-1">Details: {locationDetails}</p>}
          {contact && <p className="mt-1">Contact: {contact}</p>}
          {contactName && <p className="mt-1">Contact Name: {contactName}</p>}
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setShowDetails(true)}
            variant="ghost"
            size="sm"
            className="flex items-center text-xs"
            style={{ color: colors.primary }}
          >
            <Info size={14} className="mr-1.5" />
            <span>Details</span>
          </Button>
          
          {hasResponded ? (
            <button 
              disabled
              className="flex items-center text-sm font-medium py-1.5 px-3 rounded-full transition-colors"
              style={{
                backgroundColor: theme === 'light' ? 'rgba(16,185,129,0.1)' : 'rgba(52,211,153,0.1)',
                color: colors.secondary
              }}
            >
              <CheckCircle size={14} className="mr-1.5" />
              <span>{type === 'need' ? 'Response Sent' : 'Requested'}</span>
            </button>
          ) : isAlreadyResponded && type === 'need' ? (
            <button 
              disabled
              className="flex items-center text-sm font-medium py-1.5 px-3 rounded-full transition-colors"
              style={{
                backgroundColor: theme === 'light' ? 'rgba(251,191,36,0.1)' : 'rgba(251,191,36,0.1)',
                color: colors.warning
              }}
            >
              <CheckCircle size={14} className="mr-1.5" />
              <span>Being Addressed</span>
            </button>
          ) : !canInteract() && currentUser ? (
            <div 
              className="flex items-center text-xs"
              style={{ color: colors.warning }}
            >
              <AlertTriangle size={12} className="mr-1" />
              <span>
                {currentUser.role === 'victim' && type === 'need' 
                  ? 'Switch to volunteer mode to help' 
                  : 'Not available for your role'}
              </span>
            </div>
          ) : (
            <button 
              onClick={handleRequestClick}
              disabled={isRequesting}
              className={cn(
                "flex items-center text-sm font-medium py-1.5 px-3 rounded-full transition-all focus-ring disabled:opacity-50",
                "bg-gradient-to-r hover:shadow-md hover:scale-[1.02] shadow-sm"
              )}
              style={{
                backgroundImage: type === 'need' 
                  ? `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
                  : `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`,
                color: 'white'
              }}
              aria-label={type === 'need' ? 'I can help' : 'I need this'}
            >
              {isRequesting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <span className="mr-1.5">{type === 'need' ? 'Respond' : 'Request'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent 
          className="sm:max-w-md rounded-2xl backdrop-blur-sm"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div 
                className="p-1.5 rounded-full"
                style={{
                  backgroundColor: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(129,140,248,0.1)',
                  color: colors.primary
                }}
              >
                {getCategoryIcon()}
              </div>
              <span style={{ color: colors.text }}>{title}</span>
              {urgent && (
                <span 
                  className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: theme === 'light' ? 'rgba(239,68,68,0.1)' : 'rgba(248,113,113,0.1)',
                    color: colors.danger,
                    borderColor: colors.danger
                  }}
                >
                  Urgent
                </span>
              )}
            </DialogTitle>
            <DialogDescription style={{ color: colors.text, opacity: 0.8 }}>
              {type === 'need' ? 'Resource Needed' : 'Resource Offered'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 style={{ color: colors.text }} className="text-sm font-medium mb-1">
                Description
              </h4>
              <p style={{ color: colors.text, opacity: 0.9 }} className="text-sm">
                {description}
              </p>
            </div>
            
            <div>
              <h4 style={{ color: colors.text }} className="text-sm font-medium mb-1">
                Location
              </h4>
              <p style={{ color: colors.text, opacity: 0.9 }} className="text-sm">
                {location}
              </p>
            </div>
            
            {locationDetails && (
              <div>
                <h4 style={{ color: colors.text }} className="text-sm font-medium mb-1">
                  Location Details
                </h4>
                <p style={{ color: colors.text, opacity: 0.9 }} className="text-sm">
                  {locationDetails}
                </p>
              </div>
            )}
            
            {contact && (
              <div>
                <h4 style={{ color: colors.text }} className="text-sm font-medium mb-1">
                  Contact
                </h4>
                <p style={{ color: colors.text, opacity: 0.9 }} className="text-sm">
                  {contact}
                </p>
              </div>
            )}
            
            {contactName && (
              <div>
                <h4 style={{ color: colors.text }} className="text-sm font-medium mb-1">
                  Contact Name
                </h4>
                <p style={{ color: colors.text, opacity: 0.9 }} className="text-sm">
                  {contactName}
                </p>
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              {!hasResponded && !isAlreadyResponded && canInteract() && (
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    handleRequestClick();
                  }}
                  className="flex items-center hover:shadow-md hover:scale-[1.02] transition-all"
                  style={{
                    backgroundImage: type === 'need' 
                      ? `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
                      : `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`,
                    color: 'white'
                  }}
                  disabled={isRequesting}
                >
                  {isRequesting ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <span className="mr-1.5">{type === 'need' ? 'Respond' : 'Request'}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </Button>
              )}
              {isAlreadyResponded && type === 'need' && !hasResponded && (
                <div 
                  className="text-sm flex items-center"
                  style={{ color: colors.warning }}
                >
                  <AlertTriangle size={16} className="mr-1" />
                  <span>This request is already being addressed</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceCard;