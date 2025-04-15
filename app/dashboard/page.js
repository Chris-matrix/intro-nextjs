'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardView from '../components/DashboardView';
import ToastContainer from '../components/ToastContainer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            View insights and statistics about your book collection.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <DashboardView />
        </div>
      </div>
    </div>
  );
}
