import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search, 
  RefreshCw,
  AlertCircle,
  LogOut,
  User,
} from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { Button } from '@/components/ui/button';
import ReportsSection from '@/components/ReportsSection';
import useResourceData, { Resource, ResourceResponse } from '@/hooks/useResourceData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showReports, setShowReports] = useState(false);
  const [responseData, setResponseData] = useState<ResourceResponse[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const resourceDataHook = useResourceData();

  // Use the existing fetchResources function
  const fetchResources = () => {
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
      const parsedResources = JSON.parse(storedResources).map((res: any) => ({
        ...res,
        status: res.status || 'pending'
      }));
      setResources(parsedResources);
    } else {
      const sampleResources: Resource[] = [
        {
          id: '1',
          type: 'need',
          category: 'water',
          title: 'Clean Water Needed',
          description: 'Family of 4 needs clean drinking water. We have been without for 2 days.',
          location: 'North District, Block C',
          urgent: true,
          timestamp: Date.now() - 3600000,
          status: 'addressing',
          assignedTo: 'Water Relief Team'
        },
        {
          id: '2',
          type: 'need',
          category: 'food',
          title: 'Food for children',
          description: 'Need food supplies for 3 children under 10.',
          location: 'East Village, House 45',
          urgent: true,
          timestamp: Date.now() - 7200000,
          status: 'pending'
        },
        {
          id: '3',
          type: 'need',
          category: 'medical',
          title: 'Insulin Required',
          description: 'Diabetic patient needs insulin. Current supply will last only 24 hours.',
          location: 'South Side Apartments, Building 3',
          contact: '555-0187',
          urgent: true,
          timestamp: Date.now() - 1800000,
          status: 'resolved',
          assignedTo: 'Medical Team Alpha'
        }
      ];
      
      setResources(sampleResources);
      localStorage.setItem('resources', JSON.stringify(sampleResources));
    }
  };

  // Use the existing fetchResponses function
  const fetchResponses = () => {
    // Get all responses from localStorage
    const allResponses: ResourceResponse[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('responses_')) {
        try {
          const userResponses = JSON.parse(localStorage.getItem(key) || '[]');
          allResponses.push(...userResponses);
        } catch (error) {
          console.error(`Error parsing responses from ${key}:`, error);
        }
      }
    }
    
    setResponseData(allResponses);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.role === 'admin') {
        setUser(parsedUser);
      } else {
        toast({
          title: "Access Denied",
          description: "You need administrator privileges to access this page",
        });
        navigate('/dashboard', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }

    fetchResources();
    fetchResponses();
    
    setIsLoading(false);

    const handleResourceUpdate = () => {
      fetchResources();
      fetchResponses();
    };

    window.addEventListener('response-created', handleResourceUpdate);
    window.addEventListener('response-updated', handleResourceUpdate);
    window.addEventListener('resource-updated', handleResourceUpdate);
    window.addEventListener('resource-created', handleResourceUpdate);

    return () => {
      window.removeEventListener('response-created', handleResourceUpdate);
      window.removeEventListener('response-updated', handleResourceUpdate);
      window.removeEventListener('resource-updated', handleResourceUpdate);
      window.removeEventListener('resource-created', handleResourceUpdate);
    };
  }, [navigate, toast]);

  useEffect(() => {
    let result = [...resources];
    
    if (statusFilter !== 'all') {
      result = result.filter(resource => resource.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(resource => resource.category === categoryFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query) ||
        resource.location.toLowerCase().includes(query)
      );
    }
    
    result.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return b.timestamp - a.timestamp;
    });
    
    setFilteredResources(result);
  }, [resources, statusFilter, categoryFilter, searchQuery]);

  const updateResourceStatus = (id: string, newStatus: 'pending' | 'addressing' | 'resolved', assignedTo?: string) => {
    const updatedResources = resources.map(resource => {
      if (resource.id === id) {
        return { 
          ...resource, 
          status: newStatus,
          assignedTo: assignedTo || resource.assignedTo
        };
      }
      return resource;
    });
    
    setResources(updatedResources);
    localStorage.setItem('resources', JSON.stringify(updatedResources));
    
    toast({
      title: "Status Updated",
      description: `Request has been marked as ${newStatus}`,
    });

    window.dispatchEvent(new Event('resource-updated'));
  };

  const handleAssignRequest = (id: string) => {
    const assignedTo = prompt("Enter the name of the team or person to assign this request to:");
    if (assignedTo) {
      updateResourceStatus(id, 'addressing', assignedTo);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'water': return 'Water';
      case 'shelter': return 'Shelter';
      case 'food': return 'Food';
      case 'supplies': return 'Supplies';
      case 'medical': return 'Medical';
      case 'safety': return 'Safety';
      default: return category;
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      fetchResources();
      fetchResponses();
      setIsLoading(false);
      
      toast({
        title: "Data Refreshed",
        description: "Latest requests have been loaded",
      });
    }, 800);
  };

  const getRequestCounts = () => {
    const pending = resources.filter(r => r.status === 'pending').length;
    const addressing = resources.filter(r => r.status === 'addressing').length;
    const resolved = resources.filter(r => r.status === 'resolved').length;
    
    return { pending, addressing, resolved, total: resources.length };
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    
    window.dispatchEvent(new Event('auth-state-changed'));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Logged Out",
      description: "You have been signed out successfully",
    });
    
    navigate('/', { replace: true });
  };

  const counts = getRequestCounts();

  const getResourceResponder = (resourceId: string) => {
    const response = responseData.find(r => r.requestId === resourceId);
    if (response) {
      return response.responderName || 'User';
    }
    return null;
  };

  const getResourceResponderRole = (resourceId: string) => {
    const response = responseData.find(r => r.requestId === resourceId);
    if (response) {
      return response.responderRole || 'volunteer';
    }
    return null;
  };

  const hasResourceBeenResponded = (resourceId: string) => {
    return responseData.some(r => r.requestId === resourceId);
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-white' : 'bg-black'}`}>
      <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 backdrop-blur-xl ${isLight ? 'bg-white/50' : 'bg-black/50'}`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-bold text-xl">Sanrakshak Admin</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center">
                  <span className={`mr-4 text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                    Logged in as <span className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>{user.email}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-300 py-1.5 px-3 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Administrator Dashboard</h1>
              <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Manage and coordinate emergency response efforts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className={`${isLight ? 'bg-white border-gray-200 shadow-sm' : 'glass-dark'} rounded-xl p-4 flex flex-col`}>
                <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Pending Requests</div>
                <div className="flex items-center">
                  <Clock className="text-yellow-500 mr-2" size={20} />
                  <span className="text-2xl font-bold">{counts.pending}</span>
                </div>
              </div>
              
              <div className={`${isLight ? 'bg-white border-gray-200 shadow-sm' : 'glass-dark'} rounded-xl p-4 flex flex-col`}>
                <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Being Addressed</div>
                <div className="flex items-center">
                  <FileCheck className="text-blue-500 mr-2" size={20} />
                  <span className="text-2xl font-bold">{counts.addressing}</span>
                </div>
              </div>
              
              <div className={`${isLight ? 'bg-white border-gray-200 shadow-sm' : 'glass-dark'} rounded-xl p-4 flex flex-col`}>
                <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Resolved</div>
                <div className="flex items-center">
                  <CheckCircle2 className="text-green-500 mr-2" size={20} />
                  <span className="text-2xl font-bold">{counts.resolved}</span>
                </div>
              </div>
              
              <div className={`${isLight ? 'bg-white border-gray-200 shadow-sm' : 'glass-dark'} rounded-xl p-4 flex flex-col`}>
                <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Total Requests</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{counts.total}</span>
                </div>
              </div>
            </div>
            
            <div className={`${isLight ? 'bg-white border-gray-200 shadow-sm' : 'glass-dark'} rounded-xl p-6 mb-6`}>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Resource Requests</h2>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isLight ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-9 pr-4 py-2 ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-white/10'} border rounded-lg focus:ring-1 ${isLight ? 'focus:ring-gray-300' : 'focus:ring-white/30'} focus:outline-none w-full md:w-60`}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`} />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={`${isLight ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-white/10'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${isLight ? 'focus:ring-gray-300' : 'focus:ring-white/20'}`}
                    >
                      <option value="all">All Categories</option>
                      <option value="water">Water</option>
                      <option value="shelter">Shelter</option>
                      <option value="food">Food</option>
                      <option value="supplies">Supplies</option>
                      <option value="medical">Medical</option>
                      <option value="safety">Safety</option>
                    </select>
                  </div>
                  
                  <Button
                    onClick={refreshData}
                    variant="outline"
                    className={`flex items-center space-x-2 ${isLight ? 'bg-gray-100 hover:bg-gray-200 border-gray-200' : 'bg-white/10 hover:bg-white/20 border-white/10'} transition-colors`}
                  >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    <span>Refresh</span>
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
                    All Requests
                  </TabsTrigger>
                  <TabsTrigger value="pending" onClick={() => setStatusFilter('pending')}>
                    <Clock size={14} className="mr-1" />
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="addressing" onClick={() => setStatusFilter('addressing')}>
                    <FileCheck size={14} className="mr-1" />
                    Addressing
                  </TabsTrigger>
                  <TabsTrigger value="resolved" onClick={() => setStatusFilter('resolved')}>
                    <CheckCircle2 size={14} className="mr-1" />
                    Resolved
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <RequestsTable 
                    resources={filteredResources} 
                    onAssign={handleAssignRequest}
                    onStatusChange={updateResourceStatus}
                    getCategoryLabel={getCategoryLabel}
                    hasResourceBeenResponded={hasResourceBeenResponded}
                    getResourceResponder={getResourceResponder}
                    getResourceResponderRole={getResourceResponderRole}
                    isLight={isLight}
                  />
                </TabsContent>
                
                <TabsContent value="pending" className="mt-0">
                  <RequestsTable 
                    resources={filteredResources.filter(r => r.status === 'pending')} 
                    onAssign={handleAssignRequest}
                    onStatusChange={updateResourceStatus}
                    getCategoryLabel={getCategoryLabel}
                    hasResourceBeenResponded={hasResourceBeenResponded}
                    getResourceResponder={getResourceResponder}
                    getResourceResponderRole={getResourceResponderRole}
                    isLight={isLight}
                  />
                </TabsContent>
                
                <TabsContent value="addressing" className="mt-0">
                  <RequestsTable 
                    resources={filteredResources.filter(r => r.status === 'addressing')} 
                    onAssign={handleAssignRequest}
                    onStatusChange={updateResourceStatus}
                    getCategoryLabel={getCategoryLabel}
                    hasResourceBeenResponded={hasResourceBeenResponded}
                    getResourceResponder={getResourceResponder}
                    getResourceResponderRole={getResourceResponderRole}
                    isLight={isLight}
                  />
                </TabsContent>
                
                <TabsContent value="resolved" className="mt-0">
                  <RequestsTable 
                    resources={filteredResources.filter(r => r.status === 'resolved')} 
                    onAssign={handleAssignRequest}
                    onStatusChange={updateResourceStatus}
                    getCategoryLabel={getCategoryLabel}
                    hasResourceBeenResponded={hasResourceBeenResponded}
                    getResourceResponder={getResourceResponder}
                    getResourceResponderRole={getResourceResponderRole}
                    isLight={isLight}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {showReports && (
              <ReportsSection />
            )}
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

interface RequestsTableProps {
  resources: Resource[];
  onAssign: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'addressing' | 'resolved', assignedTo?: string) => void;
  getCategoryLabel: (category: string) => string;
  hasResourceBeenResponded: (resourceId: string) => boolean;
  getResourceResponder: (resourceId: string) => string | null;
  getResourceResponderRole: (resourceId: string) => string | null;
  isLight: boolean;
}

const RequestsTable: React.FC<RequestsTableProps> = ({ 
  resources, 
  onAssign,
  onStatusChange,
  getCategoryLabel,
  hasResourceBeenResponded,
  getResourceResponder,
  getResourceResponderRole,
  isLight
}) => {
  
  if (resources.length === 0) {
    return (
      <div className={`text-center py-16 border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-white/5 bg-black/20'} rounded-lg`}>
        <AlertCircle className={`mx-auto mb-3 ${isLight ? 'text-gray-500' : 'text-gray-400'}`} size={32} />
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'}`}>No requests found matching your filters</p>
      </div>
    );
  }
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRoleLabel = (role: string | null) => {
    if (!role) return "";
    
    switch (role) {
      case 'volunteer': return "(Volunteer)";
      case 'ngo': return "(NGO)";
      case 'government': return "(Gov)";
      default: return "";
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={isLight ? 'border-gray-200' : 'border-white/10'}>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Status</TableHead>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Type</TableHead>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Title</TableHead>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Category</TableHead>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Location</TableHead>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Time</TableHead>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Assigned To</TableHead>
            <TableHead className={isLight ? 'text-gray-600' : 'text-gray-400'}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => {
            const isResponded = hasResourceBeenResponded(resource.id);
            const responder = getResourceResponder(resource.id);
            const responderRole = getResourceResponderRole(resource.id);
            
            return (
              <TableRow key={resource.id} className={`${isLight ? 'border-gray-200 hover:bg-gray-50' : 'border-white/5 hover:bg-white/5'}`}>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${resource.status === 'pending' ? (isLight ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300') : 
                      resource.status === 'addressing' ? (isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-500/20 text-blue-300') : 
                      (isLight ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-300')}`
                  }>
                    {resource.status === 'pending' ? (
                      <Clock className="mr-1" size={12} />
                    ) : resource.status === 'addressing' ? (
                      <FileCheck className="mr-1" size={12} />
                    ) : (
                      <CheckCircle2 className="mr-1" size={12} />
                    )}
                    {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {resource.urgent && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isLight ? 'bg-red-100 text-red-800' : 'bg-red-500/20 text-red-300'}`}>
                      Urgent
                    </span>
                  )}
                </TableCell>
                <TableCell>{resource.title}</TableCell>
                <TableCell>{getCategoryLabel(resource.category)}</TableCell>
                <TableCell>{resource.location}</TableCell>
                <TableCell className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{formatTimestamp(resource.timestamp)}</TableCell>
                <TableCell>
                  {resource.assignedTo ? (
                    <span className={isLight ? 'text-green-600' : 'text-green-300'}>{resource.assignedTo}</span>
                  ) : (
                    isResponded && responder ? (
                      <span className="flex items-center text-blue-600 dark:text-blue-300">
                        <User size={12} className="mr-1.5" />
                        {responder} <span className={`ml-1.5 text-xs ${isLight ? 'text-blue-500/70' : 'text-blue-200/70'}`}>{getRoleLabel(responderRole)}</span>
                      </span>
                    ) : (
                      <span className={`italic text-sm ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>Not assigned</span>
                    )
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!isResponded && resource.status === 'pending' && (
                      <button 
                        onClick={() => onAssign(resource.id)}
                        className={`px-3 py-1 text-xs ${isLight ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'} rounded transition-colors`}
                      >
                        Assign
                      </button>
                    )}
                    
                    {!isResponded && resource.status === 'pending' && (
                      <button 
                        onClick={() => onStatusChange(resource.id, 'addressing')}
                        className={`px-3 py-1 text-xs ${isLight ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'} rounded transition-colors`}
                      >
                        Address
                      </button>
                    )}
                    
                    {resource.status === 'addressing' && (
                      <button 
                        onClick={() => onStatusChange(resource.id, 'resolved')}
                        className={`px-3 py-1 text-xs ${isLight ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'} rounded transition-colors`}
                      >
                        Resolve
                      </button>
                    )}
                    
                    {resource.status === 'resolved' && (
                      <button 
                        onClick={() => onStatusChange(resource.id, 'addressing')}
                        className={`px-3 py-1 text-xs ${isLight ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'} rounded transition-colors`}
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
