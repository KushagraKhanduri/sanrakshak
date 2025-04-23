import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, MapPin, Clock, User, Phone, MessageCircle, Bookmark, Share2, Flag } from 'lucide-react';

const ResourceDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock resource data based on ID
  // In a real app, this would be fetched from an API
  const resourceMap: { [key: string]: any } = {
    'resource-1': {
      type: 'need',
      category: 'water',
      title: 'Clean Drinking Water',
      description: "Urgently need bottled water for family of 4, including infant. We have been without clean water for 2 days and have tried filtering but it's still not safe to drink. Any help would be greatly appreciated.",
      location: 'Madan Mahal, Jabalpur',
      createdBy: 'Maria Rodriguez',
      contact: '555-123-4567',
      postedTime: '6 hours ago',
      urgent: true,
      status: 'Open',
    },
    'resource-2': {
      type: 'offer',
      category: 'shelter',
      title: 'Temporary Housing Available',
      description: 'Can accommodate up to 3 people in spare rooms. Has generator and supplies. House is on high ground and has not been affected by flooding. We have extra bedding, food, and can provide transportation if needed.',
      location: 'Civil Lines, Jabalpur',
      createdBy: 'James Wilson',
      contact: '555-987-6543',
      postedTime: '8 hours ago',
      urgent: false,
      status: 'Open',
    },
    'resource-3': {
      type: 'need',
      category: 'medical',
      title: 'Diabetes Medication',
      description: 'Need insulin and blood sugar testing supplies. Current supply will run out in less than 24 hours. Type 1 diabetic in urgent need. Can meet anywhere in the downtown area.',
      location: 'Napier Town, Jabalpur',
      createdBy: 'Robert Johnson',
      contact: '555-333-7777',
      postedTime: '3 hours ago',
      urgent: true,
      status: 'Open',
    },
    'resource-4': {
      type: 'offer',
      category: 'food',
      title: 'Hot Meals Available',
      description: 'Serving hot meals from 12-2pm daily. Can deliver to elderly or disabled. We have a team of volunteers preparing nutritious meals. Menu changes daily but always includes vegetarian options.',
      location: 'Gol Bazar Community Center, Jabalpur',
      createdBy: 'Community Relief Team',
      contact: '555-444-9999',
      postedTime: '12 hours ago',
      urgent: false,
      status: 'Open',
    },
  };
  
  const resource = resourceMap[id || ''] || {
    type: 'unknown',
    category: 'other',
    title: 'Resource Not Found',
    description: 'The requested resource could not be found.',
    location: 'Unknown',
    createdBy: 'Unknown',
    postedTime: 'Unknown',
    urgent: false,
    status: 'Closed',
  };
  
  const getCategoryIcon = () => {
    switch (resource.category) {
      case 'water':
        return '💧';
      case 'food':
        return '🍲';
      case 'shelter':
        return '🏠';
      case 'medical':
        return '💊';
      default:
        return '📦';
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header emergency={true} />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link to="/resources" className="flex items-center text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Resources</span>
            </Link>
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{getCategoryIcon()}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    resource.type === 'need' ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-300'
                  }`}>
                    {resource.type === 'need' ? 'NEEDED' : 'OFFERED'}
                  </span>
                  {resource.urgent && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-black">
                      URGENT
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold">{resource.title}</h1>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Bookmark size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Share2 size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Flag size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-300">{resource.description}</p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-400">
                    <MapPin size={18} className="mr-3" />
                    <span>{resource.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <Clock size={18} className="mr-3" />
                    <span>Posted {resource.postedTime}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <User size={18} className="mr-3" />
                    <span>Posted by {resource.createdBy}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Status</h2>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    resource.status === 'Open' ? 'bg-white/10 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {resource.status}
                  </span>
                </div>
                
                <div className="border-t border-white/10 my-4 pt-4">
                  <h3 className="font-medium mb-2">Updates</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">Resource created</span>
                        <span className="text-xs text-gray-500">{resource.postedTime}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {resource.createdBy} {resource.type === 'need' ? 'requested' : 'offered'} this resource
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                
                {resource.contact ? (
                  <>
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-1">Phone</div>
                      <div className="flex items-center">
                        <div className="font-mono">{resource.contact}</div>
                        <button className="ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors">
                          <Phone size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center">
                        <Phone size={16} className="mr-2" />
                        <span>Call</span>
                      </button>
                      
                      <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/15 rounded-lg transition-colors flex items-center justify-center">
                        <MessageCircle size={16} className="mr-2" />
                        <span>Message</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No contact information provided. Use the message button to reach out.
                  </p>
                )}
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Similar Resources</h2>
                
                <div className="space-y-3">
                  <Link to="/resources" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">💧</span>
                      <div>
                        <p className="text-sm font-medium">Water Distribution</p>
                        <p className="text-xs text-gray-400">0.5 miles away</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/resources" className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">🍲</span>
                      <div>
                        <p className="text-sm font-medium">Food Bank Open</p>
                        <p className="text-xs text-gray-400">1.2 miles away</p>
                      </div>
                    </div>
                  </Link>
                  
                  <button className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors mt-2">
                    View all similar resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourceDetails;
