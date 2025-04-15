'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UpdateBookForm from './UpdateBookForm';
import SkeletonLoader from './SkeletonLoader';

export default function BookList({ refreshTrigger = 0 }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [viewingBook, setViewingBook] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ genre: '', minPrice: '', maxPrice: '' });
    const [genres, setGenres] = useState([]);
    
    // Fetch filter options (genres, price ranges)
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                // Using GET instead of OPTIONS for better compatibility
                const res = await fetch('/api/books/filters');
                if (res.ok) {
                    const data = await res.json();
                    setGenres(data.genres || []);
                }
            } catch (err) {
                console.error('Error fetching filter options:', err);
                // Set some default genres if API fails
                setGenres(['Fiction', 'Non-fiction', 'Science', 'History', 'Biography']);
            }
        };
        
        fetchFilterOptions();
    }, []);
    
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            // Build query parameters
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                sortField,
                sortOrder,
            });
            
            if (searchQuery) params.append('search', searchQuery);
            if (filters.genre) params.append('genre', filters.genre);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            
            const res = await fetch(`/api/books?${params.toString()}`);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            
            const data = await res.json();
            // Handle both new and old API response formats
            setBooks(data.books || data);
            
            // Set pagination if available
            if (data.pagination) {
                setPagination(data.pagination);
            }
            
            setError(null);
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('Failed to load books. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortField, sortOrder, searchQuery, filters]);
    
    useEffect(() => {
        fetchBooks();
    }, [refreshTrigger, pagination.page, sortField, sortOrder, fetchBooks]);
    
    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pagination.page !== 1) {
                setPagination(prev => ({ ...prev, page: 1 }));
            } else {
                fetchBooks();
            }
        }, 500);
        
        return () => clearTimeout(timer);
    }, [searchQuery, filters, pagination.page, fetchBooks]);
    
    const handleEditBook = (book) => {
        setEditingBook(book);
        setViewingBook(null);
    };
    
    const handleViewBook = (book) => {
        setViewingBook(book);
        setEditingBook(null);
    };
    
    const handleBookUpdated = () => {
        setEditingBook(null);
        fetchBooks();
        toast.success('Book updated successfully!');
    };
    
    const handleBookDeleted = () => {
        setEditingBook(null);
        fetchBooks();
        toast.success('Book deleted successfully!');
    };
    
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };
    
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    if (loading && books.length === 0) {
        return <SkeletonLoader />;
    }
    
    if (error) {
        return <div className="p-4 text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>;
    }
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Search by title, author, or ISBN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <select
                        name="genre"
                        className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.genre}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Genres</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                    
                    <div className="flex gap-2">
                        <input
                            type="number"
                            name="minPrice"
                            className="w-24 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Min $"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            className="w-24 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Max $"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>
            
            {/* Book List */}
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Book Inventory</h2>
                
                {books.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No books found matching your criteria.</p>
                    </div>
                ) : (
                    <div>
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-t-md font-medium text-gray-600 text-sm">
                            <div className="col-span-4 flex items-center cursor-pointer" onClick={() => handleSort('title')}>
                                Title
                                {sortField === 'title' && (
                                    sortOrder === 'asc' ? 
                                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                )}
                            </div>
                            <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort('author')}>
                                Author
                                {sortField === 'author' && (
                                    sortOrder === 'asc' ? 
                                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                )}
                            </div>
                            <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('price')}>
                                Price
                                {sortField === 'price' && (
                                    sortOrder === 'asc' ? 
                                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                )}
                            </div>
                            <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('quantity')}>
                                Stock
                                {sortField === 'quantity' && (
                                    sortOrder === 'asc' ? 
                                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                )}
                            </div>
                            <div className="col-span-1">Actions</div>
                        </div>
                        
                        {/* Book Items */}
                        <ul className="divide-y divide-gray-100">
                            {books.map((book) => (
                                <li key={book._id} className="py-3">
                                    {editingBook && editingBook._id === book._id ? (
                                        <UpdateBookForm 
                                            book={{
                                                ...book, 
                                                onUpdate: handleBookUpdated,
                                                onDelete: handleBookDeleted
                                            }} 
                                        />
                                    ) : viewingBook && viewingBook._id === book._id ? (
                                        <div className="bg-indigo-50 p-4 rounded-md">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-medium text-indigo-800">{book.title}</h3>
                                                    <p className="text-gray-700">by {book.author}</p>
                                                </div>
                                                <button 
                                                    onClick={() => setViewingBook(null)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">ISBN</p>
                                                    <p>{book.isbn || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Genre</p>
                                                    <p>{book.genre || 'Uncategorized'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Publisher</p>
                                                    <p>{book.publisher || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Language</p>
                                                    <p>{book.language || 'English'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Pages</p>
                                                    <p>{book.pages || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Published Date</p>
                                                    <p>{book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                            
                                            {book.description && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500">Description</p>
                                                    <p className="text-gray-700">{book.description}</p>
                                                </div>
                                            )}
                                            
                                            <div className="flex justify-between items-center mt-4">
                                                <div>
                                                    <span className="font-bold text-lg">${parseFloat(book.price).toFixed(2)}</span>
                                                    <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                                                        {book.quantity} in stock
                                                    </span>
                                                </div>
                                                <div className="space-x-2">
                                                    <button 
                                                        onClick={() => handleEditBook(book)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-12 md:col-span-4">
                                                <h3 className="text-lg font-medium text-gray-800 cursor-pointer hover:text-indigo-600" onClick={() => handleViewBook(book)}>
                                                    {book.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm md:hidden">by {book.author}</p>
                                            </div>
                                            <div className="hidden md:block md:col-span-3">
                                                <p className="text-gray-700">{book.author}</p>
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <span className="font-medium">${parseFloat(book.price).toFixed(2)}</span>
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <span className={`text-sm px-2 py-1 rounded ${book.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {book.quantity} in stock
                                                </span>
                                            </div>
                                            <div className="col-span-4 md:col-span-1 flex justify-end">
                                                <button 
                                                    onClick={() => handleEditBook(book)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        
                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-gray-600">
                                    Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} books
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`px-3 py-1 rounded ${pagination.page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className={`px-3 py-1 rounded ${pagination.page === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
