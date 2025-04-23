
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ArrowLeft, Trophy, Clock, CheckCircle, User, Heart, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';

// Component for stat cards
const StatCard = ({ 
  icon, 
  value, 
  label, 
  description 
}: { 
  icon: React.ReactNode; 
  value: string | number; 
  label: string; 
  description?: string;
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <div className={`p-6 rounded-xl ${
      isLight ? 'bg-white border border-gray-200 shadow-sm' : 'bg-black/30 border border-white/10'
    }`}>
      <div className="flex items-start">
        <div className={`p-3 rounded-full mr-4 ${
          isLight ? 'bg-gray-100' : 'bg-white/10'
        }`}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{label}</div>
          {description && (
            <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const VolunteerStats = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const activities = [
    {
      type: 'Task Completed',
      title: 'Delivered Medical Supplies',
      date: '2 days ago',
      points: 15
    },
    {
      type: 'Hours Volunteered',
      title: 'Shelter Support',
      date: '4 days ago',
      hours: 4,
      points: 20
    },
    {
      type: 'Task Completed',
      title: 'Food Delivery',
      date: '1 week ago',
      points: 15
    },
    {
      type: 'Special Recognition',
      title: 'First Responder Badge',
      date: '2 weeks ago',
      points: 50
    }
  ];

  return (
    <div className={`min-h-screen ${isLight ? 'bg-white' : 'bg-background'}`}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex items-center">
              <Link to="/volunteer-tasks" className={`mr-2 p-2 rounded-full ${
                isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              } transition-colors`}>
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold">Volunteer Statistics</h1>
            </div>
            <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Track your impact and contributions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnimatedTransition delay={0}>
              <StatCard 
                icon={<Clock size={24} />}
                value={27}
                label="Hours Volunteered"
                description="Total time contributed"
              />
            </AnimatedTransition>
            
            <AnimatedTransition delay={100}>
              <StatCard 
                icon={<User size={24} />}
                value={32}
                label="People Helped"
                description="Individuals assisted"
              />
            </AnimatedTransition>
            
            <AnimatedTransition delay={200}>
              <StatCard 
                icon={<CheckCircle size={24} />}
                value={8}
                label="Tasks Completed"
                description="Successfully completed tasks"
              />
            </AnimatedTransition>
            
            <AnimatedTransition delay={300}>
              <StatCard 
                icon={<Trophy size={24} />}
                value={140}
                label="Impact Points"
                description="Recognition of your contributions"
              />
            </AnimatedTransition>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnimatedTransition>
                <div className={`rounded-xl border mb-6 ${
                  isLight ? 'bg-white border-gray-200' : 'bg-black/30 border-white/10'
                }`}>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    
                    <div className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-white/10'}`}>
                      {activities.map((activity, index) => (
                        <div key={index} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`flex items-center text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                                <span>{activity.type}</span>
                                <span className="mx-2">•</span>
                                <span>{activity.date}</span>
                              </div>
                              <h3 className="font-medium">{activity.title}</h3>
                              {activity.hours && (
                                <div className="text-sm mt-1">
                                  <Clock size={12} className="inline-block mr-1" />
                                  <span>{activity.hours} hours</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                              <Trophy size={12} className="mr-1" />
                              <span>+{activity.points} points</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedTransition>
              
              <AnimatedTransition delay={100}>
                <div className={`rounded-xl border ${
                  isLight ? 'bg-white border-gray-200' : 'bg-black/30 border-white/10'
                }`}>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Volunteer Skills</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">First Aid</span>
                          <span className="text-xs">Advanced</span>
                        </div>
                        <div className={`w-full ${isLight ? 'bg-gray-200' : 'bg-white/10'} rounded-full h-2`}>
                          <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Resource Distribution</span>
                          <span className="text-xs">Intermediate</span>
                        </div>
                        <div className={`w-full ${isLight ? 'bg-gray-200' : 'bg-white/10'} rounded-full h-2`}>
                          <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Shelter Management</span>
                          <span className="text-xs">Beginner</span>
                        </div>
                        <div className={`w-full ${isLight ? 'bg-gray-200' : 'bg-white/10'} rounded-full h-2`}>
                          <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Communication</span>
                          <span className="text-xs">Advanced</span>
                        </div>
                        <div className={`w-full ${isLight ? 'bg-gray-200' : 'bg-white/10'} rounded-full h-2`}>
                          <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedTransition>
            </div>
            
            <div>
              <AnimatedTransition delay={50}>
                <div className={`rounded-xl border mb-6 ${
                  isLight ? 'bg-white border-gray-200' : 'bg-black/30 border-white/10'
                }`}>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recognition</h2>
                    
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${
                        isLight ? 'bg-gray-50' : 'bg-black/40'
                      }`}>
                        <div className="flex items-center mb-2">
                          <Trophy size={18} className="mr-2 text-yellow-500" />
                          <h3 className="font-medium">First Responder</h3>
                        </div>
                        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                          Awarded for quick response during initial emergency phase
                        </p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${
                        isLight ? 'bg-gray-50' : 'bg-black/40'
                      }`}>
                        <div className="flex items-center mb-2">
                          <Heart size={18} className="mr-2 text-red-500" />
                          <h3 className="font-medium">Compassionate Care</h3>
                        </div>
                        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                          Recognized for exceptional empathy when helping vulnerable individuals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedTransition>
              
              <AnimatedTransition delay={150}>
                <div className={`rounded-xl border ${
                  isLight ? 'bg-white border-gray-200' : 'bg-black/30 border-white/10'
                }`}>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
                    
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg border ${
                        isLight ? 'border-gray-100' : 'border-white/5'
                      }`}>
                        <div className="flex items-center mb-2">
                          <Calendar size={16} className="mr-2" />
                          <h3 className="font-medium">Shelter Support</h3>
                        </div>
                        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                          Central High School shelter location
                        </p>
                        <div className={`flex justify-between text-xs ${isLight ? 'text-gray-600' : 'text-gray-500'}`}>
                          <span>Today, 4:00 PM - 8:00 PM</span>
                          <Link to="/volunteer-tasks" className="text-primary hover:underline">
                            View
                          </Link>
                        </div>
                      </div>
                      
                      <div className="text-center py-2">
                        <Link to="/resources" className="text-sm text-primary hover:underline">
                          Find more opportunities to help
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedTransition>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerStats;
