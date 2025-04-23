
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import AddResourceDialog from './dialogs/AddResourceDialog';
import useResourceData from '@/hooks/useResourceData';

interface ResourceManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResourceManagementDialog: React.FC<ResourceManagementDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const { addResource } = useResourceData();
  
  // Mock data for resources and categories
  const categories = [
    { id: '1', name: 'Water', count: 12 },
    { id: '2', name: 'Food', count: 15 },
    { id: '3', name: 'Shelter', count: 8 },
    { id: '4', name: 'Medical', count: 20 },
    { id: '5', name: 'Supplies', count: 17 },
    { id: '6', name: 'Safety', count: 6 }
  ];
  
  const teams = [
    { id: '1', name: 'Water Relief Team', members: 8, active: true },
    { id: '2', name: 'Medical Response Unit', members: 12, active: true },
    { id: '3', name: 'Food Distribution', members: 6, active: false },
    { id: '4', name: 'Rescue Operations', members: 15, active: true }
  ];
  
  const handleAddCategory = () => {
    setIsAddResourceDialogOpen(true);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Resource Management</DialogTitle>
            <DialogDescription>
              Manage categories, teams, and resource allocation settings.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            defaultValue="categories" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-2"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="teams">Response Teams</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium ">Resource Categories</h3>
                <Button size="sm" variant="outline" className="h-8 text-black dark:text-white" onClick={handleAddCategory}>
                  <Plus size={14} className="mr-1" />
                  Add Category
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {categories.map(category => (
                  <div 
                    key={category.id} 
                    className="flex items-center justify-between p-3 rounded-md border border-white/5 bg-black/20"
                  >
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-black dark:text-white">{category.count} resources</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black dark:text-white">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="teams" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Response Teams</h3>
                <Button size="sm" variant="outline" className="h-8 text-black dark:text-white">
                  <Plus size={14} className="mr-1" />
                  Add Team
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {teams.map(team => (
                  <div 
                    key={team.id} 
                    className="flex items-center justify-between p-3 rounded-md border border-white/5 bg-black/20"
                  >
                    <div className="flex items-center">
                      {team.active && (
                        <CheckCircle2 size={14} className="text-green-500 mr-2" />
                      )}
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-xs text-black dark:text-white">{team.members} members</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black dark:text-white">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Resource Allocation Settings</h3>
                  <p className="text-xs text-gray-400">Configure how resources are allocated during emergencies.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-md border border-white/5 bg-black/20">
                    <div>
                      <div className="font-medium">Auto-assignment</div>
                      <div className="text-xs text-black dark:text-white">Automatically assign resources to teams</div>
                    </div>
                    <Button variant="outline" size="sm" className="text-black dark:text-white">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md border border-white/5 bg-black/20">
                    <div>
                      <div className="font-medium">Priority Levels</div>
                      <div className="text-xs text-black dark:text-white">Set resource priority levels</div>
                    </div>
                    <Button variant="outline" size="sm" className="text-black dark:text-white">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md border border-white/5 bg-black/20">
                    <div>
                      <div className="font-medium">Notification Rules</div>
                      <div className="text-xs text-black dark:text-white">Configure resource notification settings</div>
                    </div>
                    <Button variant="outline" size="sm" className="text-black dark:text-white">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AddResourceDialog
        isOpen={isAddResourceDialogOpen}
        onClose={() => setIsAddResourceDialogOpen(false)}
        onAddResource={addResource}
      />
    </>
  );
};

export default ResourceManagementDialog;
