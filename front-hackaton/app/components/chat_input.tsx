import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendImage?: (imageDataUrl: string, text?: string) => void;
  disabled?: boolean; // Nouvelle prop pour désactiver l'input
}

// Chat Input Component
const ChatInput = ({ onSendMessage, onSendImage, disabled = false }: ChatInputProps) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    // Ne pas envoyer si désactivé
    if (disabled) return;

    if (selectedImage && onSendImage) {
      // Envoyer l'image avec le texte optionnel
      onSendImage(selectedImage, inputText);
      setSelectedImage(null);
      setImagePreview(null);
      setInputText('');
    } else if (inputText.trim()) {
      // Envoyer seulement le texte
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Ne pas permettre la sélection d'image si désactivé
    if (disabled) return;

    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, GIF).');
        return;
      }

      // Vérifier la taille (limite à 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('The image is too heavy. Limit of 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSelectedImage(dataUrl);
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    // Ne pas permettre la suppression si désactivé
    if (disabled) return;

    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openFileDialog = () => {
    // Ne pas ouvrir le dialogue si désactivé
    if (disabled) return;
    fileInputRef.current?.click();
  };

  // Calculer si le bouton d'envoi doit être désactivé
  const isSendDisabled = disabled || (!inputText.trim() && !selectedImage);

  return (
    <div className="bg-[#F4F0EA] p-4">
      {/* Prévisualisation de l'image */}
      {imagePreview && (
        <div className="mb-4 p-4 border border-gray-200 rounded-2xl bg-[#F4F0EA]">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className={`w-20 h-20 object-cover rounded-xl shadow-sm ${
                  disabled ? 'opacity-50' : ''
                }`}
              />
              <button
                onClick={removeImage}
                disabled={disabled}
                className={`absolute -top-2 -right-2 w-6 h-6 bg-[#CF6B82] text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-sm ${
                  disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-red-600'
                }`}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input de fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* Container principal avec bordure bleue pastel */}
      <div className={`flex items-center bg-[#D7DFCC] border border-[#778C61] rounded-lg px-4 py-3 transition-opacity ${
        disabled ? 'opacity-50' : ''
      }`}>
        {/* Bouton camera/upload */}
        <button 
          onClick={openFileDialog}
          disabled={disabled}
          className={`flex-shrink-0 p-2 group transition-all ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          title={disabled ? "Chat disabled" : "Add an image"}
        >
          <Image 
            src="/camera.svg" 
            alt="Camera" 
            width={24} 
            height={24} 
            className={disabled ? 'block' : 'group-hover:hidden'}
          />
          {!disabled && (
            <Image 
              src="/camera2.svg" 
              alt="Camera hover" 
              width={24} 
              height={24} 
              className="hidden group-hover:block"
            />
          )}
        </button>
        
        {/* Zone de texte */}
        <div className="flex-1 mx-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={disabled ? "Please wait..." : "What's the perfect chair for me ?"}
            className={`w-full bg-transparent resize-none focus:outline-none text-[#345211] placeholder-[#8A9977] text-base ${
              disabled ? 'cursor-not-allowed' : ''
            }`}
            rows={1}
            style={{ 
              minHeight: '24px',
              maxHeight: '120px',
              lineHeight: '1.5'
            }}
          />
        </div>

        {/* Bouton d'envoi intégré */}
        <button
          onClick={handleSend}
          disabled={isSendDisabled}
          className={`flex-shrink-0 p-2 group transition-all ${
            isSendDisabled ? 'cursor-not-allowed' : ''
          }`}
          title={disabled ? "Chat disabled" : "Send message"}
        >
          {(inputText.trim() || selectedImage) && !disabled ? (
            <>
              <Image 
                src="/send.svg" 
                alt="Send" 
                width={20} 
                height={20} 
                className="group-hover:hidden"
              />
              <Image 
                src="/send2.svg" 
                alt="Send hover" 
                width={20} 
                height={20} 
                className="hidden group-hover:block"
              />
            </>
          ) : (
            <Image 
              src="/send.svg" 
              alt="Send" 
              width={20} 
              height={20} 
              className="opacity-50"
            />
          )}
        </button>
      </div>

      {/* Informations sur les fichiers acceptés */}
      {!selectedImage && !disabled && (
        <div className="mt-3 text-xs text-gray-400 px-4">
          Formats acceptés: JPG, PNG, GIF (max 5MB)
        </div>
      )}
      
      {/* Message d'état quand désactivé */}
      {disabled && (
        <div className="mt-3 text-xs text-gray-500 px-4 flex items-center">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          Sending message...
        </div>
      )}
    </div>
  );
};

export default ChatInput;