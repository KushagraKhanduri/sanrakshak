
import React from 'react';
import { FileText, ChevronRight, FileBarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../context/ThemeProvider';
import { cn } from '@/lib/utils';

interface ReportItem {
  id: string;
  title: string;
  date: string;
  type: 'resource' | 'activity' | 'emergency';
  downloadUrl: string;
}

const ReportsSection = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // Mock data for reports
  const reports: ReportItem[] = [
    {
      id: '1',
      title: 'Monthly Resource Allocation Report',
      date: '2023-06-01',
      type: 'resource',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Emergency Response Activity Summary',
      date: '2023-05-15',
      type: 'activity',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Critical Needs Assessment',
      date: '2023-05-01',
      type: 'emergency',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Resource Distribution Analysis',
      date: '2023-04-20',
      type: 'resource',
      downloadUrl: '#'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReportTypeClass = (type: string) => {
    if (isLight) {
      switch (type) {
        case 'resource':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'activity':
          return 'bg-green-100 text-green-800 border border-green-200';
        case 'emergency':
          return 'bg-red-100 text-red-800 border border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    } else {
      switch (type) {
        case 'resource':
          return 'bg-blue-500/20 text-blue-300';
        case 'activity':
          return 'bg-green-500/20 text-green-300';
        case 'emergency':
          return 'bg-red-500/20 text-red-300';
        default:
          return 'bg-gray-500/20 text-gray-300';
      }
    }
  };

  return (
    <div className={cn(
      "rounded-xl p-6 backdrop-blur-lg shadow-xl",
      isLight 
        ? "bg-white/60 border border-gray-200/50" 
        : "bg-gray-900/40 border border-gray-800/50"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileBarChart2 className="mr-2" size={24} />
          <h2 className="text-xl font-semibold">Reports</h2>
        </div>
      </div>
      
      <div className="space-y-4">
        {reports.map(report => (
          <div 
            key={report.id} 
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-colors",
              isLight 
                ? "bg-white/40 border-gray-200/40 hover:bg-white/70" 
                : "bg-black/20 border-white/5 hover:bg-black/30"
            )}
          >
            <div className="flex items-center">
              <FileText className={isLight ? "text-gray-600" : "text-gray-400"} size={20} />
              <div className="ml-3">
                <h3 className="font-medium">{report.title}</h3>
                <p className={isLight ? "text-sm text-gray-600" : "text-sm text-gray-400"}>{formatDate(report.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-2.5 py-1 rounded-full ${getReportTypeClass(report.type)}`}>
                {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
              </span>
              
              <Button variant="ghost" size="sm" asChild>
                <a href={report.downloadUrl} download className="flex items-center">
                  <span className="mr-1">View</span>
                  <ChevronRight size={16} />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsSection;
