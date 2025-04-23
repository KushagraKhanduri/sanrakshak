
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AnimatedTransition from '../components/AnimatedTransition';
import ResourceCard from '../components/ResourceCard';
import { Plus, ArrowRight, Filter, UserCheck, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import RequestForm from '@/components/RequestForm';
import VictimRequestDialog from '@/components/dialogs/VictimRequestDialog';
import useResourceData from '@/hooks/useResourceData';

type ResourceRequest = {
  id: string;
  type: 'need' | 'offer';
  category: 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
  title: string;
  description: string;
  location: string;
  contact?: string;
  urgent?: boolean;
  userId: string;
  username: string;
  createdAt: number;
};

const Connect = () => {
  const { resources, addResource } = useResourceData();
  const [showForm, setShowForm] = useState(false);
  const [showVictimRequestDialog, setShowVictimRequestDialog] = useState(false);
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [actingMode, setActingMode] = useState<string>('');
  const [respondedRequestIds, setRespondedRequestIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = () => {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        const user = JSON.parse(authUser);
        setCurrentUser(user);
        setActingMode(user.role);
        
        const userResponses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
        const fastLookupResponses = JSON.parse(localStorage.getItem(`responded_requests_${user.id}`) || '[]');
        
        const combinedResponses = new Set([
          ...fastLookupResponses,
          ...userResponses.map((response: any) => response.requestId)
        ]);
        
        setRespondedRequestIds(combinedResponses);
      } else {
        setRespondedRequestIds(new Set());
      }
    };
    
    fetchUserData();
    
    const handleUpdate = () => {
      fetchUserData();
    };
    
    window.addEventListener('auth-changed', handleUpdate);
    window.addEventListener('response-created', handleUpdate);
    window.addEventListener('response-updated', handleUpdate);
    window.addEventListener('resource-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('auth-changed', handleUpdate);
      window.removeEventListener('response-created', handleUpdate);
      window.removeEventListener('response-updated', handleUpdate);
      window.removeEventListener('resource-updated', handleUpdate);
    };
  }, []);
  
  const isVolunteer = currentUser?.role === 'volunteer' || currentUser?.role === 'ngo' || currentUser?.role === 'government';
  
  const handleAddRequest = (newRequest: any) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit requests",
      });
      navigate('/login');
      return;
    }
    
    if (isVolunteer) {
      newRequest.type = 'offer';
    }
    
    if (newRequest.type === 'need' && currentUser.role !== 'victim') {
      toast({
        title: "Action Not Available",
        description: "Only those affected by disaster can request resources",
      });
      return;
    }
    
    if (newRequest.type === 'offer' && currentUser.role === 'victim' && !currentUser.canVolunteer) {
      toast({
        title: "Action Not Available",
        description: "You cannot offer resources with your current role",
      });
      return;
    }
    
    const addedResource = addResource({
      ...newRequest,
      userId: currentUser.id,
      username: currentUser.name
    });
    
    toast({
      title: "Request Submitted",
      description: `Your ${newRequest.type === 'need' ? 'need' : 'offer'} has been posted successfully.`,
    });
    
    setShowForm(false);
  };
  
  const handleVictimRequestSubmit = (formData: any) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit requests",
      });
      navigate('/login');
      return;
    }
    
    addResource({
      type: 'need',
      ...formData,
      userId: currentUser.id,
      username: currentUser.name
    });
    
    toast({
      title: "Request Submitted",
      description: "Your need has been posted successfully.",
    });
    
    setShowVictimRequestDialog(false);
  };
  
  const handleToggleMode = () => {
    if (!currentUser || !currentUser.canVolunteer) return;
    
    const newMode = actingMode === 'victim' ? 'volunteer' : 'victim';
    setActingMode(newMode);
    
    const updatedUser = { ...currentUser, role: newMode };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    
    toast({
      title: "Mode Switched",
      description: `You are now acting as a ${newMode}`,
    });
    
    navigate('/dashboard');
  };
  
  const filteredRequests = filter === 'all' 
    ? resources 
    : filter === 'my' 
      ? resources.filter(req => req.userId === currentUser?.id)
      : resources.filter(req => req.type === filter);
      
  const getButtonText = () => {
    if (!currentUser) return "New Request";
    
    if (currentUser.role === 'victim') return "New Request";
    
    return "Offer Resources";
  };
  
  const handleNewRequestClick = () => {
    if (currentUser?.role === 'victim') {
      setShowVictimRequestDialog(true);
    } else {
      setShowForm(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Connect</h1>
              <p className="text-gray-400 mt-1">
                {isVolunteer ? "Offer resources to those in need" : "Request or offer resources"}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser?.canVolunteer && (
                <button 
                  onClick={handleToggleMode}
                  className="flex items-center text-sm bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/10 transition-colors"
                >
                  {actingMode === 'victim' ? (
                    <>
                      <UserCheck size={16} className="mr-1.5" />
                      <span>Switch to Volunteer</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="mr-1.5" />
                      <span>Switch to Victim</span>
                    </>
                  )}
                </button>
              )}
              
              {!showForm && (
                <button 
                  onClick={handleNewRequestClick}
                  className="flex items-center px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
                >
                  <Plus size={18} className="mr-1" />
                  <span>{getButtonText()}</span>
                </button>
              )}
            </div>
          </div>
          
          {showForm && (
            <AnimatedTransition className="mb-8">
              <RequestForm 
                onSubmit={handleAddRequest} 
                onCancel={() => setShowForm(false)} 
                userRole={currentUser?.role}
              />
            </AnimatedTransition>
          )}
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  filter === 'all' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                All Requests
              </button>
              <button 
                onClick={() => setFilter('need')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  filter === 'need' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                Needs
              </button>
              <button 
                onClick={() => setFilter('offer')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  filter === 'offer' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                Offers
              </button>
              {currentUser && (
                <button 
                  onClick={() => setFilter('my')}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    filter === 'my' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  My Requests
                </button>
              )}
              <button 
                className="p-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="Filter options"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <AnimatedTransition>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <ResourceCard
                    key={request.id}
                    type={request.type}
                    category={request.category}
                    title={request.title}
                    description={request.description}
                    location={request.location}
                    contact={request.contact}
                    urgent={request.urgent}
                    requestId={request.id}
                    isRequested={currentUser?.id && respondedRequestIds.has(request.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-400 mb-4">No requests found. Be the first to add one!</p>
                  <button 
                    onClick={handleNewRequestClick}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                  >
                    {getButtonText()}
                  </button>
                </div>
              )}
            </div>
          </AnimatedTransition>
          
          {filteredRequests.length > 6 && (
            <div className="mt-8 text-center">
              <button className="flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors mx-auto">
                <span className="mr-1">Load More</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t border-white/5 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-sm text-gray-400">
                Relief Connect • Emergency Response System
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <span className="text-xs text-gray-500">
                This system is for emergency use • Always follow official guidance
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Victim Request Dialog */}
      <VictimRequestDialog 
        isOpen={showVictimRequestDialog}
        onClose={() => setShowVictimRequestDialog(false)}
        onSubmit={handleVictimRequestSubmit}
      />
    </div>
  );
};

export default Connect;
