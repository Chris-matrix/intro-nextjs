'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddBookForm({ onBookAdded }) {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        quantity: '',
        isbn: '',
        genre: '',
        description: '',
        publisher: '',
        language: 'English',
        pages: '',
        publishedDate: '',
        coverImage: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            price: '',
            quantity: '',
            isbn: '',
            genre: '',
            description: '',
            publisher: '',
            language: 'English',
            pages: '',
            publishedDate: '',
            coverImage: ''
        });
        setError(null);
    };
    
    const validateForm = () => {
        if (!formData.title || !formData.author) {
            setError('Title and author are required');
            return false;
        }
        
        if (formData.price && isNaN(parseFloat(formData.price))) {
            setError('Price must be a valid number');
            return false;
        }
        
        if (formData.quantity && isNaN(parseInt(formData.quantity, 10))) {
            setError('Quantity must be a valid number');
            return false;
        }
        
        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: formData.price ? parseFloat(formData.price) : 0,
                    quantity: formData.quantity ? parseInt(formData.quantity, 10) : 0,
                    pages: formData.pages ? parseInt(formData.pages, 10) : 0
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            resetForm();
            
            if (typeof onBookAdded === 'function') {
                onBookAdded();
            }
        } catch (err) {
            console.error('Error adding book:', err);
            setError('Failed to add book. Please try again.');
            toast.error('Failed to add book. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Book</h2>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                    <p>{error}</p>
                </div>
            )}
            
            <div className="mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`py-2 px-4 font-medium text-sm ${activeTab === 'basic' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('basic')}
                        type="button"
                    >
                        Basic Info
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm ${activeTab === 'details' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('details')}
                        type="button"
                    >
                        Additional Details
                    </button>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'basic' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input 
                                    id="title"
                                    name="title"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Book title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                                    Author *
                                </label>
                                <input 
                                    id="author"
                                    name="author"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Author name" 
                                    value={formData.author} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($)
                                </label>
                                <input 
                                    id="price"
                                    name="price"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    type="number" 
                                    step="0.01" 
                                    min="0" 
                                    placeholder="29.99" 
                                    value={formData.price} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <input 
                                    id="quantity"
                                    name="quantity"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    type="number" 
                                    min="0" 
                                    placeholder="10" 
                                    value={formData.quantity} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                                ISBN
                            </label>
                            <input 
                                id="isbn"
                                name="isbn"
                                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="ISBN number" 
                                value={formData.isbn} 
                                onChange={handleChange} 
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                                Genre
                            </label>
                            <input 
                                id="genre"
                                name="genre"
                                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Fiction, Non-fiction, etc." 
                                value={formData.genre} 
                                onChange={handleChange} 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                )}
                
                {activeTab === 'details' && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea 
                                id="description"
                                name="description"
                                rows="4"
                                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Book description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                                    Publisher
                                </label>
                                <input 
                                    id="publisher"
                                    name="publisher"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Publisher name" 
                                    value={formData.publisher} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                                    Language
                                </label>
                                <input 
                                    id="language"
                                    name="language"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="English" 
                                    value={formData.language} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                                    Pages
                                </label>
                                <input 
                                    id="pages"
                                    name="pages"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    type="number" 
                                    min="0" 
                                    placeholder="Number of pages" 
                                    value={formData.pages} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Published Date
                                </label>
                                <input 
                                    id="publishedDate"
                                    name="publishedDate"
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    type="date" 
                                    value={formData.publishedDate} 
                                    onChange={handleChange} 
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                                Cover Image URL
                            </label>
                            <input 
                                id="coverImage"
                                name="coverImage"
                                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://example.com/image.jpg" 
                                value={formData.coverImage} 
                                onChange={handleChange} 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                )}
                
                <div className="pt-4">
                    <button 
                        type="submit" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md w-full transition-colors duration-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Book'}
                    </button>
                </div>
            </form>
        </div>
    );
}
