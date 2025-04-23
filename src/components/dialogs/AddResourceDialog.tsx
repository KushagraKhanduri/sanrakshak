
import React, { useState } from 'react';
import { Package, Droplet, Pizza, Stethoscope, Home, ShoppingBag, Shield, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceCategory, Resource } from '@/hooks/useResourceData';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface AddResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: Omit<Resource, 'id' | 'timestamp'>) => Resource;
}

type ResourceTemplate = {
  title: string;
  icon: React.ReactNode;
  category: ResourceCategory;
  description: string;
};

const resourceTemplates: ResourceTemplate[] = [
  {
    title: 'Water Supply',
    icon: <Droplet className="h-5 w-5" />,
    category: 'water',
    description: 'Clean drinking water for distribution',
  },
  {
    title: 'Food Supply',
    icon: <Pizza className="h-5 w-5" />,
    category: 'food',
    description: 'Non-perishable food items and meal kits',
  },
  {
    title: 'Medical Supply',
    icon: <Stethoscope className="h-5 w-5" />,
    category: 'medical',
    description: 'First aid kits, medications, and medical equipment',
  },
  {
    title: 'Shelter',
    icon: <Home className="h-5 w-5" />,
    category: 'shelter',
    description: 'Temporary housing and shelter facilities',
  },
  {
    title: 'General Supplies',
    icon: <ShoppingBag className="h-5 w-5" />,
    category: 'supplies',
    description: 'Clothing, hygiene products, and other essential supplies',
  },
  {
    title: 'Safety Equipment',
    icon: <Shield className="h-5 w-5" />,
    category: 'safety',
    description: 'Safety equipment like flashlights, radios, and protective gear',
  },
];

const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ isOpen, onClose, onAddResource }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ResourceTemplate | null>(null);
  const [step, setStep] = useState<'template' | 'details' | 'custom'>('template');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    location: '',
    contact: '',
  });
  
  const customForm = useForm({
    defaultValues: {
      title: '',
      category: 'supplies' as ResourceCategory,
      description: '',
      quantity: '1',
      location: '',
      contact: '',
    }
  });
  
  const resetForm = () => {
    setSelectedTemplate(null);
    setStep('template');
    setFormData({
      title: '',
      description: '',
      quantity: '',
      location: '',
      contact: '',
    });
    customForm.reset();
  };
  
  const handleSelectTemplate = (template: ResourceTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      title: template.title,
      description: template.description,
    });
    setStep('details');
  };
  
  const handleSelectCustom = () => {
    setSelectedTemplate(null);
    setStep('custom');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    if (!selectedTemplate) return;
    
    // Validate form
    if (!formData.title || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const resource: Omit<Resource, 'id' | 'timestamp'> = {
      type: 'offer',
      category: selectedTemplate.category,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      contact: formData.contact,
      items: formData.quantity ? [{ name: selectedTemplate.title, quantity: parseInt(formData.quantity) || 0 }] : undefined,
    };
    
    onAddResource(resource);
    toast.success('Resource added successfully');
    onClose();
    resetForm();
  };
  
  const handleCustomSubmit = (data: any) => {
    const resource: Omit<Resource, 'id' | 'timestamp'> = {
      type: 'offer',
      category: data.category,
      title: data.title,
      description: data.description,
      location: data.location,
      contact: data.contact,
      items: data.quantity ? [{ name: data.title, quantity: parseInt(data.quantity) || 0 }] : undefined,
    };
    
    onAddResource(resource);
    toast.success('Custom resource added successfully');
    onClose();
    resetForm();
  };
  
  const handleCancel = () => {
    if (step === 'details' || step === 'custom') {
      setStep('template');
    } else {
      onClose();
      resetForm();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5" />
            {step === 'template' ? 'Add New Resource' : 
             step === 'custom' ? 'Create Custom Resource' : 'Resource Details'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {step === 'template' 
              ? 'Select the type of resource you want to add or create a custom one' 
              : step === 'custom'
              ? 'Define your custom resource details'
              : 'Provide details about the resource'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'template' ? (
          <>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {resourceTemplates.map((template, index) => (
                <button
                  key={index}
                  className="p-4 border border-black/40 rounded-lg dark:bg-slate-800 hover:bg-white/5 do-white dark:hover:scale-105 dark:hover:shadow-lg transition-all text-left"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-black dark:text-white">
                      {template.icon}
                    </div>
                    <h3 className="font-medium text-black dark:text-white">{template.title}</h3>
                  </div>
                  <p className="text-xs text-black dark:text-white">{template.description}</p>
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                className="w-full p-4 border border-dashed border-black/40 rounded-lg hover:bg-white/5 transition-colors text-left"
                onClick={handleSelectCustom}
              >
                <div className="flex items-center gap-2">
                  <div className="text-black dark:text-white">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-black dark:text-white">Custom Resource</h3>
                </div>
                <p className="text-xs text-black dark:text-white mt-1">Create a resource that doesn't fit the templates above</p>
              </button>
            </div>
          </>
        ) : step === 'custom' ? (
          <div className="mt-2">
            <Form {...customForm}>
              <form onSubmit={customForm.handleSubmit(handleCustomSubmit)} className="space-y-4">
                <FormField
                  control={customForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Resource Title *</FormLabel>
                      <FormControl>
                        <Input className="border-black/40" placeholder="Enter resource title" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={customForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-black/40">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="shelter">Shelter</SelectItem>
                          <SelectItem value="supplies">Supplies</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={customForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Description</FormLabel>
                      <FormControl>
                        <Input className="border-black/40" placeholder="Brief description of the resource" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={customForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-white">Quantity</FormLabel>
                        <FormControl>
                          <Input className="border-black/40 text-black dark:text-white" type="number" min="1" placeholder="Amount available" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label className="text-black dark:text-white">Status</Label>
                    <Select defaultValue="available">
                      <SelectTrigger className="border-black/40">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <FormField
                  control={customForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Location *</FormLabel>
                      <FormControl>
                        <Input className="border-black/40" placeholder="Where is this resource stored/available" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={customForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Contact Information</FormLabel>
                      <FormControl>
                        <Input className="border-black/40 " placeholder="Phone number or email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6 ">
                  <Button variant="outline" className="text-black dark:text-white" onClick={handleCancel} type="button">
                    Back
                  </Button>
                  <Button type="submit">
                    Add Custom Resource
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-black dark:text-white" htmlFor="title">Resource Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter resource title"
                  className="border-black/40 text-black dark:text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-black dark:text-white" htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the resource"
                  className="border-black/40 text-black dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black dark:text-white" htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Amount available"
                    className="border-black/40"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-black dark:text-white">Status</Label>
                  <Select defaultValue="available">
                    <SelectTrigger className="border-black/40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-black dark:text-white" htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Where is this resource stored/available"
                  className="border-black/40"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-black dark:text-white" htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Phone number or email"
                  className="border-black/40"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" className="text-black dark:text-white" onClick={handleCancel}>
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Add Resource
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceDialog;
