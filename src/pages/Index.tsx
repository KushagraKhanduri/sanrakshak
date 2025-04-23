
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeProvider';

const Index = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // Reset animation states from framer-motion when mounting
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    
    // This helps reset any stuck animations in framer-motion
    const cleanup = () => {
      const motionDivs = document.querySelectorAll('div[style*="--motion-scale"]');
      motionDivs.forEach(div => {
        if (div instanceof HTMLElement) {
          div.style.transform = '';
          div.style.opacity = '1';
        }
      });
    };
    
    cleanup();
    return cleanup;
  }, []);
  
  return (
    <div className={`min-h-screen ${isLight ? 'bg-white' : 'bg-gray-900'} text-foreground relative`}>
      {/* Solid background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {isLight ? (
          <div className="absolute inset-0 bg-gray-300 opacity-100"></div>
        ) : (
          <div className="absolute inset-0 bg-gray-950 opacity-100"></div>
        )}
      </div>

      <Header emergency={true} />
      
      <main className="pt-20 pb-16 min-h-screen relative z-10">
        <Dashboard />
      </main>
      
      <footer className={`py-4 relative z-10 ${isLight ? "border-t border-gray-400" : "border-t border-gray-800"}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-2 md:mb-0">
              <span className="text-sm text-muted-foreground">
                Sanrakshak • Emergency Response System
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <span className="text-xs text-muted-foreground">
                This system is for emergency use • Always follow official guidance
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
