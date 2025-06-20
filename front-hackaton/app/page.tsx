'use client';

import React, { useState } from 'react';
import Message from './components/message';
import ChatInput from './components/chat_input';
import Image from 'next/image';

// Types pour les messages
interface MessageType {
  id: number;
  type: 'bot' | 'user';
  text: string;
  image?: string;
  timestamp: Date;
}

// Sample messages for testing
const sampleMessages: MessageType[] = [
  {
    id: 1,
    type: 'bot',
    text: "Bonjour ! Prêt-e pour une expérience d'achat hors du commun ?\nDites-m'en plus sur vous et vos envies.",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 2,
    type: 'user',
    text: "Mon jardin fait environ 150m², et j'ai une piscine de 25m². J'aimerais me faire un espace détente à côté, qu'est-ce que tu me conseilles ?",
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: 3,
    type: 'user',
    text: "",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: 4,
    type: 'bot',
    text: "C'est un bel espace ! Pour créer une zone détente près de votre piscine, je recommande :\n\n• Des transats confortables\n• Un parasol ou une pergola\n• Une table basse résistante\n• Des coussins d'extérieur",
    timestamp: new Date(Date.now() - 120000)
  }
];

// Main Playground Component
export default function PlaygroundPage() {
  const [messages, setMessages] = useState<MessageType[]>(sampleMessages);
  const [currentView, setCurrentView] = useState<'chat' | 'components' | 'testing'>('chat');

  // Fonction pour ajouter un message texte
  const addMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newMessage: MessageType = {
      id: messages.length + 1,
      type: 'user',
      text,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: MessageType = {
        id: messages.length + 2,
        type: 'bot',
        text: "Merci pour votre message ! Je traite votre demande...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  // Fonction pour ajouter un message avec image
  const addImageMessage = (imageDataUrl: string, text: string = '') => {
    const newMessage: MessageType = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      image: imageDataUrl,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: MessageType = {
        id: messages.length + 2,
        type: 'bot',
        text: "Belle image ! Je peux vous aider à analyser votre espace ou vous donner des conseils d'aménagement.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const resetMessages = () => {
    setMessages(sampleMessages);
  };

  const addTestMessage = (type: 'bot' | 'user', text: string) => {
    const newMessage: MessageType = {
      id: messages.length + 1,
      type,
      text,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Playground Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chatbot Playground</h1>
              <p className="text-gray-600">Test your components and interactions</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentView === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <span>💬</span>
                <span>Chat View</span>
              </button>
              <button
                onClick={() => setCurrentView('components')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentView === 'components' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <span>🎨</span>
                <span>Components</span>
              </button>
              <button
                onClick={() => setCurrentView('testing')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentView === 'testing' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <span>⚙️</span>
                <span>Testing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Chat View */}
        {currentView === 'chat' && (
          <div className="bg-white rounded-lg shadow-sm h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="bg-white p-6 border-b border-gray-100 rounded-t-lg">
              <div className="text-right">
                <Image src="/logo2.svg" alt="Logo" width={100} height={40} />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-2">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isBot={message.type === 'bot'}
                  />
                ))}
              </div>
            </div>

            {/* Input avec support d'images */}
            <ChatInput 
              onSendMessage={addMessage}
              onSendImage={addImageMessage}
            />
          </div>
        )}

        {/* Components View */}
        {currentView === 'components' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Message Components</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Bot Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Message 
                      message={{ text: "Voici un exemple de message du bot avec du texte multiligne.\n\nIl peut contenir plusieurs paragraphes et des suggestions." }}
                      isBot={true}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">User Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Message 
                      message={{ text: "Et voici un exemple de message utilisateur avec une question plus longue qui peut s'étendre sur plusieurs lignes." }}
                      isBot={false}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Message with Image</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Message 
                      message={{ 
                        text: "",
                        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop"
                      }}
                      isBot={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Chat Input Component</h2>
              <div className="border rounded-lg">
                <ChatInput 
                  onSendMessage={(text) => console.log('Message sent:', text)}
                  onSendImage={(imageUrl, text) => console.log('Image sent:', imageUrl, text)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Testing View */}
        {currentView === 'testing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Testing Controls</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={resetMessages}
                      className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Reset Messages
                    </button>
                    <button
                      onClick={() => addTestMessage('bot', 'Message de test du bot')}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
                    >
                      <span>🤖</span>
                      <span>Add Bot Message</span>
                    </button>
                    <button
                      onClick={() => addTestMessage('user', 'Message de test utilisateur')}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
                    >
                      <span>👤</span>
                      <span>Add User Message</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Statistics</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Total Messages:</span>
                      <span className="font-medium">{messages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bot Messages:</span>
                      <span className="font-medium">{messages.filter(m => m.type === 'bot').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Messages:</span>
                      <span className="font-medium">{messages.filter(m => m.type === 'user').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Component Props Testing</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Long Text Message</h3>
                  <Message 
                    message={{ 
                      text: "Ceci est un très long message pour tester comment les composants gèrent le contenu étendu. Il devrait bien s'adapter à la largeur disponible et maintenir une bonne lisibilité même avec beaucoup de texte. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
                    }}
                    isBot={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}