
import React, { useMemo } from 'react';
import { AlertCircle, Clock, MapPin, Phone, Tag, AlertTriangle, Package, Truck, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Resource } from '@/hooks/useResourceData';

interface ResourceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string | null;
  resources: Resource[];
}

type PredefinedResourceType = {
  id: string;
  title: string;
  category: 'water' | 'food' | 'medical' | 'shelter';
  description: string;
  lastUpdated: string;
  status: string;
  quantity: number;
  unit: string;
  location: string;
  contact?: string;
  peopleServed?: number;
};

const ResourceDetailsDialog: React.FC<ResourceDetailsDialogProps> = ({ 
  isOpen, 
  onClose, 
  resourceId,
  resources
}) => {
  const resourceData = useMemo(() => {
    // First check if it's a resource from the resources array
    const resourceFromArray = resources.find(r => r.id === resourceId);
    if (resourceFromArray) {
      return {
        id: resourceFromArray.id,
        title: resourceFromArray.title,
        category: resourceFromArray.category,
        description: resourceFromArray.description,
        lastUpdated: new Date(resourceFromArray.timestamp).toLocaleString(),
        status: resourceFromArray.status || 'available',
        quantity: resourceFromArray.items?.[0]?.quantity || 0,
        unit: 'units',
        location: resourceFromArray.location,
        contact: resourceFromArray.contact,
        peopleServed: resourceFromArray.people
      };
    }
    
    // If not found, use predefined resources based on id
    const predefinedResources: Record<string, PredefinedResourceType> = {
      'water-supplies': {
        id: 'water-supplies',
        title: 'Water Supplies',
        category: 'water',
        description: 'Bottled water for distribution to affected communities.',
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
        status: 'Available',
        quantity: 5000,
        unit: 'bottles',
        location: 'Gwarighat Water Treatment Plant, Civil Lines, Jabalpur',
        contact: '555-123-4567',
        peopleServed: 1250,
      },
      'food-supplies': {
        id: 'food-supplies',
        title: 'Food Supplies',
        category: 'food',
        description: 'Meal kits with non-perishable food items for emergency distribution.',
        lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toLocaleString(),
        status: 'Low Stock',
        quantity: 120,
        unit: 'meal kits',
        location: 'Municipal Corporation Distribution Center, Wright Town, Jabalpur',
        contact: '555-123-8910',
        peopleServed: 40,
      },
      'medical-supplies': {
        id: 'medical-supplies',
        title: 'Medical Supplies',
        category: 'medical',
        description: 'First aid kits, medications, and basic medical equipment.',
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
        status: 'Available',
        quantity: 350,
        unit: 'kits',
        location: 'Netaji Subhash Chandra Bose Medical College, Nagpur Road, Jabalpur',
        contact: '555-123-5678',
        peopleServed: 350,
      },
      'shelter-capacity': {
        id: 'shelter-capacity',
        title: 'Shelter Capacity',
        category: 'shelter',
        description: '3 shelter locations providing temporary housing for displaced residents.',
        lastUpdated: new Date(Date.now() - 60 * 60 * 1000).toLocaleString(),
        status: '65% Full',
        quantity: 150,
        unit: 'spaces remaining',
        location: 'Multiple Locations (Rani Durgavati University, Model School Adhartal, St. Aloysius College)',
        contact: '555-123-7890',
        peopleServed: 280,
      }
    };
    
    return predefinedResources[resourceId || ''] || null;
  }, [resourceId, resources]);
  
  // Status color indicator
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('available')) return 'bg-green-500';
    if (status.toLowerCase().includes('low')) return 'bg-yellow-500';
    if (status.toLowerCase().includes('critical')) return 'bg-red-500';
    if (status.toLowerCase().includes('full')) return 'bg-blue-500';
    return 'bg-white/20';
  };
  
  if (!resourceData) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-black">
            {resourceData.category === 'water' && <Package className="h-5 w-5" />}
            {resourceData.category === 'food' && <Package className="h-5 w-5" />}
            {resourceData.category === 'medical' && <AlertCircle className="h-5 w-5" />}
            {resourceData.category === 'shelter' && <Users className="h-5 w-5" />}
            {resourceData.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-black">
            Resource details and current status
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Tag className="h-4 w-4 mr-1" />
              <span className="text-black mr-2">Category:</span>
              <span className="capitalize text-black">{resourceData.category}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2 text-black">Status:</span>
              <div className="flex items-center">
                <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(resourceData.status)} mr-1.5`}></div>
                <span className="text-sm text-black">{resourceData.status}</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-1 text-black">Description</h3>
              <p className="text-sm text-black">{resourceData.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h3 className="text-sm font-medium mb-1 text-black">Quantity</h3>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1.5" />
                  <span className="text-sm text-black">
                    {resourceData.quantity} {resourceData.unit}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1 text-black">People Served</h3>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span className="text-sm text-black">
                    {resourceData.peopleServed || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-black">Location</h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5" />
                <span className="text-sm text-black">{resourceData.location}</span>
              </div>
            </div>
            
            {resourceData.contact && (
              <div>
                <h3 className="text-sm font-medium mb-1 text-black">Contact</h3>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1.5" />
                  <span className="text-sm text-black">{resourceData.contact}</span>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-black">Last Updated</h3>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span className="text-sm text-black">{resourceData.lastUpdated}</span>
              </div>
            </div>
            
            {/* If showing a low stock resource */}
            {resourceData.status.toLowerCase().includes('low') && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-black">Low Stock Warning</h4>
                    <p className="text-xs text-black mt-1">
                      This resource is running low and needs replenishment. Consider ordering more supplies or redistributing from other locations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDetailsDialog;
