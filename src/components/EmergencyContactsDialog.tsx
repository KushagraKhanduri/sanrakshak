
import React from 'react';
import { X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmergencyContact from './EmergencyContact';

interface EmergencyContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmergencyContactsDialog: React.FC<EmergencyContactsDialogProps> = ({
  open,
  onOpenChange
}) => {
  // Emergency contacts data (in a real app, this would come from an API or props)
  const contacts = [
    {
      id: 'emergency-1',
      name: 'Emergency Response',
      role: 'Coordination Center',
      phone: '555-911',
      available: true,
    },
    {
      id: 'medical-1',
      name: 'Nearest Medical Center',
      role: 'Medical Coordinator',
      phone: '123-456-7890',
      available: true,
    },
    {
      id: 'rescue-1',
      name: 'Search & Rescue Team',
      role: 'Rescue Operations',
      phone: '555-742-9110',
      available: true,
    },
    {
      id: 'fire-1',
      name: 'Fire Department',
      role: 'Fire & Hazard Response',
      phone: '101',
      available: true,
    },
    {
      id: 'police-1',
      name: 'Police Department',
      role: 'Law Enforcement',
      phone: '100',
      available: true,
    },
    {
      id: 'mental-1',
      name: 'Crisis Counseling',
      role: 'Mental Health Support',
      phone: '555-629-4444',
      available: true,
    },
    {
      id: 'shelter-1',
      name: 'Shelter Coordination',
      role: 'Housing Assistance',
      phone: '555-176-5555',
      available: true,
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden fixed">
        <DialogHeader>
          <DialogTitle>Emergency Contacts</DialogTitle>
          <DialogDescription>
            Contact information for emergency services and support.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="grid gap-4 py-4">
            {contacts.map(contact => (
              <EmergencyContact
                key={contact.id}
                contactId={contact.id}
                name={contact.name}
                role={contact.role}
                phone={contact.phone}
                available={contact.available}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContactsDialog;
