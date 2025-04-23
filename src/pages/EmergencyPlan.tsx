
import React from 'react';
import Header from '../components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useTheme } from '../context/ThemeProvider';
import BackButton from '@/components/BackButton';

const EmergencyPlan = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedTransition>
            <div className="mb-4">
              <BackButton />
            </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Emergency Response Plan</h1>
              <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                Follow these guidelines during an emergency situation
              </p>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={50}>
            <div className={`rounded-xl border ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-black/10"} p-6 mb-8`}>
              <h2 className="text-xl font-semibold mb-4">Immediate Actions</h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                  <h3 className="font-medium mb-2">1. Ensure Safety</h3>
                  <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                    Move to a safe location away from immediate danger. If indoors during an earthquake, stay away from windows 
                    and take cover under sturdy furniture. If outdoors, move to an open area away from buildings and powerlines.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                  <h3 className="font-medium mb-2">2. Check for Injuries</h3>
                  <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                    Assess yourself and others for injuries. Provide first aid if you're trained. Don't move 
                    seriously injured people unless they're in immediate danger.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                  <h3 className="font-medium mb-2">3. Contact Emergency Services</h3>
                  <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                    Call local emergency number (911 in US) if services are operational. If phone lines are down, 
                    try text messages or emergency feature on mobile devices which may work even without service.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                  <h3 className="font-medium mb-2">4. Listen for Information</h3>
                  <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                    Turn on a battery-powered or hand-crank radio to get emergency broadcasts. Check official 
                    emergency notification systems on your phone for updates and instructions.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedTransition>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <AnimatedTransition delay={100}>
              <div className={`rounded-xl border ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-black/10"} p-6 h-full`}>
                <h2 className="text-xl font-semibold mb-4">Evacuation Guidelines</h2>
                
                <ul className="space-y-3">
                  <li className="flex">
                    <span className={`h-6 w-6 rounded-full ${isLight ? "bg-blue-100 text-blue-800" : "bg-blue-900/50 text-blue-300"} flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0`}>1</span>
                    <p>Evacuate immediately if instructed by authorities or if you're in danger.</p>
                  </li>
                  
                  <li className="flex">
                    <span className={`h-6 w-6 rounded-full ${isLight ? "bg-blue-100 text-blue-800" : "bg-blue-900/50 text-blue-300"} flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0`}>2</span>
                    <p>Grab your emergency kit if it's safe to do so, but don't delay evacuation.</p>
                  </li>
                  
                  <li className="flex">
                    <span className={`h-6 w-6 rounded-full ${isLight ? "bg-blue-100 text-blue-800" : "bg-blue-900/50 text-blue-300"} flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0`}>3</span>
                    <p>Know your evacuation routes in advance. Have backup routes planned.</p>
                  </li>
                  
                  <li className="flex">
                    <span className={`h-6 w-6 rounded-full ${isLight ? "bg-blue-100 text-blue-800" : "bg-blue-900/50 text-blue-300"} flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0`}>4</span>
                    <p>If driving, keep windows closed and ventilation systems off if air quality is poor.</p>
                  </li>
                  
                  <li className="flex">
                    <span className={`h-6 w-6 rounded-full ${isLight ? "bg-blue-100 text-blue-800" : "bg-blue-900/50 text-blue-300"} flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0`}>5</span>
                    <p>Head to designated emergency shelters if you have nowhere else to go.</p>
                  </li>
                  
                  <li className="flex">
                    <span className={`h-6 w-6 rounded-full ${isLight ? "bg-blue-100 text-blue-800" : "bg-blue-900/50 text-blue-300"} flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0`}>6</span>
                    <p>Inform friends or family of your location when it's safe to do so.</p>
                  </li>
                </ul>
              </div>
            </AnimatedTransition>
            
            <AnimatedTransition delay={150}>
              <div className={`rounded-xl border ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-black/10"} p-6 h-full`}>
                <h2 className="text-xl font-semibold mb-4">Emergency Supplies</h2>
                
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                    <h3 className="font-medium mb-1">Water</h3>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      One gallon per person per day for at least three days
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                    <h3 className="font-medium mb-1">Food</h3>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Non-perishable food for at least three days
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                    <h3 className="font-medium mb-1">Medical Supplies</h3>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      First aid kit, medications, masks, sanitizer
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                    <h3 className="font-medium mb-1">Tools & Communication</h3>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Flashlight, radio, batteries, phone charger, whistle
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                    <h3 className="font-medium mb-1">Important Documents</h3>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      ID, insurance policies, bank records (physical or digital backups)
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          </div>
          
          <AnimatedTransition delay={200}>
            <div className={`rounded-xl border ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-black/10"} p-6`}>
              <h2 className="text-xl font-semibold mb-4">Communication Plan</h2>
              
              <div className="space-y-4">
                <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                  Establish a family communication plan before disaster strikes:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                    <h3 className="font-medium mb-2">Emergency Contacts</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Local Emergency:</span>
                        <span className="font-medium">911</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Out-of-Area Contact:</span>
                        <span className="font-medium">[Designate Someone]</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Emergency Management Office:</span>
                        <span className="font-medium">[Local Number]</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                    <h3 className="font-medium mb-2">Meeting Places</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Near Home:</span>
                        <span className="font-medium">[Location]</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Outside Neighborhood:</span>
                        <span className="font-medium">[Location]</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Regional Evacuation Site:</span>
                        <span className="font-medium">[Location]</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50 border border-gray-200" : "bg-black/10 border border-white/10"}`}>
                  <h3 className="font-medium mb-2">Communication Tips</h3>
                  <ul className="space-y-2">
                    <li className="flex items-baseline">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2 flex-shrink-0"></span>
                      <span>Text messages may get through when calls don't.</span>
                    </li>
                    <li className="flex items-baseline">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2 flex-shrink-0"></span>
                      <span>Conserve phone battery by limiting usage.</span>
                    </li>
                    <li className="flex items-baseline">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2 flex-shrink-0"></span>
                      <span>Use social media to mark yourself safe when possible.</span>
                    </li>
                    <li className="flex items-baseline">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2 flex-shrink-0"></span>
                      <span>Have a battery-powered or hand-crank radio for emergency broadcasts.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </main>
    </div>
  );
};

export default EmergencyPlan;
