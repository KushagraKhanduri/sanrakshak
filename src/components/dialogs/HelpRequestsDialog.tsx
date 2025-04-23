
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ResourceCard from '../ResourceCard';
import { Resource } from '@/hooks/useResourceData';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';

interface HelpRequestsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
}

const HelpRequestsDialog: React.FC<HelpRequestsDialogProps> = ({ 
  isOpen, 
  onClose, 
  resources 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter urgent needs
  const urgentNeeds = resources
    .filter(resource => resource.type === 'need' && resource.urgent)
    .sort((a, b) => b.timestamp - a.timestamp);
    
  // Filter resources based on search term
  const filteredResources = searchTerm 
    ? urgentNeeds.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : urgentNeeds;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Help Requests</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search help requests..."
              className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-2.5"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        
        {filteredResources.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <p>No help requests found{searchTerm ? " matching your search" : ""}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map(resource => (
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
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HelpRequestsDialog;
