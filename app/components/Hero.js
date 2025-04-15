'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const [stats, setStats] = useState({ books: 0, genres: 0, value: 0 });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/books');
        if (res.ok) {
          const data = await res.json();
          const books = data.books || data || [];
          
          // Calculate stats
          const uniqueGenres = new Set(books.map(book => book.genre).filter(Boolean));
          const totalValue = books.reduce((sum, book) => sum + (book.price * book.quantity), 0);
          
          setStats({
            books: books.length,
            genres: uniqueGenres.size,
            value: totalValue
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Welcome to</span>
                <span className="block text-indigo-600 dark:text-indigo-400">Cozy Reads Inventory</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Keep track of your book collection with our easy-to-use inventory system. Add, edit, and manage your books all in one place.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/books" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    View Inventory
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/add" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 dark:bg-gray-800 dark:text-indigo-300 dark:hover:bg-gray-700">
                    Add New Book
                    <BookOpenIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="bg-white dark:bg-gray-800 shadow-md py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Books</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{stats.books}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Genres</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{stats.genres}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">${stats.value.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
