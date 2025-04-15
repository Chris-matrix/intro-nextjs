'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PlaceholderImage({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || '/placeholder-book.jpg');
  const [isLoading, setIsLoading] = useState(true);
  
  // Default placeholder if no image is provided
  const defaultPlaceholder = '/placeholder-book.jpg';
  
  // Handle image load error
  const handleError = () => {
    setImgSrc(defaultPlaceholder);
    setIsLoading(false);
  };
  
  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  // Update image source if prop changes
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setIsLoading(true);
    }
  }, [src]);
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <Image
        src={imgSrc}
        alt={alt || "Book cover"}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority
        {...props}
      />
    </div>
  );
}
