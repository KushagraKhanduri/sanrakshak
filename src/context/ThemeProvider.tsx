
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    // Load theme from localStorage if available, otherwise use system preference
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Update document with current theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      
      // Apply better text contrast for dark mode
      document.documentElement.style.setProperty('--foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--card-foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--popover-foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--muted-foreground', '0 0% 90%');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      
      // Apply better text contrast - use full black for text in light mode
      document.documentElement.style.setProperty('--foreground', '0 0% 0%');
      document.documentElement.style.setProperty('--card-foreground', '0 0% 0%');
      document.documentElement.style.setProperty('--popover-foreground', '0 0% 0%');
      document.documentElement.style.setProperty('--muted-foreground', '0 0% 5%');
    }
    
    // Add dark class for libraries that use the .dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
