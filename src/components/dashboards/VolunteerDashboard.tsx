import React, { useMemo, useEffect } from 'react';
import { Users, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import ResourceCard from '../ResourceCard';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';
import { useTheme } from '@/context/ThemeProvider';

interface VolunteerDashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ resourceData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // Use passed resourceData or create a new instance
  const { resources, responses, loading, cleanupInvalidResponses } = resourceData || useResourceData();
  
  // Clean up any invalid responses when the component mounts
  useEffect(() => {
    if (!loading && cleanupInvalidResponses) {
      cleanupInvalidResponses();
    }
  }, [loading, cleanupInvalidResponses]);
  
  // Filter resources to only show needs (that volunteers can help with)
  const needsResources = useMemo(() => {
    // Get current user to check responses
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    
    // Get IDs of requests the user has already responded to
    const respondedRequestIds = new Set(
      responses
        .filter(r => r.type === 'offer')
        .map(response => response.requestId)
    );
    
    return resources
      .filter(resource => 
        // Only show needs (not offers) that haven't been responded to by this user
        resource.type === 'need' && 
        !respondedRequestIds.has(resource.id)
      )
      .sort((a, b) => {
        // Sort by urgent first, then by timestamp (newest first)
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return b.timestamp - a.timestamp;
      })
      .slice(0, 4); // Only show the top 4
  }, [resources, responses]);
  
  // Get active responses for the current user
  const activeResponses = useMemo(() => {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (!currentUser.id) return [];
    
    // Get responses for this user
    const userResponses = responses.filter(response => 
      response.type === 'offer' && 
      ['pending', 'accepted'].includes(response.status)
    );
    
    // Only include responses that have a matching resource
    const validResponses = userResponses.filter(response => 
      resources.some(resource => resource.id === response.requestId)
    );
    
    return validResponses.slice(0, 2); // Only show the top 2
  }, [responses, resources]);

  // Add an effect to ensure real-time updates 
  useEffect(() => {
    const handleResourceUpdate = () => {
      // This will trigger a refresh with the latest data
      console.log('Resource update detected in VolunteerDashboard');
    };
    
    window.addEventListener('resource-created', handleResourceUpdate);
    window.addEventListener('resource-updated', handleResourceUpdate);
    window.addEventListener('response-created', handleResourceUpdate);
    window.addEventListener('response-updated', handleResourceUpdate);
    
    return () => {
      window.removeEventListener('resource-created', handleResourceUpdate);
      window.removeEventListener('resource-updated', handleResourceUpdate);
      window.removeEventListener('response-created', handleResourceUpdate);
      window.removeEventListener('response-updated', handleResourceUpdate);
    };
  }, []);

  // Generate task IDs in the correct format for navigation
  const getTaskIdForResponse = (responseId: string) => {
    return `task-${responseId}`;
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className={`relative overflow-hidden hover:scale-105 transition-all duration-300 ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'glass-light'} rounded-xl border p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Users size={18} className="mr-2" />
                  <h2 className="text-xl font-semibold">Volunteer Dashboard</h2>
                </div>
                <p className={`${isLight ? 'text-gray-600' : 'text-gray-300'} text-sm mb-3`}>
                  Thank you for volunteering. Your assistance is making a real difference in people's lives during this emergency.
                </p>
                <div className={`flex items-center text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Clock size={12} className="mr-1" />
                  <span>Last updated: just now</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/resources" className={`px-4 py-2 rounded-full text-sm ${isLight ? 'bg-black text-white hover:bg-black/90' : 'bg-white text-black hover:bg-white/90'} transition-colors`}>
                  Help Requests
                </Link>
                <Link to="/volunteer-tasks" className={`px-4 py-2 rounded-full text-sm ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/10 hover:bg-white/15 text-white'} transition-colors`}>
                  My Tasks
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
              <h2 className="text-xl font-semibold">Assistance Needed</h2>
              <Link to="/resources" className={`flex items-center text-sm ${isLight ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white'} transition-colors`}>
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                // Show loading states
                Array(4).fill(0).map((_, index) => (
                  <div key={`loading-${index}`} className={`animate-pulse rounded-xl p-6 ${isLight ? 'bg-gray-100' : 'bg-white/5'} h-64`}></div>
                ))
              ) : needsResources.length > 0 ? (
                // Show resources that need help
                needsResources.map(resource => (
                  <div key={resource.id} className={`rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_10px_0_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_0_rgba(0,0,0,0.6)]`}>
                    <ResourceCard
                      type="need"
                      category={resource.category}
                      title={resource.title}
                      description={resource.description}
                      location={resource.location}
                      contact={resource.contact}
                      urgent={resource.urgent}
                      requestId={resource.id}
                      isRequested={false} // Already filtering out responded items
                    />
                  </div>
                ))
              ) : (
                // No resources available
                <div className={`col-span-2 p-6 border ${isLight ? 'border-gray-200' : 'border-white/10'} rounded-xl text-center`}>
                  <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>No assistance requests at the moment.</p>
                </div>
              )}
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Active Responses</h2>
              <Link to="/volunteer-tasks" className={`flex items-center text-sm ${isLight ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white'} transition-colors`}>
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {activeResponses.length > 0 ? (
                activeResponses.map(response => (
                  <div key={response.id} className={`p-4 border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-black/10'} rounded-xl`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <CheckCircle size={16} className={`mr-2 ${isLight ? 'text-gray-600' : 'text-white/70'}`} />
                          <h3 className="font-medium">{response.title}</h3>
                        </div>
                        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Helping with {response.category} resources</p>
                      </div>
                      <span className={`text-xs ${isLight ? 'bg-gray-200 text-gray-800' : 'bg-white/10 text-white'} px-2 py-0.5 rounded-full`}>
                        {response.status === 'pending' ? 'In Progress' : response.status}
                      </span>
                    </div>
                    <div className={`mt-3 pt-3 border-t ${isLight ? 'border-gray-200' : 'border-white/5'} flex justify-between items-center`}>
                      <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(response.time).toLocaleString()}
                      </span>
                      <Link 
                        to={`/volunteer-tasks/${getTaskIdForResponse(response.id)}`} 
                        className={`text-xs ${isLight ? 'text-black bg-gray-200 hover:bg-gray-300' : 'text-white bg-white/10 hover:bg-white/15'} px-2 py-1 rounded transition-colors`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-4 border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-black/30'} rounded-xl text-center`}>
                  <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>You haven't responded to any requests yet.</p>
                  <Link to="/resources" className={`inline-block mt-2 text-sm ${isLight ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-white/10 hover:bg-white/15 text-white'} px-3 py-1 rounded`}>
                    Find people to help
                  </Link>
                </div>
              )}
            </div>
          </AnimatedTransition>
        </div>
        
        <div>
          <AnimatedTransition className="mb-6" delay={150}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Status Updates</h2>
              <Link to="/alerts" className={`flex items-center text-sm ${isLight ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white'} transition-colors`}>
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <StatusUpdate
                id="status-1"
                title="Power Restoration Progress"
                message="Crews are working to restore power to the eastern district. Estimated completion: 24 hours."
                source="City Power & Utilities"
                timestamp="1 hour ago"
                priority="high"
              />
              
              <StatusUpdate
                id="status-2"
                title="Road Closure Update"
                message="Main Street between 5th and 8th Ave remains flooded and closed to traffic. Use alternate routes."
                source="Department of Transportation"
                timestamp="3 hours ago"
                priority="medium"
              />
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={250}>
            <div className={`${isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/10 border-white/20'} border rounded-xl p-5`}>
              <h2 className="text-xl font-semibold mb-4">Volunteer Activity</h2>
              <div className="space-y-3">
                <div className={`flex items-center justify-between text-sm ${isLight ? 'text-gray-700' : 'text-white'}`}>
                  <span>Hours volunteered:</span>
                  <span className="font-medium">12 hours</span>
                </div>
                <div className={`flex items-center justify-between text-sm ${isLight ? 'text-gray-700' : 'text-white'}`}>
                  <span>People helped:</span>
                  <span className="font-medium">27</span>
                </div>
                <div className={`flex items-center justify-between text-sm ${isLight ? 'text-gray-700' : 'text-white'}`}>
                  <span>Tasks completed:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className={`flex items-center justify-between text-sm ${isLight ? 'text-gray-700' : 'text-white'}`}>
                  <span>Active tasks:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className={`mt-4 pt-4 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                  <Link to="/volunteer-stats" className={`text-sm ${isLight ? 'text-black' : 'text-white'} flex items-center justify-center hover:underline`}>
                    <span>View detailed statistics</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
