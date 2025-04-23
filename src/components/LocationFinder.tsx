import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Compass, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { MapResource } from '@/pages/Map';

interface LocationPoint {
  id: string;
  name: string;
  type: 'shelter' | 'medical' | 'food' | 'water';
  distance: string;
  address: string;
  available: boolean;
}

interface LocationFinderProps {
  className?: string;
  mapResources?: MapResource[];
  onNavigate?: (resource: MapResource) => void;
}

const SAMPLE_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc1',
    name: 'Rani Durgavati University Emergency Shelter',
    type: 'shelter',
    distance: '2.3 miles',
    address: 'Saraswati Vihar, Pachpedi, Jabalpur',
    available: true,
  },
  {
    id: 'loc2',
    name: 'Victoria Hospital',
    type: 'medical',
    distance: '1.5 miles',
    address: 'Wright Town, Jabalpur',
    available: true,
  },
  {
    id: 'loc3',
    name: 'Gol Bazar Relief Center',
    type: 'food',
    distance: '0.8 miles',
    address: 'Gol Bazar, Jabalpur',
    available: true,
  },
  {
    id: 'loc4',
    name: 'Bhedaghat Water Distribution',
    type: 'water',
    distance: '8.2 miles',
    address: 'Bhedaghat, Jabalpur',
    available: false,
  },
];

const LocationFinder: React.FC<LocationFinderProps> = ({ className, mapResources, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation(position);
          console.log('Location acquired:', position);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleNavigate = (locationId: string | number) => {
    navigate('/map', { state: { selectedLocationId: locationId } });
  };

  const locationsToDisplay = mapResources 
    ? mapResources.map(resource => ({
        id: resource.id.toString(),
        name: resource.name,
        type: resource.type.toLowerCase() as 'shelter' | 'medical' | 'food' | 'water',
        distance: `${resource.distance} miles`,
        address: resource.address,
        available: true,
        coordinates: resource.coordinates,
        originalResource: resource
      }))
    : SAMPLE_LOCATIONS;

  const filteredLocations = locationsToDisplay.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToResource = (location: any) => {
    if (mapResources && onNavigate && location.originalResource) {
      onNavigate(location.originalResource);
    } else {
      handleNavigate(location.id);
    }
  };

  return (
    <div className={cn(
      'rounded-xl overflow-hidden h-full flex flex-col shadow-2xl shadow-black/30',
      isLight ? 'bg-white ' : 'bg-black/30 border-gray-700',
      className
    )}>
      <div className="p-4 flex flex-col h-full">
        <h2 className={cn(
          "text-lg font-semibold mb-4",
          isLight ? "text-black" : "text-white"
        )}>Find Nearby Assistance</h2>
        
        <div className="flex mb-4">
          <div className="relative flex-1">
            <Search size={16} className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2",
              isLight ? "text-gray-600" : "text-gray-400"
            )} />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full rounded-l-lg py-2 pl-9 pr-3 text-sm placeholder-gray-600 focus:outline-none focus:ring-1",
                isLight 
                  ? "bg-gray-100 border border-gray-300 focus:ring-gray-400 text-black" 
                  : "bg-gray-800 border border-gray-600 focus:ring-gray-500 text-white placeholder-gray-400"
              )}
            />
          </div>
          <button 
            onClick={handleGetLocation}
            className={cn(
              "flex items-center justify-center transition-colors rounded-r-lg px-4",
              isLight 
                ? "bg-gray-200 hover:bg-gray-300 border border-gray-300 border-l-0" 
                : "bg-gray-700 hover:bg-gray-600 border border-gray-600 border-l-0"
            )}
            aria-label="Get current location"
          >
            <Compass size={18} className={isLight ? "text-black" : "text-white"} />
          </button>
        </div>
        
        {currentLocation && (
          <div className={cn(
            "rounded-lg p-2 mb-4 text-xs border",
            isLight ? "bg-gray-100 border-gray-300 text-black" : "bg-gray-800 border-gray-600 text-white"
          )}>
            <div className="flex items-center">
              <MapPin size={14} className={cn(
                "mr-1",
                isLight ? "text-gray-600" : "text-gray-400"
              )} />
              <span>
                Location acquired. Showing nearby resources.
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-3 pr-1 flex-grow">
          {filteredLocations.map(location => (
            <div 
              key={location.id}
              className={cn(
                'rounded-lg p-3 transition-all drop-shadow-lg hover:shadow-xl hover:scale-105',
                isLight
                  ? (location.available 
                      ? 'bg-white border-gray-300 hover:bg-gray-50' 
                      : 'bg-gray-50 border-gray-300 opacity-70')
                  : (location.available 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-black/20 border-white/5 opacity-70')
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={cn(
                    "font-medium text-sm",
                    isLight ? "text-black" : "text-white"
                  )}>{location.name}</h3>
                  <p className={cn(
                    "text-xs mt-0.5",
                    isLight ? "text-black" : "text-gray-300"
                  )}>{location.address}</p>
                </div>
                <div className={cn(
                  "text-xs rounded-full px-2 py-0.5 border",
                  isLight 
                    ? "bg-gray-100 border-gray-300 text-black" 
                    : "bg-gray-700 border-gray-600 text-white"
                )}>
                  {location.distance}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <span className={cn(
                  "capitalize text-xs px-2 py-0.5 rounded-full border",
                  isLight 
                    ? "bg-gray-100 border-gray-300 text-black" 
                    : "bg-gray-700 border-gray-600 text-white"
                )}>
                  {location.type}
                </span>
                <button 
                  className={cn(
                    'text-xs rounded-full px-3 py-1',
                    location.available
                      ? (isLight 
                          ? 'bg-blue-700 text-white hover:bg-black/90 rounded-2xl' 
                          : 'bg-white text-black hover:bg-gray-200 rounded-2xl')
                      : (isLight 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed rounded-2xl' 
                          : 'bg-black/30 text-gray-400 cursor-not-allowed rounded-2xl')
                  )}
                  disabled={!location.available}
                  onClick={() => location.available && navigateToResource(location)}
                >
                  Navigate
                </button>
              </div>
            </div>
          ))}
          
          {filteredLocations.length === 0 && (
            <div className={cn(
              "text-center py-6 text-sm border rounded-lg",
              isLight 
                ? "text-black border-gray-300 bg-gray-50" 
                : "text-gray-300 border-white/5 bg-black/20"
            )}>
              No locations found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFinder;