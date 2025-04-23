
import React, { useState } from 'react';
import { Droplet, Home, ShoppingBag, Utensils, Heart, Shield, AlertCircle, CheckCircle, MapPin, Calendar, Clock, User, Phone, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeProvider';

type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';

interface Item {
  name: string;
  quantity: number;
}

interface VictimRequestFormProps {
  onSubmit: (request: {
    title: string;
    description: string;
    category: ResourceCategory;
    location: string;
    locationDetails: string;
    people: number;
    urgent: boolean;
    contact?: string;
    contactName?: string;
    specialNotes?: string;
    items: Array<Item>
  }) => void;
  onCancel: () => void;
}

const VictimRequestForm: React.FC<VictimRequestFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('water');
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [people, setPeople] = useState(1);
  const [urgent, setUrgent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contact, setContact] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // Items to deliver
  const [items, setItems] = useState<Array<Item>>([
    { name: '', quantity: 1 }
  ]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Please enter a title for your request';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please provide details about your needs';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Please enter your location';
    }
    
    if (people < 1) {
      newErrors.people = 'Number of people must be at least 1';
    }
    
    // Validate items
    const validItems = items.filter(item => item.name.trim() !== '');
    if (validItems.length === 0) {
      newErrors.items = 'Please add at least one item';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please check your form",
        description: "Some required information is missing",
        variant: "destructive",
      });
      return;
    }
    
    // Filter out empty items
    const validItems = items.filter(item => item.name.trim() !== '');
    
    onSubmit({
      title,
      description,
      category,
      location,
      locationDetails,
      people,
      urgent,
      contact: contact || undefined,
      contactName: contactName || undefined,
      specialNotes: specialNotes || undefined,
      items: validItems
    });
  };
  
  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1 }]);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const handleItemChange = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const newItems = [...items];
    if (field === 'name') {
      newItems[index].name = value as string;
    } else {
      newItems[index].quantity = value as number;
    }
    setItems(newItems);
  };

  const getCategoryIcon = () => {
    switch(category) {
      case 'water': return <Droplet size={20} className="mr-2" />;
      case 'shelter': return <Home size={20} className="mr-2" />;
      case 'food': return <Utensils size={20} className="mr-2" />;
      case 'supplies': return <ShoppingBag size={20} className="mr-2" />;
      case 'medical': return <Heart size={20} className="mr-2" />;
      case 'safety': return <Shield size={20} className="mr-2" />;
      default: return <Droplet size={20} className="mr-2" />;
    }
  };

  return (
    <div className={`rounded-xl border ${isLight ? "border-gray-200 bg-white" : "border-white/10 glass-dark"} p-5`}>
      <div className="flex items-center mb-6">
        <CheckCircle size={24} className="mr-3 text-primary" />
        <h2 className="text-2xl font-bold">Request Assistance</h2>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {urgent && (
          <span className={`text-xs px-3 py-1 rounded-full ${isLight ? "bg-red-100 text-red-700" : "bg-red-900/30 text-red-400"}`}>
            High Priority
          </span>
        )}
        <span className={`text-xs px-3 py-1 rounded-full ${isLight ? "bg-blue-100 text-blue-700" : "bg-blue-900/30 text-blue-400"}`}>
          New Request
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Request Title <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center">
            {getCategoryIcon()}
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Water Delivery, Medical Assistance, etc."
              className={`w-full ${isLight ? "bg-white border-gray-300" : "bg-black/40 border-white/10"} border rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-primary/30 focus:outline-none ${errors.title ? 'border-red-400' : ''}`}
            />
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-blue-400">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe your situation and needs in detail"
            className={`w-full ${isLight ? "bg-white border-gray-300" : "bg-black/40 border-white/10"} border rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-primary/30 focus:outline-none resize-none ${errors.description ? 'border-red-400' : ''}`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Location Details</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-1.5 text-gray-400 flex-shrink-0" />
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area, District, Block #"
                    className={`w-full bg-transparent border-b ${errors.location ? 'border-red-400' : isLight ? 'border-gray-300' : 'border-white/10'} pb-1 focus:outline-none focus:border-primary/30`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-400 ml-6">{errors.location}</p>
                )}
              </div>
              
              <div className="ml-6">
                <textarea
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="Additional location details (building type, landmarks, access instructions)"
                  rows={2}
                  className={`w-full bg-transparent border-b ${isLight ? 'border-gray-300' : 'border-white/10'} pb-1 focus:outline-none focus:border-primary/30 text-gray-600 dark:text-gray-400`}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Time Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                <span>Request Date: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-start">
                <Clock size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                <span>Time: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-start mt-2">
                <AlertTriangle size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                <div className="flex items-center">
                  <input
                    id="urgent"
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className={`w-4 h-4 ${isLight ? "bg-white border-gray-300" : "bg-black border-white/30"} rounded focus:ring-primary mr-2`}
                  />
                  <label htmlFor="urgent">
                    Mark as urgent/high priority
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Items To Deliver</h3>
            <button 
              type="button" 
              onClick={handleAddItem}
              className={`text-sm ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/15"} px-2 py-1 rounded-lg transition-colors`}
            >
              + Add Item
            </button>
          </div>
          
          {errors.items && (
            <p className="text-sm text-red-400 mb-2">{errors.items}</p>
          )}
          
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"} text-left`}>
                <tr>
                  <th className="py-2 font-medium">Item</th>
                  <th className="py-2 font-medium text-right">Quantity</th>
                  <th className="py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                    <td className="py-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Item name"
                        className="w-full bg-transparent focus:outline-none"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-16 bg-transparent text-right focus:outline-none"
                      />
                    </td>
                    <td className="py-2 text-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Beneficiary Information</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <User size={16} className="mr-2 mt-1.5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Name"
                className={`w-full bg-transparent border-b ${isLight ? "border-gray-300" : "border-white/10"} pb-1 focus:outline-none focus:border-primary/30`}
              />
            </div>
            
            <div className="flex items-start">
              <Phone size={16} className="mr-2 mt-1.5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contact Number"
                className={`w-full bg-transparent border-b ${isLight ? "border-gray-300" : "border-white/10"} pb-1 focus:outline-none focus:border-primary/30`}
              />
            </div>
            
            <div className="flex items-start">
              <AlertTriangle size={16} className="mr-2 mt-1.5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Special notes (elderly, children, medical conditions)"
                className={`w-full bg-transparent border-b ${isLight ? "border-gray-300" : "border-white/10"} pb-1 focus:outline-none focus:border-primary/30`}
              />
            </div>
            
            <div className="flex items-start">
              <div className="w-5 mr-2 flex-shrink-0"></div>
              <div className="flex items-center">
                <label className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Number of people: 
                  <input
                    type="number"
                    min="1"
                    value={people}
                    onChange={(e) => setPeople(parseInt(e.target.value) || 1)}
                    className={`w-12 ml-2 bg-transparent border-b ${errors.people ? 'border-red-400' : isLight ? 'border-gray-300' : 'border-white/10'} pb-1 focus:outline-none focus:border-primary/30 text-center`}
                  />
                </label>
                {errors.people && (
                  <p className="ml-2 text-sm text-red-400">{errors.people}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg border ${isLight ? "border-gray-300 hover:bg-gray-100" : "border-white/10 hover:bg-white/5"} transition-colors`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default VictimRequestForm;
