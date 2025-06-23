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
    text: "Welcome to La Chaise à l'Aise ! My name is Cherry, your shopping assistant, and I'm here to guide you to find the best chair for your home.\nThere's a lot you can do with me ! You should try : \n- asking me for decoratioin advice \n-send me a chair picture and I'll find the closest looking chairs into our data base \n- asking me for info about our products \n- adding items to your basket \nLet's start our journey !",
    timestamp: new Date(Date.now() - 300000)
  }
];

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<MessageType[]>(sampleMessages);

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
