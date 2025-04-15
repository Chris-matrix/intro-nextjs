'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon as XIcon, StarIcon, BookmarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import PlaceholderImage from './PlaceholderImage';

export default function BookDetailModal({ book, isOpen, onClose }) {
  if (!book) return null;
  
  // Format price
  const formattedPrice = parseFloat(book.price).toFixed(2);
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Book cover */}
                  <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                      <PlaceholderImage
                        src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop'}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={85}
                      />
                    </div>
                  </div>
                  
                  {/* Book details */}
                  <div className="flex-1">
                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
                      {book.title}
                    </Dialog.Title>
                    
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">by {book.author}</p>
                    
                    {/* Rating */}
                    {book.rating > 0 && (
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.round(book.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} ${i < Math.round(book.rating) ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 dark:text-gray-300">{book.rating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {/* Price and stock */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${formattedPrice}</span>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
                            ${parseFloat(book.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        book.quantity === 0 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : book.quantity < 5 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {book.quantity === 0 
                          ? 'Out of Stock' 
                          : book.quantity < 5 
                            ? `Low Stock: ${book.quantity}` 
                            : `In Stock: ${book.quantity}`}
                      </div>
                    </div>
                    
                    {/* Book metadata */}
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      {book.isbn && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">ISBN</p>
                          <p className="font-medium text-gray-900 dark:text-white">{book.isbn}</p>
                        </div>
                      )}
                      
                      {book.publisher && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Publisher</p>
                          <p className="font-medium text-gray-900 dark:text-white">{book.publisher}</p>
                        </div>
                      )}
                      
                      {book.publishedDate && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Published Date</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(book.publishedDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {book.pageCount && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Pages</p>
                          <p className="font-medium text-gray-900 dark:text-white">{book.pageCount}</p>
                        </div>
                      )}
                      
                      {book.language && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Language</p>
                          <p className="font-medium text-gray-900 dark:text-white">{book.language}</p>
                        </div>
                      )}
                      
                      {book.genre && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Genre</p>
                          <p className="font-medium text-gray-900 dark:text-white">{book.genre}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {book.description && (
                      <div className="mt-6">
                        <p className="text-gray-500 dark:text-gray-400">Description</p>
                        <p className="mt-1 text-gray-900 dark:text-white">{book.description}</p>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="mt-8 flex space-x-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ShoppingCartIcon className="mr-2 h-5 w-5" />
                        Update Stock
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <BookmarkIcon className="mr-2 h-5 w-5" />
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
