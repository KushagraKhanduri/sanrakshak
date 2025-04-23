
import React from 'react';
import { HardHat, Hammer, LifeBuoy, House, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedTransition from '@/components/AnimatedTransition';
import BackButton from '@/components/BackButton';
import { useTheme } from '../context/ThemeProvider';

const RecoveryPlan = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AnimatedTransition>
          <div className="mt-16 mb-4"> {/* Added mt-16 to add top margin and prevent overlap with header */}
            <BackButton />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Disaster Recovery Plan</h1>
            <p className={isLight ? "text-gray-600" : "text-gray-400"}>Comprehensive strategy for rebuilding and recovery efforts</p>
          </div>
        </AnimatedTransition>

        <AnimatedTransition delay={50}>
          <div className={`mb-8 p-6 rounded-xl border ${isLight ? "border-gray-200 bg-white" : "border-white/10 glass-dark"}`}>
            <div className="flex items-center mb-4">
              <LifeBuoy className="h-6 w-6 mr-3" />
              <h2 className="text-xl font-semibold">Current Recovery Status: Phase 2 - Infrastructure Restoration</h2>
            </div>
            <div className="relative pt-2 pb-4">
              <div className={`h-2 ${isLight ? "bg-gray-100" : "bg-white/10"} rounded-full overflow-hidden`}>
                <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className={`flex justify-between text-xs ${isLight ? "text-gray-600" : "text-gray-400"} mt-2`}>
                <span>Emergency Response</span>
                <span>Infrastructure Restoration</span>
                <span>Community Rebuilding</span>
                <span>Long-term Recovery</span>
              </div>
            </div>
          </div>
        </AnimatedTransition>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AnimatedTransition delay={100}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardHat className="mr-2 h-5 w-5" />
                  Critical Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Power Grid</span>
                      </div>
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span>68% Restored</span>
                      </span>
                    </div>
                    <div className={`h-2 ${isLight ? "bg-gray-100" : "bg-white/10"} rounded-full overflow-hidden`}>
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span>Water System</span>
                      </div>
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span>82% Restored</span>
                      </span>
                    </div>
                    <div className={`h-2 ${isLight ? "bg-gray-100" : "bg-white/10"} rounded-full overflow-hidden`}>
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        <span>Road Network</span>
                      </div>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>45% Restored</span>
                      </span>
                    </div>
                    <div className={`h-2 ${isLight ? "bg-gray-100" : "bg-white/10"} rounded-full overflow-hidden`}>
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        <span>Communication</span>
                      </div>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>71% Restored</span>
                      </span>
                    </div>
                    <div className={`h-2 ${isLight ? "bg-gray-100" : "bg-white/10"} rounded-full overflow-hidden`}>
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>

          <AnimatedTransition delay={150}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <House className="mr-2 h-5 w-5" />
                  Housing & Shelter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-3 border ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"} rounded-lg`}>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                      <span>Displaced Residents</span>
                    </div>
                    <span className="text-xl font-semibold">1,247</span>
                  </div>
                  
                  <div className={`flex items-center justify-between p-3 border ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"} rounded-lg`}>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Temporary Shelters</span>
                    </div>
                    <span className="text-xl font-semibold">8</span>
                  </div>
                  
                  <div className={`flex items-center justify-between p-3 border ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"} rounded-lg`}>
                    <div className="flex items-center">
                      <Hammer className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Homes Under Repair</span>
                    </div>
                    <span className="text-xl font-semibold">342</span>
                  </div>
                  
                  <div className={`flex items-center justify-between p-3 border ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"} rounded-lg`}>
                    <div className="flex items-center">
                      <House className="h-4 w-4 mr-2 text-green-500" />
                      <span>Homes Restored</span>
                    </div>
                    <span className="text-xl font-semibold">128</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
        </div>

        <AnimatedTransition delay={200}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hammer className="mr-2 h-5 w-5" />
                Recovery Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className={`relative pl-8 border-l-2 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="mb-1">
                    <span className="text-xs bg-green-500/20 text-green-500 rounded-full px-2 py-0.5">Completed</span>
                    <span className={`ml-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Phase 1 | Days 1-14</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Emergency Response</h3>
                  <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Search and rescue operations, emergency medical services, temporary shelter establishment, and distribution of essential supplies.</p>
                </div>
                
                <div className={`relative pl-8 border-l-2 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div className="mb-1">
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 rounded-full px-2 py-0.5">In Progress</span>
                    <span className={`ml-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Phase 2 | Days 15-60</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Infrastructure Restoration</h3>
                  <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Restoration of power, water, roads, and communication systems. Damage assessment and debris removal in progress.</p>
                </div>
                
                <div className={`relative pl-8 border-l-2 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${isLight ? "bg-gray-400" : "bg-gray-500"}`}></div>
                  <div className="mb-1">
                    <span className={`text-xs ${isLight ? "bg-gray-200 text-gray-600" : "bg-gray-500/20 text-gray-400"} rounded-full px-2 py-0.5`}>Upcoming</span>
                    <span className={`ml-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Phase 3 | Days 61-180</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Community Rebuilding</h3>
                  <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Housing repairs and reconstruction, restoration of community facilities, schools, and healthcare facilities.</p>
                </div>
                
                <div className="relative pl-8">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${isLight ? "bg-gray-400" : "bg-gray-500"}`}></div>
                  <div className="mb-1">
                    <span className={`text-xs ${isLight ? "bg-gray-200 text-gray-600" : "bg-gray-500/20 text-gray-400"} rounded-full px-2 py-0.5`}>Upcoming</span>
                    <span className={`ml-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Phase 4 | Days 181+</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Long-term Recovery</h3>
                  <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Economic revitalization, implementing mitigation measures for future disasters, and addressing long-term community needs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default RecoveryPlan;
