'use client';

import { useState } from 'react';
import { EyeIcon, PencilIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import PlaceholderImage from './PlaceholderImage';

export default function BookCard({ book, onView, onEdit }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Default cover image if none provided
  const coverImage = book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop';
  
  // Format price
  const formattedPrice = parseFloat(book.price).toFixed(2);
  
  // Determine stock status
  const isLowStock = book.quantity < 5;
  const isOutOfStock = book.quantity === 0;
  
  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <PlaceholderImage
          src={coverImage}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action buttons on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onView(book)}
            className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
            aria-label="View details"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => onEdit(book)}
            className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
            aria-label="Edit book"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Genre tag */}
      {book.genre && (
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {book.genre}
          </span>
        </div>
      )}
      
      {/* Stock indicator */}
      <div className="absolute top-2 right-2">
        {isOutOfStock ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Low Stock: {book.quantity}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            In Stock: {book.quantity}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">by {book.author}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${formattedPrice}</p>
          {book.rating > 0 && (
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.round(book.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
