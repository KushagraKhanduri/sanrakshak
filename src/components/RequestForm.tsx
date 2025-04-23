
import React, { useState, useEffect } from 'react';
import { Droplet, Home, ShoppingBag, Utensils, Heart, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
type ResourceType = 'need' | 'offer';

interface RequestFormProps {
  onSubmit: (request: {
    type: ResourceType;
    category: ResourceCategory;
    title: string;
    description: string;
    location: string;
    contact?: string;
    urgent?: boolean;
  }) => void;
  onCancel: () => void;
  userRole?: string;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, onCancel, userRole = 'victim' }) => {
  const [type, setType] = useState<ResourceType>('need');
  const [category, setCategory] = useState<ResourceCategory>('water');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get current user
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  useEffect(() => {
    if (userRole === 'volunteer' || userRole === 'ngo' || userRole === 'government') {
      setType('offer');
    } else {
      setType('need');
    }
  }, [userRole]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      category,
      title,
      description,
      location,
      contact: contact || undefined,
      urgent: urgent || undefined
    });
  };
  
  const isVolunteer = userRole === 'volunteer' || userRole === 'ngo' || userRole === 'government';
  
  const getCategoryIcon = (cat: ResourceCategory) => {
    switch (cat) {
      case 'water': return <Droplet size={18} />;
      case 'shelter': return <Home size={18} />;
      case 'food': return <Utensils size={18} />;
      case 'supplies': return <ShoppingBag size={18} />;
      case 'medical': return <Heart size={18} />;
      case 'safety': return <Shield size={18} />;
      default: return <Droplet size={18} />;
    }
  };
  
  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {getCategoryIcon(category)}
        {isVolunteer ? 'Offer Resources' : (type === 'need' ? 'Request Resources' : 'Offer Resources')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isVolunteer && (
          <div className="flex">
            <Button
              type="button"
              onClick={() => setType('need')}
              className={`flex-1 py-2 px-4 text-sm font-medium ${type === 'need' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              variant={type === 'need' ? 'default' : 'outline'}
            >
              I Need Help
            </Button>
            
            {userRole === 'victim' && (
              <Button
                type="button"
                onClick={() => setType('offer')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${type === 'offer' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                variant={type === 'offer' ? 'default' : 'outline'}
              >
                I Can Help Others
              </Button>
            )}
          </div>
        )}
        
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
            placeholder="Brief description of what you need/offer"
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
          <Input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Your location or drop point"
          />
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
        
        {!isVolunteer && type === 'need' && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="urgent" 
              checked={urgent}
              onCheckedChange={(checked) => setUrgent(checked as boolean)}
            />
            <Label htmlFor="urgent" className="text-sm font-normal">
              Mark as urgent
            </Label>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
