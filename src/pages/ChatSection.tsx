
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { Send, Paperclip, Image, MapPin, Mic, Phone, Video } from 'lucide-react';
import BackButton from '../components/BackButton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

const ChatSection = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [contact, setContact] = useState<any>(null);
  
  useEffect(() => {
    // Get contact info based on contactId
    const getContactInfo = () => {
      // First, check if this contactId exists in real users
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          const foundUser = parsedUsers.find((user: any) => user.id === contactId);
          
          if (foundUser) {
            setContact({
              name: foundUser.name,
              role: foundUser.role,
              phone: foundUser.contactInfo,
              isOnline: true, // Assume online for simplicity
            });
            return;
          }
        } catch (error) {
          console.error("Error parsing stored users:", error);
        }
      }
      
      // If not found in real users, fall back to predefined contacts
      const contactMap: {[key: string]: any} = {
        'emergency-1': {
          name: 'Emergency Response',
          role: 'Coordination Center',
          phone: '555-911',
          isOnline: true,
        },
        'medical-1': {
          name: 'Nearest Medical Center',
          role: 'Medical Coordinator',
          phone: '555-123-7890',
          isOnline: true,
        },
        'shelter-1': {
          name: 'Nearest Shelter',
          role: 'Shelter Manager',
          phone: '555-456-7890',
          isOnline: false,
        },
        'volunteer-1': {
          name: 'Nearest Volunteer',
          role: 'Volunteer',
          phone: 'volunteer01@example.com',
          isOnline: true,
        },
        'volunteer-2': {
          name: 'Next Nearest Volunteer',
          role: 'Volunteer',
          phone: 'volunteer02@example.com',
          isOnline: true,
        },
        'ngo-1': {
          name: 'Nearest NGO',
          role: 'NGO',
          phone: 'ngo@gmail.org',
          isOnline: true,
        },
        'ngo-2': {
          name: 'Community Relief Foundation',
          role: 'NGO',
          phone: 'help@crf.org',
          isOnline: true,
        }
      };
      
      setContact(contactMap[contactId || ''] || { 
        name: 'Unknown Contact',
        role: 'No information available',
        isOnline: false,
      });
    };
    
    // Get message history or create empty conversation
    const getMessages = () => {
      const savedMessages = localStorage.getItem(`chat_${contactId}`);
      
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Convert string dates back to Date objects
          const processedMessages = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(processedMessages);
        } catch (error) {
          console.error("Error parsing saved messages:", error);
          setMessages([]);
        }
      } else if (contactId) {
        // Create welcome message for new conversations
        const initialMessage: Message = {
          id: `msg-init-${Date.now()}`,
          text: `Hello, this is a new conversation with ${contactId}. How can I assist you?`,
          sender: 'contact',
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
        
        // Save the initial message
        localStorage.setItem(`chat_${contactId}`, JSON.stringify([initialMessage]));
      }
    };
    
    getContactInfo();
    getMessages();
  }, [contactId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');
    
    // Save to localStorage
    localStorage.setItem(`chat_${contactId}`, JSON.stringify(updatedMessages));
    
    // Simulate response from contact
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        text: "I've received your message and will respond shortly. Please stay safe in the meantime.",
        sender: 'contact',
        timestamp: new Date(),
      };
      
      const messagesWithResponse = [...updatedMessages, responseMessage];
      setMessages(messagesWithResponse);
      
      // Update localStorage with response
      localStorage.setItem(`chat_${contactId}`, JSON.stringify(messagesWithResponse));
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-900 dark:text-white flex flex-col">
      <Header emergency={true} />
      
      <main className="flex-grow pt-16 flex flex-col">
        <div className="border-b border-black/10 bg-white/50 dark:bg-slate-900 dark:text-white backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center py-3">
              <BackButton className="mr-4" />
              
              <div className="flex-grow">
                <h2 className="font-medium">{contact?.name}</h2>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${contact?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-600">{contact?.role}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors">
                  <Video size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto px-4 py-6 bg-white dark:bg-slate-900 dark:text-white">
          <div className="container mx-auto max-w-3xl space-y-4 ">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 border-2 dark:bg-white/15 ${
                    message.sender === 'user' 
                      ? 'bg-gray-100 border-black/20 dark:bg-slate-900 rounded-tr-none' 
                      : 'bg-white border-black/20 dark:bg-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-tl-none'
                  }`}
                >
                  <div className="text-sm mb-1 text-black dark:text-white">{message.text}</div>
                  <div className="text-xs text-gray-500 flex justify-end">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender === 'user' && message.status && (
                      <span className="ml-2">{message.status === 'read' ? '✓✓' : '✓'}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-black/10 bg-white/50 dark:bg-slate-900 backdrop-blur-md py-4">
          <div className="container mx-auto max-w-3xl px-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors">
                <Paperclip size={20} />
              </button>
              
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-white border-2 border-black/20 dark:text-black rounded-full px-4 py-2 focus:outline-none focus:border-black/30"
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors">
                    <Image size={18} className="text-gray-500" />
                  </button>
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors">
                    <MapPin size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
              
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors">
                <Mic size={20} />
              </button>
              
              <button 
                type="submit" 
                className="p-2 rounded-full bg-black text-white hover:bg-black/90 transition-colors border-2 border-black"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatSection;
