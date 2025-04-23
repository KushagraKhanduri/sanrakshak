
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportsSection from '@/components/ReportsSection';
import { useTheme } from '../context/ThemeProvider';

const Reports = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen ${isLight ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className={`flex items-center ${isLight ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">NGO Reports</h1>
          <p className={isLight ? "text-gray-600" : "text-gray-400"}>Access and download all disaster response reports.</p>
        </div>
        
        <ReportsSection />
      </div>
    </div>
  );
};

export default Reports;
