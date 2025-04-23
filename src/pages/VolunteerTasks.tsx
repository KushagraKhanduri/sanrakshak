
import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Clock, ArrowRight, MapPin, Phone, User } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import useResourceData, { Resource } from '@/hooks/useResourceData';
import { Card, CardContent } from '@/components/ui/card';

const VolunteerTasks = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { resources, responses, cleanupInvalidResponses } = useResourceData();
  const isLight = theme === 'light';
  
  // Clean up any invalid responses when the component mounts
  useEffect(() => {
    if (!loading && cleanupInvalidResponses) {
      cleanupInvalidResponses();
    }
  }, [loading, cleanupInvalidResponses]);
  
  const tasks = useMemo(() => {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (!currentUser.id) return [];
    
    const userResponses = responses.filter(response => 
      response.type === 'offer' && 
      ['pending', 'accepted'].includes(response.status)
    );
    
    return userResponses.map(response => {
      const resource = resources.find(r => r.id === response.requestId);
      if (!resource) return null;
      
      return {
        id: `task-${response.id}`,  // This is the correct format that matches what we need
        title: resource.title,
        type: 'assistance',
        description: resource.description,
        location: resource.location,
        locationDetails: resource.locationDetails,
        status: response.status === 'pending' ? 'in-progress' : response.status,
        priority: resource.urgent ? 'high' : 'medium',
        createdAt: resource.timestamp,
        beneficiary: {
          name: resource.contactName || 'Anonymous',
          contact: resource.contact || 'No contact provided'
        },
        category: resource.category,
        responseId: response.id,
        items: resource.items,
        specialNotes: resource.specialNotes
      };
    }).filter(Boolean);
  }, [resources, responses]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-progress':
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full 
            ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
            In Progress
          </span>
        );
      case 'scheduled':
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full 
            ${isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400'}`}>
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full 
            ${isLight ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'}`}>
            Completed
          </span>
        );
      default:
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full 
            ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-gray-900/30 text-gray-400'}`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <Link to="/dashboard" className={`mr-2 p-2 rounded-full ${
                  isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                } transition-colors`}>
                  <ArrowLeft size={18} />
                </Link>
                <h1 className="text-2xl font-bold">My Volunteer Tasks</h1>
              </div>
              <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Manage and view your volunteer assignments</p>
            </div>
          </div>
          
          <AnimatedTransition>
            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`animate-pulse rounded-xl p-6 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                    <div className="h-6 w-1/3 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
                    <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700"></div>
                      <div className="h-8 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`rounded-xl border hover:scale-105 transition-all duration-300${
                        isLight 
                          ? 'bg-white border-gray-200 shadow-sm' 
                          : 'bg-black/30 border-white/10'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <CheckCircle size={18} className="mr-2 text-primary" />
                              <h3 className="font-semibold text-lg">{task.title}</h3>
                            </div>
                            <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'} mb-4`}>{task.description}</p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <MapPin size={14} className="mr-2 opacity-70" />
                                <span>{task.location}</span>
                              </div>
                              
                              {task.beneficiary && (
                                <div className="flex items-center text-sm">
                                  <User size={14} className="mr-2 opacity-70" />
                                  <span>{task.beneficiary.name}</span>
                                </div>
                              )}
                              
                              {task.beneficiary?.contact && (
                                <div className="flex items-center text-sm">
                                  <Phone size={14} className="mr-2 opacity-70" />
                                  <span>{task.beneficiary.contact}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                        
                        <div className={`mt-4 pt-4 border-t ${
                          isLight ? 'border-gray-100' : 'border-white/5'
                        } flex justify-between items-center`}>
                          <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                            {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                          <Link 
                            to={`/volunteer-tasks/${task.id}`}
                            className={`flex items-center text-sm font-medium py-1 px-3 rounded-lg ${
                              isLight 
                                ? 'bg-gray-100 hover:bg-gray-200' 
                                : 'bg-white/10 hover:bg-white/15'
                            } transition-colors`}
                          >
                            <span className="mr-1">Details</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`rounded-xl p-10 text-center ${
                    isLight ? 'bg-gray-50 border border-gray-100' : 'bg-black/20 border border-white/5'
                  }`}>
                    <h3 className="text-lg font-medium mb-2">No tasks assigned yet</h3>
                    <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
                      You don't have any volunteer tasks assigned at the moment.
                    </p>
                    <Link 
                      to="/resources"
                      className={`inline-flex items-center px-4 py-2 rounded-lg ${
                        isLight ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      Find opportunities to help
                    </Link>
                  </div>
                )}
              </div>
            )}
          </AnimatedTransition>
        </div>
      </main>
    </div>
  );
};

export default VolunteerTasks;
