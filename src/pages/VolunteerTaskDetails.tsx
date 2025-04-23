
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useToast } from "@/hooks/use-toast";
import useResourceData from '@/hooks/useResourceData';
import AddNoteDialog from '@/components/AddNoteDialog';
import { 
  ArrowLeft, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  User, 
  Phone, 
  MessageSquare,
  CheckCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../context/ThemeProvider';

const VolunteerTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { resources, responses, updateResponse } = useResourceData();
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [taskNotes, setTaskNotes] = useState<Array<{text: string, timestamp: number, user: string}>>([]);
  const [taskStatus, setTaskStatus] = useState<string>('in-progress');
  
  // Extract the response ID from the task ID
  const responseId = id ? id.replace('task-', '') : '';
  
  // Find the corresponding response and resource
  const taskData = useMemo(() => {
    if (!responseId) return null;
    
    const response = responses.find(r => r.id === responseId);
    if (!response) return null;
    
    const resource = resources.find(r => r.id === response.requestId);
    if (!resource) return null;
    
    // Create a task object from the resource and response
    return {
      id: id || '',
      title: resource.title || 'Unnamed Task',
      type: 'assistance',
      description: resource.description || 'No description provided',
      location: resource.location || 'Unknown location',
      locationDetails: resource.locationDetails || '',
      status: response.status === 'pending' ? 'in-progress' : response.status,
      priority: resource.urgent ? 'high' : 'medium',
      createdAt: resource.timestamp,
      assignedAt: new Date(response.time).toLocaleDateString(),
      assignedTime: new Date(response.time).toLocaleTimeString(),
      items: resource.items || [],
      beneficiary: {
        name: resource.contactName || 'Anonymous',
        contact: resource.contact || '',
        notes: resource.specialNotes || ''
      },
      notes: [
        { 
          text: 'Initial request received', 
          timestamp: resource.timestamp,
          user: 'System' 
        },
        { 
          text: 'Assigned to volunteer', 
          timestamp: response.time,
          user: 'System' 
        }
      ]
    };
  }, [id, responseId, resources, responses]);
  
  // Initialize taskNotes and taskStatus with values from taskData
  useEffect(() => {
    if (taskData) {
      if (taskData.notes) {
        setTaskNotes(taskData.notes);
      }
      if (taskData.status) {
        setTaskStatus(taskData.status);
      }
    }
  }, [taskData]);
  
  useEffect(() => {
    // Set loading to false after a brief delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleStatusUpdate = (newStatus: string) => {
    if (!responseId) return;
    
    // Update the response status in our state
    setTaskStatus(newStatus);
    
    // Add a note about the status change
    const newNote = {
      text: `Task marked as ${newStatus}`,
      timestamp: Date.now(),
      user: JSON.parse(localStorage.getItem('authUser') || '{}').name || 'Volunteer'
    };
    
    setTaskNotes([...taskNotes, newNote]);
    
    // Get the current user ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const userId = currentUser.id;
    
    if (userId) {
      // Update the response in localStorage
      const userResponses = JSON.parse(localStorage.getItem(`responses_${userId}`) || '[]');
      const updatedResponses = userResponses.map((response: any) => {
        if (response.id === responseId) {
          return { ...response, status: newStatus === 'processed' ? 'accepted' : newStatus };
        }
        return response;
      });
      
      localStorage.setItem(`responses_${userId}`, JSON.stringify(updatedResponses));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('response-updated'));
    }
    
    // Show a toast notification
    toast({
      title: "Status Updated",
      description: `Task marked as ${newStatus}`,
    });
  };

  const handleAddNote = (noteText: string) => {
    const newNote = {
      text: noteText,
      timestamp: Date.now(),
      user: JSON.parse(localStorage.getItem('authUser') || '{}').name || 'Volunteer'
    };
    
    setTaskNotes([...taskNotes, newNote]);
    
    toast({
      title: "Note Added",
      description: "Your note has been added to the task"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-4">
          <div className="animate-pulse max-w-3xl mx-auto">
            <div className="h-8 w-1/2 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
            <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
            <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
            
            <div className="h-32 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
            
            <div className="space-y-2">
              <div className="h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold">Task not found</h2>
          <p className="mt-2 mb-4">The task you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/volunteer-tasks')}>
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center">
                <Link to="/volunteer-tasks" className="mr-2 p-2 rounded-full hover:bg-white/10 transition-colors">
                  <ArrowLeft size={18} />
                </Link>
                <h1 className="text-2xl font-bold">Task Details</h1>
              </div>
            </div>
            
            <AnimatedTransition>
              <div className="bg-white/5 rounded-xl mb-6">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle size={20} className="mr-3 text-white" />
                    <h2 className="text-2xl font-bold">{taskData.title}</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {taskData.priority === 'high' && (
                      <span className="text-xs px-3 py-1 rounded-full bg-red-900/30 text-red-400">
                        High Priority
                      </span>
                    )}
                    
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-900/30 text-blue-400">
                      {taskStatus === 'in-progress' ? 'In Progress' : taskStatus}
                    </span>
                  </div>
                  
                  <p className="text-blue-400 mb-8">
                    {taskData.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>{taskData.location}</span>
                        </div>
                        {taskData.locationDetails && (
                          <div className="ml-6 text-gray-400">
                            {taskData.locationDetails}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Time Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Calendar size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>Assigned: {taskData.assignedAt}</span>
                        </div>
                        <div className="flex items-start">
                          <Clock size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>Time: {taskData.assignedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {taskData.items && taskData.items.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Items to Deliver</h3>
                      <div className="overflow-hidden">
                        <table className="w-full">
                          <thead className="border-b border-white/10 text-left">
                            <tr>
                              <th className="py-2 font-medium">Item</th>
                              <th className="py-2 font-medium text-right">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {taskData.items.map((item: any, index: number) => (
                              <tr key={index} className="border-b border-white/5">
                                <td className="py-3">{item.name}</td>
                                <td className="py-3 text-right">{item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {taskData.beneficiary && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Beneficiary Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <User size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>{taskData.beneficiary.name}</span>
                        </div>
                        
                        {taskData.beneficiary.contact && (
                          <div className="flex items-start">
                            <Phone size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{taskData.beneficiary.contact}</span>
                          </div>
                        )}
                        
                        {taskData.beneficiary.notes && (
                          <div className="flex items-start">
                            <AlertTriangle size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{taskData.beneficiary.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold ">Activity Log</h3>
                      <Button 
                        variant="outline" 
                        className="text-black dark:text-white"
                        size="sm"
                        onClick={() => setIsNoteDialogOpen(true)}
                      >
                        <MessageSquare size={14} className="mr-1" />
                        Add Note
                      </Button>
                    </div>
                    
                    <div className="rounded-lg border border-white/10">
                      <div className="divide-y divide-white/10">
                        {taskNotes.map((note, index) => (
                          <div key={index} className="p-3">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-sm">{note.user}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(note.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1 text-sm">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    {taskData.beneficiary?.contact && (
                      <Link 
                        to={`/chat/${taskData.beneficiary?.name.replace(/\s+/g, '-').toLowerCase()}`}
                        className="px-4 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 transition-colors"
                      >
                        <MessageSquare size={14} className="inline-block mr-1.5" />
                        Message Beneficiary
                      </Link>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {taskStatus === 'in-progress' && (
                      <Button 
                        variant="default"
                        onClick={() => handleStatusUpdate('processed')}
                      >
                        <CheckCheck size={16} className="mr-1.5" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </main>
      
      <AddNoteDialog 
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default VolunteerTaskDetails;
