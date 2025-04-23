
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}

const App = () => {
  useEffect(() => {
    const checkRoutes = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && ![
        "login", 
        "signup", 
        "dashboard",
        "connect", 
        "resources", 
        "map", 
        "alerts", 
        "profile", 
        "settings", 
        "forgot-password"
      ].some(route => currentPath.includes(route))) {
        console.error(`404 Error: User attempted to access non-existent route: ${currentPath}`);
      }
    };
    
    checkRoutes();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
