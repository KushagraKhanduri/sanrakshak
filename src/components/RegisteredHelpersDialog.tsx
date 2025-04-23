import React, { useState, useEffect } from 'react';
import { Search, Building, Users } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import UserProfile from './UserProfile';
import { useTheme } from '../context/ThemeProvider';
import { cn } from '@/lib/utils';

interface RegisteredHelpersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface User {
  id: string;
  name: string;
  role: 'volunteer' | 'ngo' | 'victim' | 'government';
  contactInfo: string;
  location: string;
  lastActive: string;
  skills?: string[];
}

const RegisteredHelpersDialog: React.FC<RegisteredHelpersDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [helperFilter, setHelperFilter] = useState<'all' | 'volunteer' | 'ngo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  useEffect(() => {
    // Get users from localStorage where they're stored during account creation
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        // Only include volunteers and NGOs
        const helpersOnly = parsedUsers.filter((user: User) => 
          user.role === 'volunteer' || user.role === 'ngo'
        );
        setUsers(helpersOnly);
      } catch (error) {
        console.error('Error parsing stored users:', error);
        // Fallback to empty array if error
        setUsers([]);
      }
    } else {
      // If no users found in localStorage, use sample data
      const sampleUsers: User[] = [
        {
          id: "volunteer-1",
          name: "Sarah Johnson",
          role: "volunteer",
          contactInfo: "sarah.j@example.com",
          location: "Central District",
          lastActive: "2 hours ago",
          skills: ["First Aid", "Search & Rescue", "Logistics"]
        },
        {
          id: "ngo-1",
          name: "Red Cross Chapter",
          role: "ngo",
          contactInfo: "local@redcross.org",
          location: "Multiple Districts",
          lastActive: "30 minutes ago"
        },
        {
          id: "volunteer-2",
          name: "Michael Chen",
          role: "volunteer",
          contactInfo: "m.chen@example.com",
          location: "North District",
          lastActive: "4 hours ago",
          skills: ["Medical", "Transportation", "Communication"]
        },
        {
          id: "ngo-2",
          name: "Community Relief Foundation",
          role: "ngo",
          contactInfo: "help@crf.org",
          location: "South District",
          lastActive: "1 hour ago"
        }
      ];
      setUsers(sampleUsers);
    }
  }, []);
  
  useEffect(() => {
    // Filter users based on search query and helper filter
    let result = [...users];
    
    if (helperFilter !== 'all') {
      result = result.filter(user => user.role === helperFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.location.toLowerCase().includes(query) ||
        (user.contactInfo && user.contactInfo.toLowerCase().includes(query))
      );
    }
    
    setFilteredUsers(result);
  }, [users, helperFilter, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Registered Helpers</DialogTitle>
          <DialogDescription>
            Connect with volunteers and NGOs who can provide assistance during emergencies.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search helpers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-9 pr-4 py-2 rounded-lg focus:outline-none w-full md:w-60",
                isLight 
                  ? "bg-gray-100 border border-gray-300 focus:ring-1 focus:ring-gray-400" 
                  : "bg-black/40 border border-white/10 focus:ring-1 focus:ring-white/30"
              )}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={helperFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setHelperFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={helperFilter === 'volunteer' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setHelperFilter('volunteer')}
            >
              <Users className="h-4 w-4 mr-1" />
              Volunteers
            </Button>
            <Button 
              variant={helperFilter === 'ngo' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setHelperFilter('ngo')}
            >
              <Building className="h-4 w-4 mr-1" />
              NGOs
            </Button>
          </div>
        </div>
        
        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <UserProfile
                  key={user.id}
                  name={user.name}
                  role={user.role as 'volunteer' | 'ngo'}
                  contactInfo={user.contactInfo}
                  location={user.location}
                  lastActive={user.lastActive}
                  skills={user.role === 'volunteer' ? user.skills : undefined}
                  userId={user.id}
                />
              ))
            ) : (
              <div className={cn(
                "col-span-2 py-10 text-center",
                isLight ? "text-gray-600" : "text-gray-400"
              )}>
                <p>No helpers found matching your criteria</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RegisteredHelpersDialog;
