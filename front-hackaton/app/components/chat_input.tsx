import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendImage?: (imageDataUrl: string, text?: string) => void;
}

// Chat Input Component
const ChatInput = ({ onSendMessage, onSendImage }: ChatInputProps) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
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
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image.');
        return;
      }

      // Vérifier la taille (limite à 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Limite de 5MB.');
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
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border-t border-gray-100 p-6">
      {/* Prévisualisation de l'image */}
      {imagePreview && (
        <div className="mb-4 p-4 border border-gray-200 rounded-2xl bg-gray-50">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-xl shadow-sm"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-sm"
              >
                ×
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2 font-medium">Image sélectionnée</p>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ajoutez un commentaire à votre image (optionnel)..."
                className="w-full p-3 border border-gray-200 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-end space-x-4">
        {/* Input de fichier caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Bouton camera/upload */}
        <button 
          onClick={openFileDialog}
          className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          title="Ajouter une image"
        >
          <Image src="/camera.svg" alt="Camera" width={24} height={24} />
        </button>
        
        {/* Zone de texte (cachée si image sélectionnée) */}
        {!selectedImage && (
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
        )}
        
        <button
          onClick={handleSend}
          disabled={!inputText.trim() && !selectedImage}
          className={`flex-shrink-0 p-4 rounded-full transition-colors shadow-sm ${
            (inputText.trim() || selectedImage)
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <Image src="/send.svg" alt="Send" width={20} height={20} />
        </button>
      </div>

      {/* Informations sur les fichiers acceptés */}
      {!selectedImage && (
        <div className="mt-2 text-xs text-gray-400 px-2">
          Formats acceptés: JPG, PNG, GIF (max 5MB)
        </div>
      )}
    </div>
  );
};

export default ChatInput;