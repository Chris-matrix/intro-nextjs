'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import AddBookForm from '../components/AddBookForm';
import ToastContainer from '../components/ToastContainer';

export default function AddBookPage() {
  const [refreshBooks, setRefreshBooks] = useState(0);
  
  const handleBookAdded = () => {
    setRefreshBooks(prev => prev + 1);
    toast.success('Book added successfully!');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Book</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Fill out the form below to add a new book to your inventory.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <AddBookForm onBookAdded={handleBookAdded} />
        </div>
      </div>
    </div>
  );
}
