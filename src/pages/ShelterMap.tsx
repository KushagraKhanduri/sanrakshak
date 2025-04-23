import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { ArrowLeft, MapPin, Navigation, Compass, Route, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

const ShelterMap = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { toast } = useToast();
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Color scheme matching other pages
  const colors = {
    primary: isLight ? '#6366F1' : '#818CF8',
    secondary: isLight ? '#10B981' : '#34D399',
    danger: isLight ? '#EF4444' : '#F87171',
    warning: isLight ? '#F59E0B' : '#FBBF24',
    accent: isLight ? '#EC4899' : '#F472B6',
    background: isLight ? '#F8FAFC' : '#0F172A',
    card: isLight ? '#FFFFFF' : '#1E293B',
    text: isLight ? '#334155' : '#E2E8F0',
    border: isLight ? '#E2E8F0' : '#334155'
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  const handleNavigateToShelter = (shelter) => {
    setSelectedShelter(shelter);
    setDialogOpen(true);
    setShowRoute(false);
    
    toast({
      title: "Shelter Selected",
      description: `Selected ${shelter.name}`,
    });
  };

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            console.log("User location acquired:", position);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationPermissionDenied(true);
            toast({
              title: "Location Error",
              description: "Could not access your location. Some features may be limited.",
              variant: 'destructive'
            });
          }
        );
      } else {
        setLocationPermissionDenied(true);
        toast({
          title: "Location Not Supported",
          description: "Your browser does not support geolocation.",
          variant: 'destructive'
        });
      }
    };
    
    getUserLocation();
    loadDefaultMap();
  }, [toast]);

  const loadDefaultMap = () => {
    const mapIframe = document.getElementById('shelter-map');
    if (mapIframe) {
      const defaultSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBtLRkfZb_SQHkRxsLYgQWs04vT1WLKNSE&center=23.1636,79.9548&zoom=13&maptype=roadmap`;
      mapIframe.setAttribute('src', defaultSrc);
      setMapLoaded(true);
    }
  };

  const handleShowOnMap = useCallback(() => {
    if (selectedShelter) {
      const mapIframe = document.getElementById('shelter-map') as HTMLIFrameElement;
      if (mapIframe) {
        const newSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBtLRkfZb_SQHkRxsLYgQWs04vT1WLKNSE&q=${selectedShelter.coordinates.lat},${selectedShelter.coordinates.lng}&zoom=15&maptype=roadmap`;
        mapIframe.src = newSrc;
      }
      
      setDialogOpen(false);
      setShowRoute(false);
      
      toast({
        title: "Shelter Location",
        description: `Showing ${selectedShelter.name} on map`,
      });
    }
  }, [selectedShelter, toast]);

  const handleShowRoute = useCallback(() => {
    if (selectedShelter && userLocation && !locationPermissionDenied) {
      const mapIframe = document.getElementById('shelter-map') as HTMLIFrameElement;
      if (mapIframe) {
        const userLat = userLocation.lat;
        const userLng = userLocation.lng;
        const destLat = selectedShelter.coordinates.lat;
        const destLng = selectedShelter.coordinates.lng;
        
        const newSrc = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBtLRkfZb_SQHkRxsLYgQWs04vT1WLKNSE&origin=${userLat},${userLng}&destination=${destLat},${destLng}&mode=driving`;
        mapIframe.src = newSrc;
      }
      
      setDialogOpen(false);
      setShowRoute(true);
      
      toast({
        title: "Route Displayed",
        description: `Showing route to ${selectedShelter.name}`,
      });
    } else {
      toast({
        title: "Location Required",
        description: "Your location is needed to show the route. Please enable location services.",
        variant: 'destructive'
      });
    }
  }, [selectedShelter, userLocation, locationPermissionDenied, toast]);

  const shelters = [
    {
      id: 1,
      name: "Rani Durgavati University Shelter",
      address: "Saraswati Vihar, Pachpedi, Jabalpur",
      capacity: 220,
      occupancy: 135,
      amenities: ["Food", "Water", "Medical", "Power"],
      coordinates: { lat: 23.1759, lng: 79.9821 }
    },
    {
      id: 2,
      name: "Model School Adhartal",
      address: "Adhartal, Jabalpur",
      capacity: 180,
      occupancy: 92,
      amenities: ["Food", "Water", "Power", "Pet Friendly"],
      coordinates: { lat: 23.1988, lng: 79.9409 }
    },
    {
      id: 3,
      name: "St. Aloysius College Relief Center",
      address: "Sadar, Jabalpur",
      capacity: 250,
      occupancy: 121,
      amenities: ["Food", "Water", "Medical", "Wifi"],
      coordinates: { lat: 23.1655, lng: 79.9422 }
    }
  ];
  
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.background }}>
      <Header title="Shelter Map" />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <Button 
            onClick={handleGoBack}
            variant="ghost"
            className={`mb-4 flex items-center gap-1.5 ${
              isLight ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-200 hover:bg-white/10'
            }`}
            aria-label="Go back to dashboard"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className={`rounded-xl overflow-hidden h-[70vh] backdrop-blur-sm ${
                isLight ? 'bg-white/80 border border-gray-200' : 'bg-black/20 border border-gray-700'
              }`}>
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className={`animate-spin rounded-full h-10 w-10 border-t-2 ${
                        isLight ? 'border-gray-800' : 'border-white'
                      } mb-4`}></div>
                      <p className={isLight ? 'text-gray-800' : 'text-white'}>Loading map...</p>
                    </div>
                  </div>
                )}
                <iframe 
                  id="shelter-map"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shelter Map"
                  className="w-full h-full"
                  onLoad={() => setMapLoaded(true)}
                />
                
                {userLocation && mapLoaded && (
                  <div className={`absolute bottom-4 left-4 px-3 py-2 rounded-lg text-sm backdrop-blur-sm ${
                    isLight ? 'bg-white/80 border border-gray-200 text-gray-800' : 'bg-black/60 border border-gray-600 text-white'
                  }`}>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      <span>Your location is available</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`rounded-xl p-4 h-[70vh] overflow-auto backdrop-blur-sm ${
              isLight ? 'bg-white/80 border border-gray-200' : 'bg-black/20 border border-gray-700'
            }`}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>Nearby Shelters</h2>
              
              <div className="space-y-4">
                {shelters.map(shelter => (
                  <div key={shelter.id} className={`rounded-lg p-3 transition-colors backdrop-blur-sm ${
                    isLight 
                      ? 'border border-gray-200 bg-white/70 hover:bg-white/90' 
                      : 'border border-gray-700 bg-slate-900 hover:bg-black/50'
                  }`}>
                    <h3 className="font-medium" style={{ color: colors.text }}>{shelter.name}</h3>
                    <p className="text-sm mb-2" style={{ color: colors.text, opacity: 0.9 }}>{shelter.address}</p>
                    <div className="text-xs mb-2 space-y-1" style={{ color: colors.text, opacity: 0.8 }}>
                      <p>Capacity: {shelter.capacity} people</p>
                      <p>Status: Open ({Math.round((shelter.occupancy / shelter.capacity) * 100)}% full)</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {shelter.amenities.map(amenity => (
                          <span 
                            key={amenity} 
                            className="inline-block px-2 py-0.5 rounded-full text-xs"
                            style={{
                              backgroundColor: isLight ? 'rgba(226, 232, 240, 0.7)' : 'rgba(30, 41, 59, 0.7)',
                              color: colors.text
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleNavigateToShelter(shelter)}
                      size="sm" 
                      className="w-full mt-2 rounded-2xl"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                        color: 'white'
                      }}
                    >
                      Navigate
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className="rounded-2xl backdrop-blur-sm"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: colors.text }}>{selectedShelter?.name || 'Shelter Details'}</DialogTitle>
            <DialogDescription>
              {selectedShelter ? (
                <div className="space-y-2 mt-1">
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2" style={{ color: colors.text, opacity: 0.8 }} />
                    <span style={{ color: colors.text, opacity: 0.9 }}>{selectedShelter.address}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Compass size={16} className="mr-2" style={{ color: colors.text, opacity: 0.8 }} />
                    <span style={{ color: colors.text, opacity: 0.9 }}>Capacity: {selectedShelter.capacity} people</span>
                  </div>
                  <div className={`rounded-lg border p-2 mt-4 text-sm`}
                    style={{
                      backgroundColor: isLight ? 'rgba(226, 232, 240, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                      borderColor: colors.border
                    }}
                  >
                    <span className="text-xs uppercase font-medium" style={{ color: colors.text, opacity: 0.8 }}>Amenities</span>
                    <div className="font-medium mt-1 flex flex-wrap gap-1">
                      {selectedShelter.amenities.map(amenity => (
                        <span 
                          key={amenity} 
                          className="inline-block px-2 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: isLight ? 'rgba(226, 232, 240, 0.7)' : 'rgba(30, 41, 59, 0.7)',
                            color: colors.text
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <span style={{ color: colors.text }}>Loading shelter details...</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row pt-2">
            <Button 
              onClick={handleShowRoute}
              className="w-full flex items-center justify-center rounded-2xl"
              variant="default"
              disabled={locationPermissionDenied || !userLocation}
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                color: 'white'
              }}
            >
              {locationPermissionDenied || !userLocation ? (
                <Ban className="mr-2 h-4 w-4" />
              ) : (
                <Route className="mr-2 h-4 w-4" />
              )}
              Show Route
            </Button>
            <Button 
              onClick={handleShowOnMap}
              className="w-full rounded-2xl"
              variant="secondary"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`,
                color: 'white'
              }}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Show on Map
            </Button>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                style={{
                  color: colors.text,
                  borderColor: colors.border
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShelterMap;