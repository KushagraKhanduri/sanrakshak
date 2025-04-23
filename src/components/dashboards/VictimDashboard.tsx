import React, { useMemo, useState, useEffect } from 'react';
import { Info, ArrowRight, Zap, AlertTriangle, Phone, MapPin, ShieldAlert, ChevronRight, Users, Activity, CloudRain, HeartPulse, Bell } from 'lucide-react';
import ResourceCard from '../ResourceCard';
import StatusUpdate from '../StatusUpdate';
import EmergencyContact from '../EmergencyContact';
import LocationFinder from '../LocationFinder';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';
import EmergencyContactsDialog from '../EmergencyContactsDialog';
import VictimRequestDialog from '../dialogs/VictimRequestDialog';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeProvider";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface VictimDashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
}

const VictimDashboard: React.FC<VictimDashboardProps> = ({ resourceData }) => {
  const { resources, responses, loading, addResource } = resourceData || useResourceData();
  const [user, setUser] = useState<any>(null);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const isLight = theme === 'light';
  const colors = {
    primary: isLight ? '#6366F1' : '#818CF8',
    secondary: isLight ? '#10B981' : '#34D399',
    danger: isLight ? '#EF4444' : '#F87171',
    warning: isLight ? '#F59E0B' : '#FBBF24',
    accent: isLight ? '#EC4899' : '#F472B6',
    background: isLight ? '#FFFFFF' : '#0F172A',
    card: isLight ? '#FFFFFF' : '#1E293B',
    text: isLight ? '#334155' : '#E2E8F0',
    border: isLight ? '#E2E8F0' : '#334155'
  };

  const assistanceData = {
    labels: ['Medical', 'Food', 'Shelter', 'Rescue'],
    datasets: [{
      data: [15, 32, 28, 12],
      backgroundColor: [
        colors.primary,
        colors.secondary,
        colors.accent,
        colors.warning
      ],
      borderRadius: 6
    }]
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const respondedRequestIds = useMemo(() => {
    if (!user?.id) return new Set<string>();
    
    const userResponses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
    return new Set(userResponses.map((response: any) => response.requestId));
  }, [user, responses]);
  
  const availableResources = useMemo(() => {
    return resources
      .filter(resource => resource.type === 'offer')
      .sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return b.timestamp - a.timestamp;
      })
      .slice(0, 4);
  }, [resources]);
  
  const myRequests = useMemo(() => {
    if (!user?.id) return [];
    
    return resources
      .filter(resource => 
        resource.type === 'need' && 
        resource.userId === user.id
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 2);
  }, [resources, user]);
  
  const handleRequestSubmit = (formData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a request",
      });
      return;
    }
    
    addResource({
      type: 'need',
      ...formData,
      userId: user.id,
      username: user.name || user.email || 'Anonymous'
    });
    
    setShowRequestDialog(false);
    toast({
      title: "Request Submitted",
      description: "Your request has been sent to the emergency response team",
    });
  };
  
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Emergency Alert - Glassmorphism design */}
        <div className="mb-8 rounded-2xl p-6 backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/20 dark:border-black/20 shadow-lg relative overflow-hidden hover:scale-105 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-30"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start">
              <div className="animate-pulse p-2 rounded-full bg-red-500/20 mr-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hurricane Warning - Category 3</h2>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  Evacuation orders in effect for coastal areas. Expected landfall in 12-14 hours.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/emergency-plan" 
                className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md"
              >
                <ShieldAlert size={16} className="mr-2" />
                Emergency Plan
              </Link>
              <Link 
                to="/shelter-map" 
                className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md"
              >
                <MapPin size={16} className="mr-2" />
                Shelter Map
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnimatedTransition className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg bg-gradient-to-br shadow-xl from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 border border-black/20 dark:border-black/20 backdrop-blur-sm" delay={100}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Available Resources</h2>
                <Link 
                  to="/resources" 
                  className="flex items-center text-sm font-medium px-3 py-1 rounded-full hover:bg-white/5 dark:hover:bg-black/10 transition-colors"
                  style={{ color: colors.text }}
                >
                  <span className="mr-1">View All</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative ">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-400/5 to-transparent blur-3xl -z-10"></div>
                
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div 
                      key={`loading-${index}`} 
                      className="h-64 rounded-xl animate-pulse bg-white/5 dark:bg-black/10"
                    ></div>
                  ))
                ) : availableResources.length > 0 ? (
                  availableResources.map(resource => (
                    <div 
                      key={resource.id} 
                      // className= "hover:shadow-md shadow-xl transition-all duration-300 rounded-2xl"
                      // className="shadow-xl rounded-2xl backdrop-blur-xl dark:hover:shadow-md transition-all duration-300 "
                      // className="rounded-xl p-4 bg-white/5 dark:bg-black/10 backdrop-blur-sm border-white/10 dark:border-black/10 shadow-lg hover:shadow-md transition-all duration-300"
                    >
                      <ResourceCard
                        type="offer"
                        category={resource.category}
                        title={resource.title}
                        description={resource.description}
                        location={resource.location}
                        locationDetails={resource.locationDetails}
                        contact={resource.contact}
                        contactName={resource.contactName}
                        urgent={resource.urgent}
                        requestId={resource.id}
                        isRequested={user?.id && user.role === 'victim' && respondedRequestIds.has(resource.id)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-6 rounded-xl text-center shadow-xl bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-black/10">
                    <p className="font-medium" style={{ color: colors.text }}>No resources available at the moment.</p>
                  </div>
                )}
              </div>
            </AnimatedTransition>
            
            {myRequests.length > 0 && (
              <AnimatedTransition className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg bg-gradient-to-br shadow-xl from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 border border-black/20 dark:border-black/20 backdrop-blur-sm" delay={150}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: colors.text }}>My Requests</h2>
                  <Link 
                    to="/victim-resources" 
                    className="flex items-center text-sm font-medium px-3 py-1 rounded-full hover:bg-white/5 dark:hover:bg-black/10 transition-colors"
                    style={{ color: colors.text }}
                  >
                    <span className="mr-1">View All</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRequests.map(resource => (
                    <div 
                      key={resource.id} 
                      // className= "hover:shadow-md shadow-xl transition-all duration-300 rounded-2xl hover:scale-105"
                      // className="shadow-xl rounded-2xl backdrop-blur-xl hover:shadow-md transition-all duration-300"
                      // className="rounded-xl p-4 bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-black/10 shadow-lg hover:shadow-md transition-all duration-300"
                    >
                      <ResourceCard
                        type="need"
                        category={resource.category}
                        title={resource.title}
                        description={resource.description}
                        location={resource.location}
                        contact={resource.contact}
                        urgent={resource.urgent}
                        requestId={resource.id}
                        isRequested={true}
                      />
                    </div>
                  ))}
                </div>
              </AnimatedTransition>
            )}
            
            <AnimatedTransition className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg bg-gradient-to-br shadow-xl from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 border border-black/20 dark:border-black/20 backdrop-blur-sm" delay={200}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Status Updates</h2>
                <Link 
                  to="/alerts" 
                  className="flex items-center text-sm font-medium px-3 py-1 rounded-full hover:bg-white/5 dark:hover:bg-black/10 transition-colors"
                  style={{ color: colors.text }}
                >
                  <span className="mr-1">View All</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="space-y-4 ">
                <StatusUpdate
                  id="status-1"
                  title="Power Restoration Progress"
                  message="Crews are working to restore power to the eastern district. Estimated completion: 24 hours."
                  source="City Power & Utilities"
                  timestamp="1 hour ago"
                  priority="high"
                  className="hover:shadow-xl light:bg-white/5 dark:bg-black/10"
                />
                
                <StatusUpdate
                  id="status-2"
                  title="Road Closure Update"
                  message="Main Street between 5th and 8th Ave remains flooded and closed to traffic. Use alternate routes."
                  source="Department of Transportation"
                  timestamp="3 hours ago"
                  priority="medium"
                  className="hover:shadow-xl light:bg-white/5 dark:bg-black/10"
                />
              </div>
            </AnimatedTransition>
          </div>
          
          <div className="space-y-6">
            <AnimatedTransition delay={150}>
              <div className= "">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Emergency Contacts</h2>
                  <button 
                    onClick={() => setShowAllContacts(true)}
                    className="flex items-center text-sm font-medium px-3 py-1 rounded-full hover:bg-white/5 dark:hover:bg-black/10 transition-colors"
                    style={{ color: colors.text }}
                  >
                    <span className="mr-1">View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
                
                <div className="space-y-4 px-2 py-4 ">
                  <EmergencyContact
                    name="Emergency Response"
                    role="Coordination Center"
                    phone="108"
                    contactId="emergency-1"
                    available={true}
                  />
                  
                  <EmergencyContact
                    name="Nearest Medical Center"
                    role="Medical Coordinator"
                    phone="123-456-7890"
                    contactId="medical-1"
                    available={true}
                  />
                </div>
              </div>
            </AnimatedTransition>
            
            {/* <AnimatedTransition delay={200}>
              <div className="rounded-2xl p-6 bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-black/20 dark:border-black/20 shadow-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-pink-100/50 dark:bg-pink-900/20 mr-3">
                    <HeartPulse className="text-pink-500 dark:text-pink-300" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.text }}>Assistance Requests</h3>
                </div>
                
                <div className="h-48 mb-4">
                  <Bar 
                    data={assistanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { 
                          grid: { display: false },
                          ticks: { color: colors.text }
                        },
                        y: { 
                          grid: { color: colors.border },
                          ticks: { color: colors.text }
                        }
                      },
                      animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                      }
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  {assistanceData.labels.map((label, i) => (
                    <div 
                      key={i} 
                      className="p-2 rounded-lg hover:bg-white/5 dark:hover:bg-black/10 transition-all duration-200"
                    >
                      <p className="text-sm mb-1" style={{ color: colors.text }}>{label}</p>
                      <p 
                        className="font-bold text-lg" 
                        style={{ color: assistanceData.datasets[0].backgroundColor[i] }}
                      >
                        {assistanceData.datasets[0].data[i]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedTransition> */}
            
            <AnimatedTransition delay={250} className="rounded-2xl overflow-hidden bg-gradient-to-br shadow-xl from-blue-500/5 to-purple-500/5 dark:bg-slate-700 dark:border-black/20 hover:shadow-md transition-all duration-300">
              <LocationFinder className="h-full" />
            </AnimatedTransition>
          </div>
        </div>
      </div>
      
      <EmergencyContactsDialog 
        open={showAllContacts} 
        onOpenChange={setShowAllContacts} 
      />
      
      <VictimRequestDialog
        isOpen={showRequestDialog}
        onClose={() => setShowRequestDialog(false)}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
};

export default VictimDashboard;