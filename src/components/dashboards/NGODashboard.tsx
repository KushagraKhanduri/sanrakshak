import React, { useMemo, useState, useEffect } from 'react';
import { Building, ArrowRight, PieChart, Users, Map, Plus } from 'lucide-react';
import ResourceCard from '../ResourceCard';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ResourceDetailsDialog from '../dialogs/ResourceDetailsDialog';
import AddResourceDialog from '../dialogs/AddResourceDialog';
import ResourceManagementDialog from '../ResourceManagementDialog';
import HelpRequestsDialog from '../dialogs/HelpRequestsDialog';
import { useTheme } from '@/context/ThemeProvider';

interface NGODashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
}

const NGODashboard: React.FC<NGODashboardProps> = ({ resourceData }) => {
  const { resources, loading, addResource } = resourceData || useResourceData();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [isManageResourcesDialogOpen, setIsManageResourcesDialogOpen] = useState(false);
  const [isHelpRequestsDialogOpen, setIsHelpRequestsDialogOpen] = useState(false);
  
  const selectedResource = useMemo(() => {
    if (!selectedResourceId) return null;
    return resources.find(resource => resource.id === selectedResourceId);
  }, [selectedResourceId, resources]);
  
  const urgentNeeds = useMemo(() => {
    return resources
      .filter(resource => resource.type === 'need' && resource.urgent)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 2);
  }, [resources]);
  
  const managedResources = useMemo(() => {
    return resources
      .filter(resource => resource.type === 'offer')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);
  }, [resources]);
  
  const resourceDistribution = useMemo(() => {
    const distribution: Record<string, { count: number, percentage: number }> = {
      water: { count: 0, percentage: 0 },
      food: { count: 0, percentage: 0 },
      medical: { count: 0, percentage: 0 },
      shelter: { count: 0, percentage: 0 },
      supplies: { count: 0, percentage: 0 },
      safety: { count: 0, percentage: 0 }
    };
    
    resources.forEach(resource => {
      if (distribution[resource.category]) {
        distribution[resource.category].count++;
      }
    });
    
    const totalResources = resources.length;
    if (totalResources > 0) {
      Object.keys(distribution).forEach(key => {
        distribution[key].percentage = Math.round((distribution[key].count / totalResources) * 100);
      });
    }
    
    return Object.entries(distribution)
      .sort(([,a], [,b]) => b.percentage - a.percentage)
      .slice(0, 4);
  }, [resources]);
  
  const handleViewDetails = (id: string) => {
    setSelectedResourceId(id);
    setIsDetailsDialogOpen(true);
  };
  
  const handleAddResource = () => {
    setIsAddResourceDialogOpen(true);
  };
  
  const handleOpenManageResources = () => {
    setIsManageResourcesDialogOpen(true);
  };

  const handleViewAllHelpRequests = () => {
    setIsHelpRequestsDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 shadow-xl rounded-2xl">
        <AnimatedTransition>
          <div className={`relative overflow-hidden rounded-xl border hover:scale-105 transition-all duration-300 ${isLight ? 'border-gray-200 bg-white shadow-xl' : 'border-white/10 glass-dark'} p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Building size={18} className={`mr-2 ${isLight ? 'text-gray-800' : 'text-white'}`} />
                  <h2 className="text-xl font-semibold">NGO Operations</h2>
                </div>
                <p className={`${isLight ? 'text-gray-600' : 'text-gray-300'} text-sm mb-3`}>
                  Coordinate disaster response efforts, manage resources, and track impact across affected areas.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleOpenManageResources}
                  className={`px-4 py-2 rounded-full text-sm ${isLight ? 'bg-black text-white hover:bg-black/90' : 'bg-white text-black hover:bg-white/90'} transition-colors`}
                >
                  Manage Resources
                </button>
                <Link to="/reports" className={`px-4 py-2 rounded-full text-sm ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/10 hover:bg-white/15 text-white'} transition-colors`}>
                  View Reports
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatedTransition className="mb-6" delay={100}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Resource Management</h2>
              <button 
                onClick={handleOpenManageResources}
                className={`flex items-center text-sm ${isLight ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'} transition-colors`}
              >
                <span className="mr-1">Manage All</span>
                <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {loading ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={`loading-${index}`} className={`animate-pulse rounded-xl p-6 ${isLight ? 'bg-gray-100' : 'bg-white/5'} h-64`}></div>
                ))
              ) : managedResources.length > 0 ? (
                managedResources.map(resource => (
                  <div key={resource.id} className={`p-5 drop-shadow-xl rounded-xl hover:scale-105 transition-all duration-300 ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{resource.title}</h3>
                      <span className={`text-xs ${isLight ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'} px-2 py-0.5 rounded-full capitalize`}>{resource.category}</span>
                    </div>
                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-3`}>
                      {resource.description.length > 80 
                        ? `${resource.description.substring(0, 80)}...` 
                        : resource.description}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(resource.timestamp).toLocaleString()}
                      </span>
                      <button 
                        onClick={() => handleViewDetails(resource.id)}
                        className={`${isLight ? 'text-black hover:underline' : 'text-white hover:underline'} flex items-center`}
                      >
                        <span>Details</span>
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className={`p-5 border rounded-xl ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">Water Supplies</h3>
                      <span className={`text-xs ${isLight ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'} px-2 py-0.5 rounded-full`}>Available</span>
                    </div>
                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-3`}>5,000 bottles ready for distribution</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Updated 30 minutes ago</span>
                      <button 
                        onClick={() => handleViewDetails('water-supplies')}
                        className={`${isLight ? 'text-black hover:underline' : 'text-white hover:underline'} flex items-center`}
                      >
                        <span>Details</span>
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`p-5 border rounded-xl ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">Food Supplies</h3>
                      <span className={`text-xs ${isLight ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'} px-2 py-0.5 rounded-full`}>Low Stock</span>
                    </div>
                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-3`}>120 meal kits remaining (Critical level)</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Updated 45 minutes ago</span>
                      <button 
                        onClick={() => handleViewDetails('food-supplies')}
                        className={`${isLight ? 'text-black hover:underline' : 'text-white hover:underline'} flex items-center`}
                      >
                        <span>Details</span>
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`p-5 border rounded-xl ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">Medical Supplies</h3>
                      <span className={`text-xs ${isLight ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'} px-2 py-0.5 rounded-full`}>Available</span>
                    </div>
                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-3`}>First aid kits, medications, and basic medical equipment</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Updated 2 hours ago</span>
                      <button 
                        onClick={() => handleViewDetails('medical-supplies')}
                        className={`${isLight ? 'text-black hover:underline' : 'text-white hover:underline'} flex items-center`}
                      >
                        <span>Details</span>
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`p-5 border rounded-xl ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">Shelter Capacity</h3>
                      <span className={`text-xs ${isLight ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'} px-2 py-0.5 rounded-full`}>65% Full</span>
                    </div>
                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-3`}>3 shelter locations with capacity for 150 more people</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Updated 1 hour ago</span>
                      <button 
                        onClick={() => handleViewDetails('shelter-capacity')}
                        className={`${isLight ? 'text-black hover:underline' : 'text-white hover:underline'} flex items-center`}
                      >
                        <span>Details</span>
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={handleAddResource}
                className={`inline-flex items-center px-4 py-2 ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/10 hover:bg-white/15 text-white'} rounded-lg transition-colors cursor-pointer`}
              >
                <Plus size={16} className="mr-1" />
                <span>Add New Resource</span>
              </button>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Help Requests</h2>
              <button 
                onClick={handleViewAllHelpRequests}
                className={`flex items-center text-sm ${isLight ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'} transition-colors`}
              >
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                Array(2).fill(0).map((_, index) => (
                  <div key={`loading-${index}`} className={`animate-pulse rounded-xl p-6 ${isLight ? 'bg-gray-100' : 'bg-white/5'} h-64`}></div>
                ))
              ) : urgentNeeds.length > 0 ? (
                urgentNeeds.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    type="need"
                    category={resource.category}
                    title={resource.title}
                    description={resource.description}
                    location={resource.location}
                    contact={resource.contact}
                    urgent={resource.urgent}
                    requestId={resource.id}
                  />
                ))
              ) : (
                <div className={`p-6 border rounded-xl text-center ${isLight ? 'border-gray-200 bg-white' : 'border-white/10'}`}>
                  <p className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>No urgent help requests at the moment.</p>
                </div>
              )}
            </div>
          </AnimatedTransition>
        </div>
        
        <div>
          <AnimatedTransition className="mb-6" delay={150}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Impact Dashboard</h2>
              <Link to="/reports" className={`flex items-center text-sm ${isLight ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'} transition-colors`}>
                <span className="mr-1">Full Report</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className={`p-4 border rounded-xl drop-shadow-xl hover:scale-105 transition-all duration-300 ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                <div className="flex items-center mb-3">
                  <Users size={16} className="mr-2" />
                  <h3 className="font-medium">People Assisted</h3>
                </div>
                <div className="text-3xl font-bold mb-2">1,247</div>
                <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Increase of 215 from yesterday</div>
              </div>
              
              <div className={`p-4 border rounded-xl drop-shadow-xl hover:scale-105 transition-all duration-300 ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                <div className="flex items-center mb-3">
                  <Map size={16} className="mr-2" />
                  <h3 className="font-medium">Areas Covered</h3>
                </div>
                <div className="text-3xl font-bold mb-2">8</div>
                <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>2 new areas since yesterday</div>
              </div>
              
              <div className={`p-4 border rounded-xl drop-shadow-xl hover:scale-105 transition-all duration-300 ${isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-black/30'}`}>
                <div className="flex items-center mb-3">
                  <PieChart size={16} className="mr-2" />
                  <h3 className="font-medium">Resource Distribution</h3>
                </div>
                <div className="mt-3 space-y-2">
                  {resourceDistribution.map(([category, data]) => (
                    <div key={category}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <span>{data.percentage}%</span>
                      </div>
                      <div className={`h-1.5 ${isLight ? 'bg-gray-100' : 'bg-white/10'} rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${isLight ? 'bg-black' : 'bg-white'} rounded-full`} 
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={250}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Status Updates</h2>
              <Link to="/alerts" className={`flex items-center text-sm ${isLight ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'} transition-colors`}>
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <StatusUpdate
              id="status-1"
              title="Power Restoration Progress"
              message="Crews are working to restore power to the eastern district. Estimated completion: 24 hours."
              source="City Power & Utilities"
              timestamp="1 hour ago"
              priority="high"
            />
          </AnimatedTransition>
        </div>
      </div>
      
      <ResourceDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        resourceId={selectedResourceId}
        resources={resources}
      />
      
      <AddResourceDialog
        isOpen={isAddResourceDialogOpen}
        onClose={() => setIsAddResourceDialogOpen(false)}
        onAddResource={addResource}
      />
      
      <ResourceManagementDialog
        open={isManageResourcesDialogOpen}
        onOpenChange={setIsManageResourcesDialogOpen}
      />

      <HelpRequestsDialog
        isOpen={isHelpRequestsDialogOpen}
        onClose={() => setIsHelpRequestsDialogOpen(false)}
        resources={resources}
      />
    </div>
  );
};

export default NGODashboard;
