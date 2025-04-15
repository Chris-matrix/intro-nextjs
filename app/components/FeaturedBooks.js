'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import BookCard from './BookCard';

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingBook, setViewingBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books?limit=6&sortField=createdAt&sortOrder=desc');
        if (res.ok) {
          const data = await res.json();
          setBooks(data.books || data || []);
        }
      } catch (error) {
        console.error('Error fetching featured books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  const handleViewBook = (book) => {
    setViewingBook(book);
    setEditingBook(null);
  };
  
  const handleEditBook = (book) => {
    setEditingBook(book);
    setViewingBook(null);
  };
  
  if (loading) {
    return (
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Recently Added Books
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Loading featured books...
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (books.length === 0) {
    return (
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Recently Added Books
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              No books found. Add some books to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Recently Added Books
            </h2>
            <p className="mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Check out the latest additions to your collection.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700"
              aria-label="Previous"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              className="p-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700"
              aria-label="Next"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard 
              key={book._id} 
              book={book} 
              onView={handleViewBook} 
              onEdit={handleEditBook} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
