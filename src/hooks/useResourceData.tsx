
import { useState, useEffect } from 'react';

// Define types for our resources
export type ResourceType = 'need' | 'offer';
export type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
export type ResourceStatus = 'pending' | 'addressing' | 'resolved';

export interface Resource {
  id: string;
  type: ResourceType;
  category: ResourceCategory;
  title: string;
  description: string;
  location: string;
  locationDetails?: string;
  contact?: string;
  contactName?: string;
  specialNotes?: string;
  urgent?: boolean;
  timestamp: number;
  status?: ResourceStatus;
  assignedTo?: string;
  people?: number;
  userId?: string;
  username?: string;
  items?: Array<{name: string, quantity: number}>;
}

export interface ResourceResponse {
  id: string;
  requestId: string;
  type: 'offer' | 'request';
  category: ResourceCategory;
  title: string;
  time: number;
  status: 'pending' | 'accepted' | 'rejected';
  responderName?: string;
  responderRole?: string;
  responderUserId?: string;
}

const useResourceData = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [responses, setResponses] = useState<ResourceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Load resources from localStorage
  useEffect(() => {
    const loadResources = () => {
      // Load from Connect page
      const connectResources = localStorage.getItem('resourceRequests');
      
      // Load from Resources page
      const pageResources = localStorage.getItem('resources');
      
      let allResources: Resource[] = [];
      
      if (connectResources) {
        try {
          const parsed = JSON.parse(connectResources);
          allResources = [...allResources, ...parsed];
        } catch (error) {
          console.error('Error parsing connectResources:', error);
        }
      }
      
      if (pageResources) {
        try {
          const parsed = JSON.parse(pageResources);
          // Avoid duplicates by checking ids
          const existingIds = new Set(allResources.map(r => r.id));
          const newResources = parsed.filter((r: Resource) => !existingIds.has(r.id));
          allResources = [...allResources, ...newResources];
        } catch (error) {
          console.error('Error parsing pageResources:', error);
        }
      }
      
      // If no resources found, create initial data
      if (allResources.length === 0) {
        allResources = [
          {
            id: '1',
            type: 'need',
            category: 'water',
            title: 'Clean Drinking Water',
            description: 'Urgently need bottled water for family of 4, including infant.',
            location: 'Madan Mahal, Jabalpur',
            urgent: true,
            timestamp: Date.now() - 3600000,
            status: 'pending'
          },
          {
            id: '2',
            type: 'offer',
            category: 'shelter',
            title: 'Temporary Housing Available',
            description: 'Can accommodate up to 3 people in spare rooms. Has generator and supplies.',
            location: 'Civil Lines, Jabalpur',
            contact: '555-123-4567',
            timestamp: Date.now() - 7200000,
            status: 'pending'
          }
        ];
      }
      
      // Sort resources consistently by timestamp and urgency
      allResources.sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return b.timestamp - a.timestamp;
      });
      
      setResources(allResources);
      setLoading(false);
    };
    
    // Load all user responses
    const loadResponses = () => {
      const allResponses: ResourceResponse[] = [];
      
      // Check for all response keys in localStorage
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
      
      setResponses(allResponses);
    };
    
    loadResources();
    loadResponses();
    
    // Listen for storage events to update in real-time across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && (
          event.key === 'resourceRequests' || 
          event.key === 'resources' || 
          event.key.startsWith('responses_')
        )) {
        loadResources();
        loadResponses();
      }
    };
    
    // Listen for custom events for real-time updates within the same tab
    const handleResourceChange = () => {
      console.log('Resource data change detected, refreshing data');
      loadResources();
      loadResponses();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resource-updated', handleResourceChange);
    window.addEventListener('resource-created', handleResourceChange);
    window.addEventListener('response-updated', handleResourceChange);
    window.addEventListener('response-created', handleResourceChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resource-updated', handleResourceChange);
      window.removeEventListener('resource-created', handleResourceChange);
      window.removeEventListener('response-updated', handleResourceChange);
      window.removeEventListener('response-created', handleResourceChange);
    };
  }, []);
  
  // Function to add a new resource
  const addResource = (newResource: Omit<Resource, 'id' | 'timestamp'>) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    const updatedResources = [resource, ...resources];
    setResources(updatedResources);
    
    // Update localStorage based on type
    if (newResource.userId) {
      // This is for the Connect page
      localStorage.setItem('resourceRequests', JSON.stringify(updatedResources));
    } else {
      // This is for the Resources page
      localStorage.setItem('resources', JSON.stringify(updatedResources));
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('resource-created'));
    
    return resource;
  };
  
  // Function to add a response
  const addResponse = (userId: string, response: Omit<ResourceResponse, 'id' | 'time'>) => {
    // Get the current user info for additional response data
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    
    const newResponse: ResourceResponse = {
      ...response,
      id: Date.now().toString(),
      time: Date.now(),
      responderName: currentUser.name || currentUser.email || 'User',
      responderRole: currentUser.role || 'volunteer',
      responderUserId: userId
    };
    
    const userResponses = JSON.parse(localStorage.getItem(`responses_${userId}`) || '[]');
    const updatedResponses = [newResponse, ...userResponses];
    
    localStorage.setItem(`responses_${userId}`, JSON.stringify(updatedResponses));
    
    // Update the responses state
    setResponses([newResponse, ...responses]);
    
    // If this is a response to a "need" request, update the status in the resources
    if (response.type === 'offer') {
      const storedResources = localStorage.getItem('resources');
      if (storedResources) {
        try {
          const resources = JSON.parse(storedResources);
          const updatedResources = resources.map((resource: Resource) => {
            if (resource.id === response.requestId) {
              return {
                ...resource,
                status: 'addressing',
                assignedTo: currentUser.name || currentUser.email || 'Volunteer'
              };
            }
            return resource;
          });
          localStorage.setItem('resources', JSON.stringify(updatedResources));
        } catch (error) {
          console.error('Error updating resources:', error);
        }
      }
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('response-created'));
    
    return newResponse;
  };
  
  // Function to update a response
  const updateResponse = (userId: string, responseId: string, updates: Partial<ResourceResponse>) => {
    // Get the current responses for the user
    const userResponses = JSON.parse(localStorage.getItem(`responses_${userId}`) || '[]');
    
    // Update the specific response
    const updatedResponses = userResponses.map((response: ResourceResponse) => {
      if (response.id === responseId) {
        return { ...response, ...updates };
      }
      return response;
    });
    
    // Save back to localStorage
    localStorage.setItem(`responses_${userId}`, JSON.stringify(updatedResponses));
    
    // Update the responses state
    setResponses(prev => prev.map(response => {
      if (response.id === responseId) {
        return { ...response, ...updates };
      }
      return response;
    }));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('response-updated'));
    
    return updatedResponses.find((r: ResourceResponse) => r.id === responseId);
  };

  // Function to clean up invalid responses
  const cleanupInvalidResponses = () => {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (!currentUser.id) return;

    // Get current user's responses
    const userResponses = JSON.parse(localStorage.getItem(`responses_${currentUser.id}`) || '[]');

    // Filter out responses for non-existent resources
    const validResponses = userResponses.filter((response: ResourceResponse) => 
      resources.some(resource => resource.id === response.requestId)
    );

    // Only update if there are invalid responses
    if (validResponses.length !== userResponses.length) {
      localStorage.setItem(`responses_${currentUser.id}`, JSON.stringify(validResponses));
      
      // Update the responses state
      setResponses(prev => {
        const otherResponses = prev.filter(r => 
          !userResponses.some((ur: ResourceResponse) => ur.id === r.id)
        );
        return [...otherResponses, ...validResponses];
      });
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('response-updated'));
    }
  };

  // Run cleanup when resources are loaded
  useEffect(() => {
    if (!loading) {
      cleanupInvalidResponses();
    }
  }, [loading, resources]);
  
  return {
    resources,
    responses,
    loading,
    addResource,
    addResponse,
    updateResponse,
    cleanupInvalidResponses
  };
};

export default useResourceData;
