
import React, { useState } from 'react';
import { Droplet, Home, ShoppingBag, Utensils, Heart, Shield, AlertTriangle, MapPin, HelpCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety' | 'other';

interface VictimRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: {
    category: ResourceCategory;
    title: string;
    description: string;
    location: string;
    contact?: string;
    urgent?: boolean;
  }) => void;
}

const VictimRequestDialog: React.FC<VictimRequestDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [category, setCategory] = useState<ResourceCategory>('water');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      category,
      title,
      description,
      location,
      contact: contact || undefined,
      urgent
    });
    resetForm();
  };
  
  const resetForm = () => {
    setCategory('water');
    setTitle('');
    setDescription('');
    setLocation('');
    setContact('');
    setUrgent(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const getCategoryIcon = (cat: ResourceCategory) => {
    switch (cat) {
      case 'water': return <Droplet size={18} />;
      case 'shelter': return <Home size={18} />;
      case 'food': return <Utensils size={18} />;
      case 'supplies': return <ShoppingBag size={18} />;
      case 'medical': return <Heart size={18} />;
      case 'safety': return <Shield size={18} />;
      case 'other': return <HelpCircle size={18} />;
      default: return <Droplet size={18} />;
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibG92YWJsZWFpIiwiYSI6ImNscXlzdjBtMTAzeng2a210cjRvcW43MjYifQ.PLPk6sT9kn_x9DcZGWxEiw`
          );
          
          if (!response.ok) throw new Error("Geocoding failed");
          
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const locationName = data.features[0].place_name;
            setLocation(locationName);
          } else {
            setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
        } catch (error) {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description: "Failed to retrieve your location",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: error.message || "Failed to access your location",
          variant: "destructive"
        });
      }
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {getCategoryIcon(category)}
            Request Help
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Submit your request for assistance during this emergency
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: ResourceCategory) => setCategory(value)}>
              <SelectTrigger id="category" className="w-full">
                <div className="flex items-center">
                  {getCategoryIcon(category)}
                  <SelectValue className="ml-2" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water">
                  <div className="flex items-center">
                    <Droplet size={18} className="mr-2" />
                    <span>Water</span>
                  </div>
                </SelectItem>
                <SelectItem value="shelter">
                  <div className="flex items-center">
                    <Home size={18} className="mr-2" />
                    <span>Shelter</span>
                  </div>
                </SelectItem>
                <SelectItem value="food">
                  <div className="flex items-center">
                    <Utensils size={18} className="mr-2" />
                    <span>Food</span>
                  </div>
                </SelectItem>
                <SelectItem value="supplies">
                  <div className="flex items-center">
                    <ShoppingBag size={18} className="mr-2" />
                    <span>Supplies</span>
                  </div>
                </SelectItem>
                <SelectItem value="medical">
                  <div className="flex items-center">
                    <Heart size={18} className="mr-2" />
                    <span>Medical</span>
                  </div>
                </SelectItem>
                <SelectItem value="safety">
                  <div className="flex items-center">
                    <Shield size={18} className="mr-2" />
                    <span>Safety</span>
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center">
                    <HelpCircle size={18} className="mr-2" />
                    <span>Other</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Brief description of what you need"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Details</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Provide more information about your request"
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Your location or drop point"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={getCurrentLocation} 
                variant="default"
                disabled={isLoading}
                aria-label="Use my current location"
              >
                <MapPin size={18} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact">Contact (Optional)</Label>
            <Input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone number or other contact info"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="urgent" 
              checked={urgent}
              onCheckedChange={(checked) => setUrgent(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="urgent" className="text-sm font-normal flex items-center">
                <span>Mark as urgent</span>
                <AlertTriangle size={14} className="ml-1 text-orange-500" />
              </Label>
              <p className="text-xs text-muted-foreground">
                Only mark as urgent for life-threatening or critical needs
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleClose} type="button" className="dark:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VictimRequestDialog;
