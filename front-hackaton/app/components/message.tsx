import React, { useState } from 'react';
import Image from 'next/image';


interface MessageProps {
  message: {
    text?: string;
    image?: string;
    timestamp?: Date;
  };
  isBot: boolean;
}

// Composant Message
const Message: React.FC<MessageProps> = ({ message, isBot }) => {
  return (
    <div className={`flex items-start gap-3 mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="">
              <Image src="/bot_lady.svg" alt="Bot" />
          </div>
      )}

      {/* Contenu du message */}
      <div className={`max-w-2xl ${isBot ? 'mr-16' : 'ml-16'}`}>
        <div
          className={`px-6 py-4 rounded-3xl shadow-sm ${
            isBot
              ? 'bg-[#F4EEFF] text-[#736096] rounded-tl-lg'
              : 'bg-[#E6ECF3] text-[#647488] rounded-tr-lg'
          }`}
        >
          {message.image ? (
            <div className="rounded-2xl overflow-hidden">
              <img 
                src={message.image} 
                alt="Message attachment" 
                className="w-full h-48 object-cover"
              />
            </div>
          ) : (
            <p className="text-base leading-relaxed">{message.text}</p>
          )}
        </div>
      </div>

      {/* Avatar de l'utilisateur (seulement pour les messages utilisateur) */}
      {!isBot && (
        <div className="">
            <Image src="/user.svg" alt="User" />
        </div>
      )}
    </div>
  );
};

// Composant principal ChatBot
const ChatBot = () => {
  const [messages, setMessages] = useState([
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
    }
  ]);

  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputText,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          text: "Merci pour votre message ! Je traite votre demande...",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  interface KeyPressEvent extends React.KeyboardEvent<HTMLTextAreaElement> {}

  const handleKeyPress = (e: KeyPressEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white">
      {/* Header simplifié */}
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="text-right">
          <Image src="/logo2.svg" alt="Logo" />
        </div>
      </div>

      {/* Messages Container */}
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

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-6">
        <div className="flex items-end space-x-4">
          <button className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
            <Image src="/send.svg" alt="Camera" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full px-6 py-4 border border-gray-200 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="flex-shrink-0 p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Image src="/camera.svg" alt="Camera" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">Copyright yada yada yada</p>
      </div>
    </div>
  );
};

export default Message;