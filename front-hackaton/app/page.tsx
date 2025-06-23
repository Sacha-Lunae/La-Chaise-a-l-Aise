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

  // Fonction pour ajouter un message avec image (version corrigée)
  const addImageMessage = (imageDataUrl: string, text: string = '') => {
    const newMessages: MessageType[] = [];
    let messageId = messages.length + 1;

    // Si il y a du texte, créer d'abord le message texte
    if (text.trim()) {
      const textMessage: MessageType = {
        id: messageId,
        type: 'user',
        text: text.trim(),
        timestamp: new Date()
      };
      newMessages.push(textMessage);
      messageId++;
    }

    // Puis créer le message image
    const imageMessage: MessageType = {
      id: messageId,
      type: 'user',
      text: '', // Texte vide pour le message image
      image: imageDataUrl,
      timestamp: new Date(Date.now() + 100) // Décalage de 100ms pour l'ordre
    };
    newMessages.push(imageMessage);

    // Ajouter tous les nouveaux messages
    setMessages(prev => [...prev, ...newMessages]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: MessageType = {
        id: messages.length + newMessages.length + 1,
        type: 'bot',
        text: "Belle image ! Je peux vous aider à analyser votre espace ou vous donner des conseils d'aménagement.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{
           backgroundImage: 'url(/background.jpg)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      
      {/* Container principal du chat - plus petit et centré */}
      <div className="w-full max-w-4xl h-[80vh] bg-[#F4F0EA] rounded-lg shadow-lg flex flex-col overflow-hidden">
        
        {/* Header du chat */}
        <div className="bg-[#E7DCCB] p-4 border-b border-gray-100">
          <div className="text-right">
            <Image src="/logo2.svg" alt="Logo" width={100} height={40} />
          </div>
        </div>

        {/* Messages avec corner radius */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-[#F4F0EA] rounded-lg h-full p-4 overflow-y-auto">
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
        </div>

        {/* Input avec support d'images */}
        <div className="bg-[#F4F0EA]">
          <ChatInput 
            onSendMessage={addMessage}
            onSendImage={addImageMessage}
          />
        </div>
      </div>
    </div>
  );
}