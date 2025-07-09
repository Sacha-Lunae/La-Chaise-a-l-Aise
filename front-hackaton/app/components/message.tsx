import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface ProductData {
  label: string;
  price: string;
  image_url: string;
}

interface MessageProps {
  message: {
    text?: string;
    image?: string;
    timestamp?: Date;
  };
  isBot: boolean;
}

// Function to generate random rating between 4.0 and 5.0
const generateRandomRating = (): { rating: number; reviews: string } => {
  const rating = Math.random() * (5.0 - 4.0) + 4.0;
  const reviewCount = Math.floor(Math.random() * 5000) + 100; // Random between 100 and 5100
  
  const formatReviewCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return {
    rating: Math.round(rating * 10) / 10, // Round to 1 decimal place
    reviews: formatReviewCount(reviewCount)
  };
};

// Function to extract JSON from markdown code blocks
const extractJsonFromMarkdown = (text: string): string | null => {
  const trimmedText = text.trim();
  
  // Check if it's wrapped in markdown code blocks
  if (trimmedText.startsWith('```json\n') && trimmedText.endsWith('\n```')) {
    return trimmedText.slice(8, -4); // Remove ```json\n from start and \n``` from end
  }
  
  // Also check for just ``` without json specification
  if (trimmedText.startsWith('```\n') && trimmedText.endsWith('\n```')) {
    return trimmedText.slice(4, -4); // Remove ```\n from start and \n``` from end
  }
  
  // If not in code blocks, return as is
  return trimmedText;
};

// Function to check if text contains product data
const isProductData = (text: string): boolean => {
  const jsonText = extractJsonFromMarkdown(text);
  if (!jsonText) return false;
  
  try {
    const parsed = JSON.parse(jsonText);
    
    // Check if it's an object with product-like structure
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      
      if (keys.length > 0) {
        const firstItem = parsed[keys[0]];
        
        const isValid = (
          typeof firstItem === 'object' &&
          firstItem !== null &&
          firstItem.hasOwnProperty('label') &&
          firstItem.hasOwnProperty('price') &&
          firstItem.hasOwnProperty('image_url')
        );
        
        return isValid;
      }
    }
  } catch (error) {
    return false;
  }
  return false;
};

// Product Card Component
const ProductCard: React.FC<{ productId: string; product: ProductData }> = ({ 
  productId, 
  product 
}) => {
  const { rating, reviews } = generateRandomRating();
  
  // Generate star display using Unicode stars
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {/* Full stars */}
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-xs">★</span>
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <span className="text-yellow-400 text-xs">☆</span>
        )}
        {/* Empty stars */}
        {Array(emptyStars).fill(0).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-xs">★</span>
        ))}
      </>
    );
  };

  return (
    <div className="product-card bg-white border border-gray-200 rounded-lg p-3 transition cursor-pointer hover:shadow-md mb-3">
      <div className="flex">
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
          <a 
            href={product.image_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={product.image_url}
              alt={product.label}
              className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity"
              onError={(e) => {
                // Fallback to chair icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<span class="text-gray-400 text-2xl">🪑</span>';
              }}
            />
          </a>
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-gray-800">{product.label}</h3>
          <p className="text-sm text-gray-600 mb-1">{productId}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-black">{product.price}€</span>
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                {renderStars()}
              </div>
              <span className="text-xs text-gray-600">{rating} ({reviews})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Message Component
const Message: React.FC<MessageProps> = ({ message, isBot }) => {
  // Check if message contains product data
  const containsProductData = message.text && isProductData(message.text);
  
  let productData: Record<string, ProductData> = {};
  if (containsProductData && message.text) {
    try {
      const jsonText = extractJsonFromMarkdown(message.text);
      if (jsonText) {
        productData = JSON.parse(jsonText);
      }
    } catch (e) {
      // If parsing fails, fall back to regular message rendering
    }
  }

  return (
    <div className={`flex items-start gap-3 mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="">
          <Image src="/bot_lady.svg" alt="Bot" width={40} height={40} />
        </div>
      )}

      {/* Message content */}
      <div className={`max-w-2xl ${isBot ? 'mr-16' : 'ml-16'}`}>
        {containsProductData ? (
          // Render introductory message + product cards
          <div className="space-y-4">
            {/* Introductory message */}
            <div
              className={`px-6 py-4 rounded-3xl shadow-sm ${
                isBot
                  ? 'bg-[#FAD2DC] text-[#9A223D] rounded-tl-lg'
                  : 'bg-[#D7DFCC] text-[#345211] rounded-tr-lg'
              }`}
            >
              Sure thing! Here is what I found:
            </div>
            
            {/* Product cards */}
            <div className="space-y-3">
              {Object.entries(productData).map(([productId, product]) => (
                <ProductCard 
                  key={productId} 
                  productId={productId} 
                  product={product} 
                />
              ))}
            </div>
          </div>
        ) : (
          // Regular message rendering
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
              <ReactMarkdown>
                {message.text || ''}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>

      {/* User avatar (only for user messages) */}
      {!isBot && (
        <div className="">
          <Image src="/user.svg" alt="User" width={40} height={40} />
        </div>
      )}
    </div>
  );
};

export default Message;
