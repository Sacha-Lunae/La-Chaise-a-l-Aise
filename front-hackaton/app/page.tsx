'use client';

import React, { useState, useEffect } from 'react';
import Message from './components/message';
import ChatInput from './components/chat_input';
import Image from 'next/image';
import ADKApiService from './services/adk_api'; // Make sure the path is correct

// Types for messages
interface MessageType {
  id: number;
  type: 'bot' | 'user';
  text: string;
  image?: string; // Used to display the image on the client side
  timestamp: Date;
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiService, setApiService] = useState<ADKApiService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the API service and create a session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        console.log('PAGE: Starting chat initialization...');
        const service = new ADKApiService();

        // Create the session with default user data
        const sessionResult = await service.createSession({
          first_name: 'Sophie',
          last_name: 'Martin',
          email: 'sophie.martin@example.com',
          preferred_language: 'fr',
          loyalty_status: 'Gold'
        });

        if (sessionResult.success) {
          setApiService(service);
          setIsInitialized(true);
          console.log('PAGE: Session created successfully! Session ID:', sessionResult.session_id);

          // Add the welcome message with line breaks
          const welcomeMessage: MessageType = {
            id: 1,
            type: 'bot',
            text: "Welcome to La Chaise à l'Aise ! My name is Cherry, your shopping assistant, and I'm here to guide you to find the best chair for your home.\nThere's a lot you can do with me !\nYou should try :\n- ·asking me for decoration advice\n- ·sending me a chair picture and I'll find the closest looking chairs into our database\n- ·asking me for info about our products\n- ·adding items to your basket\n\nLet's start our journey !",
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        } else {
          setError(`Initialization error: ${sessionResult.error}`);
          console.error('PAGE: Error during session creation:', sessionResult.error);
        }
      } catch (err) {
        setError(`Initialization error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('PAGE: Caught error during initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const addMessage = async (text: string) => {
    if (!text.trim() || !apiService || !isInitialized) {
      console.log('PAGE: addMessage ignored (no text, service not ready, or not initialized)');
      return;
    }

    // Add user message immediately
    const userMessage: MessageType = {
      id: messages.length + 1,
      type: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    setError(null);

    try {
      console.log('PAGE: Sending text message to API:', text);
      const response = await apiService.sendMessage(text);

      if (response.success && response.response) {
        let botText = '';
        if (response.response.parts && response.response.parts.length > 0) {
          botText = response.response.parts
            .map(part => part.text)
            .join(' ');
        }
        console.log('PAGE: Agent text response received:', botText);
        const botResponse: MessageType = {
          id: messages.length + 2,
          type: 'bot',
          text: botText || "Sorry, I couldn't process your request.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        console.error('PAGE: Agent response error (text):', response.error);
        const errorMessage: MessageType = {
          id: messages.length + 2,
          type: 'bot',
          text: `Sorry, an error occurred: ${response.error}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('PAGE: Caught error while sending text message:', err);
      const errorMessage: MessageType = {
        id: messages.length + 2,
        type: 'bot',
        text: `Communication error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a message with an image
  const addImageMessage = async (imageDataUrl: string, text: string = '') => {
    if (!apiService || !isInitialized) {
      console.log('PAGE: addImageMessage ignored (service not ready or not initialized)');
      return;
    }

    const newMessages: MessageType[] = [];
    let messageId = messages.length + 1;

    // If there's text, create the text message first
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

    // Then create the image message (for display only)
    const imageMessage: MessageType = {
      id: messageId,
      type: 'user',
      text: '', // Empty text for the image message
      image: imageDataUrl, // The image to display
      timestamp: new Date(Date.now() + 100) // 100ms offset for order
    };
    newMessages.push(imageMessage);

    // Add all new messages to local state
    setMessages(prev => [...prev, ...newMessages]);

    setIsLoading(true);
    setError(null);

    try {
      console.log('PAGE: Sending message with image to API. Text:', text, 'Image size:', imageDataUrl.length, 'first 50 chars:', imageDataUrl.substring(0, 50));
      const response = await apiService.sendMessage(text, imageDataUrl);

      if (response.success && response.response) {
        let botText = '';
        if (response.response.parts && response.response.parts.length > 0) {
          botText = response.response.parts
            .map(part => part.text)
            .join(' ');
        }
        console.log('PAGE: Agent image response received:', botText);
        const botResponse: MessageType = {
          id: messages.length + newMessages.length + 1,
          type: 'bot',
          text: botText || "I received your image!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        console.error('PAGE: Agent response error (image):', response.error);
        const errorMessage: MessageType = {
          id: messages.length + newMessages.length + 1,
          type: 'bot',
          text: `Error processing image: ${response.error}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('PAGE: Caught error while sending image:', err);
      const errorMessage: MessageType = {
        id: messages.length + newMessages.length + 1,
        type: 'bot',
        text: `Communication error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Display error if initialization failed
  if (error && !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
          style={{
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>

      {/* Main chat container - smaller and centered */}
      <div className="w-full max-w-4xl h-[80vh] bg-[#F4F0EA] rounded-lg shadow-lg flex flex-col overflow-hidden">

        {/* Chat Header */}
        <div className="bg-[#E7DCCB] p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            {/* Status indicator */}
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isInitialized ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isInitialized ? 'Connected' : 'Initializing...'}
            </span>
            {isLoading && (
              <div className="ml-2 animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            )}
          </div>
          <div className="text-right">
            <Image src="/logo2.svg" alt="Logo" width={100} height={40} />
          </div>
        </div>

        {/* Messages with corner radius */}
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
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input with image support */}
        <div className="bg-[#F4F0EA]">
          <ChatInput
            onSendMessage={addMessage}
            onSendImage={addImageMessage}
            disabled={!isInitialized || isLoading}
          />
        </div>
      </div>
    </div>
  );
}