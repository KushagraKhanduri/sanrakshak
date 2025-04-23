
import React from 'react';
import { MonitorPlay, Network, AlertCircle, Clock, Radio, Shield, Users, MapPin, BarChart4 } from 'lucide-react';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusUpdate from '@/components/StatusUpdate';
import BackButton from '@/components/BackButton';

const CommandCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AnimatedTransition>
          <div className="mt-16 mb-4"> {/* Added mt-16 to add top margin and prevent overlap with header */}
            <BackButton />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Command Center</h1>
            <p className="text-gray-400">Central hub for disaster response coordination and resource management</p>
          </div>
        </AnimatedTransition>

        <AnimatedTransition delay={50}>
          <div className="mb-8 p-6 rounded-xl border border-white/10 glass-dark">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center mb-2">
                  <AlertCircle size={18} className="mr-2 text-red-500" />
                  <h2 className="text-xl font-semibold">Active Emergency: Hurricane Impact - Level 3</h2>
                </div>
                <p className="text-gray-300 text-sm">
                  Coordinated response in progress. 12 agencies mobilized. 8 emergency protocols active.
                </p>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-sm">Active for: 3 days, 8 hours</span>
              </div>
            </div>
          </div>
        </AnimatedTransition>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedTransition delay={100}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Radio className="mr-2 h-5 w-5" />
                  Communication Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Emergency Services</span>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Online</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Command Channel</span>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Online</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Public Broadcasting</span>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Limited</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span>Satellite Link</span>
                    </div>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Offline</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
          
          <AnimatedTransition delay={150}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Response Units
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Medical Teams</span>
                    </div>
                    <span className="text-sm font-medium">12 Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Search & Rescue</span>
                    </div>
                    <span className="text-sm font-medium">8 Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Fire Departments</span>
                    </div>
                    <span className="text-sm font-medium">5 Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Police Units</span>
                    </div>
                    <span className="text-sm font-medium">10 Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Critical Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span>South District</span>
                    </div>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Critical</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Central Hospital</span>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">At Risk</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Highway 95 Bridge</span>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">At Risk</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>West Evacuation Route</span>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Secure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AnimatedTransition delay={250} className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <MonitorPlay className="mr-2 h-5 w-5" />
                    Live Incident Feed
                  </CardTitle>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs">
                    <Clock size={12} className="mr-1" />
                    <span>Live</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <StatusUpdate
                    id="cmd-status-1"
                    title="Flooding in South District"
                    message="Water levels rising to critical levels. Evacuation in progress. 3 emergency teams deployed."
                    source="Emergency Management"
                    timestamp="10 minutes ago"
                    priority="high"
                  />
                  
                  <StatusUpdate
                    id="cmd-status-2"
                    title="Bridge Structural Issues"
                    message="Highway 95 bridge showing signs of structural damage. Engineering team dispatched. Traffic diverted."
                    source="Transportation Department"
                    timestamp="45 minutes ago"
                    priority="high"
                  />
                  
                  <StatusUpdate
                    id="cmd-status-3"
                    title="Power Restoration Update"
                    message="North grid restored. East sector still experiencing outages. Estimated repair time: 6 hours."
                    source="Power Authority"
                    timestamp="1 hour ago"
                    priority="medium"
                  />
                  
                  <StatusUpdate
                    id="cmd-status-4"
                    title="Medical Supply Delivery"
                    message="Medical supplies successfully delivered to Central Hospital. Inventory includes emergency medications and critical care equipment."
                    source="Health Department"
                    timestamp="2 hours ago"
                    priority="medium"
                  />
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
          
          <AnimatedTransition delay={300}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5" />
                  Resource Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Medical Supplies</span>
                      <span>72%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Emergency Personnel</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Shelter Capacity</span>
                      <span>63%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '63%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Food & Water</span>
                      <span>47%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '47%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button className="w-full py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 transition-colors">
                      Request Additional Resources
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
        </div>
        
        <AnimatedTransition delay={350}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Network className="mr-2 h-5 w-5" />
                Agency Coordination Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Emergency Services</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Public Health</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Transportation</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Limited</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Utilities</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Limited</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>National Guard</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Weather Service</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Local Police</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span>Coast Guard</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Offline</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default CommandCenter;
