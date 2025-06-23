import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

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
          <Image src="/bot_lady.svg" alt="Bot" width={40} height={40} /> {/* Added width/height */}
        </div>
      )}

      {/* Contenu du message */}
      <div className={`max-w-2xl ${isBot ? 'mr-16' : 'ml-16'}`}>
        <div
          className={`px-6 py-4 rounded-3xl shadow-sm ${
            isBot
              ? 'bg-[#FAD2DC] text-[#9A223D] rounded-tl-lg'
              : 'bg-[#D7DFCC] text-[#345211] rounded-tr-lg'
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
            // Use ReactMarkdown here for rendering text content
            <ReactMarkdown>
              {message.text || ''}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {/* Avatar de l'utilisateur (seulement pour les messages utilisateur) */}
      {!isBot && (
        <div className="">
          <Image src="/user.svg" alt="User" width={40} height={40} /> {/* Added width/height */}
        </div>
      )}
    </div>
  );
};

// Ensure this is the default export if PlaygroundPage imports it this way
export default Message;