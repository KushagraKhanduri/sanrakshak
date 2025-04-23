import React from 'react';
import { cn } from '@/lib/utils';
import { Phone, MessageCircle, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';

interface EmergencyContactProps {
  name: string;
  role: string;
  phone: string;
  contactId?: string;
  available?: boolean;
  className?: string;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({
  name,
  role,
  phone,
  contactId = "default",
  available = true,
  className,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    console.log('Phone number copied to clipboard');
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm hover:scale-[1.02] shadow-xl',
        className
      )}
      style={{
        backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
        borderColor: isLight ? 'rgba(226,232,240,0.5)' : 'rgba(51,65,85,0.5)'
      }}
    >
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: isLight ? '#334155' : '#E2E8F0' }}>{name}</h3>
            <p className={cn("text-xs mt-1", isLight ? "text-gray-500" : "text-gray-400")}>{role}</p>
          </div>
          <div className={cn(
            'h-3 w-3 rounded-full mt-1',
            available 
              ? (isLight ? 'bg-black' : 'bg-white') 
              : (isLight ? 'bg-gray-400' : 'bg-gray-600')
          )} />
        </div>
        
        <div className="flex items-center mt-4 mb-2">
          <div className="font-mono text-sm" style={{ color: isLight ? '#334155' : '#E2E8F0' }}>{phone}</div>
          <button 
            onClick={handleCopyPhone}
            className={cn(
              "ml-2 p-1.5 rounded-full transition-colors",
              isLight ? "hover:bg-gray-200" : "hover:bg-white/10"
            )}
            aria-label="Copy phone number"
          >
            <Copy size={14} className={isLight ? 'text-gray-700' : 'text-gray-300'} />
          </button>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <button 
            className={cn(
              'flex items-center justify-center rounded-full py-1.5 px-4 text-sm transition-colors flex-1',
              available 
                ? (isLight 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'bg-white text-black hover:bg-white/90')
                : (isLight 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white/10 text-gray-400 cursor-not-allowed')
            )}
            disabled={!available}
          >
            <Phone size={14} className="mr-1.5" />
            <span>Call</span>
          </button>
          
          <Link 
            to={`/chat/${contactId}`}
            className={cn(
              "flex items-center justify-center rounded-full py-1.5 px-4 text-sm transition-colors flex-1",
              isLight 
                ? "bg-gray-100 hover:bg-gray-200" 
                : "bg-white/10 hover:bg-white/15"
            )}
          >
            <MessageCircle size={14} className="mr-1.5" />
            <span>Message</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;