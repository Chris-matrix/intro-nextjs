'use client';

import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardView() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalValue: 0,
    lowStock: 0,
    genres: {},
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        const booksList = data.books || data;
        setBooks(booksList);
        
        // Calculate stats
        const totalBooks = booksList.length;
        const totalValue = booksList.reduce((sum, book) => sum + (book.price * book.quantity), 0);
        const lowStock = booksList.filter(book => book.quantity < 5).length;
        
        // Count genres
        const genres = {};
        booksList.forEach(book => {
          const genre = book.genre || 'Uncategorized';
          genres[genre] = (genres[genre] || 0) + 1;
        });
        
        setStats({
          totalBooks,
          totalValue,
          lowStock,
          genres,
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching books for dashboard:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  const genreChartData = {
    labels: Object.keys(stats.genres),
    datasets: [
      {
        label: 'Books by Genre',
        data: Object.values(stats.genres),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const inventoryValueData = {
    labels: books.slice(0, 10).map(book => book.title),
    datasets: [
      {
        label: 'Inventory Value ($)',
        data: books.slice(0, 10).map(book => book.price * book.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm h-64"></div>
          <div className="bg-white p-4 rounded-lg shadow-sm h-64"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard</h2>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalBooks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Inventory Value</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-amber-600">{stats.lowStock}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Books by Genre</h3>
          <div className="h-64">
            <Pie data={genreChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Top 10 Books by Value</h3>
          <div className="h-64">
            <Bar data={inventoryValueData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
