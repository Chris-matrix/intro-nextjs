import { MongoClient } from 'mongodb';

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Handle importing books from CSV/JSON
export async function POST(request) {
  try {
    const body = await request.json();
    const { books, format } = body;
    
    if (!books || !Array.isArray(books) || books.length === 0) {
      return Response.json({ error: 'No valid books data provided' }, { status: 400 });
    }
    
    await client.connect();
    const database = client.db('CozyReads');
    const booksCollection = database.collection('books');
    
    // Process each book to ensure it has required fields
    const processedBooks = books.map(book => ({
      title: book.title || 'Unknown Title',
      author: book.author || 'Unknown Author',
      price: parseFloat(book.price) || 0,
      quantity: parseInt(book.quantity, 10) || 0,
      isbn: book.isbn || '',
      genre: book.genre || '',
      description: book.description || '',
      publishedDate: book.publishedDate || null,
      publisher: book.publisher || '',
      language: book.language || 'English',
      pages: parseInt(book.pages, 10) || 0,
      coverImage: book.coverImage || '',
      tags: book.tags || [],
      rating: parseFloat(book.rating) || 0,
      reviews: book.reviews || [],
      salesHistory: book.salesHistory || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert books into database
    const result = await booksCollection.insertMany(processedBooks);
    
    return Response.json({ 
      success: true, 
      insertedCount: result.insertedCount,
      message: `Successfully imported ${result.insertedCount} books` 
    }, { status: 201 });
  } catch (error) {
    console.error('Error importing books:', error);
    return Response.json({ error: 'Failed to import books' }, { status: 500 });
  } finally {
    await client.close();
  }
}

// Handle exporting books
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    
    await client.connect();
    const database = client.db('CozyReads');
    const booksCollection = database.collection('books');
    
    // Get all books
    const books = await booksCollection.find({}).toArray();
    
    // Transform _id to string for export
    const exportBooks = books.map(book => ({
      ...book,
      _id: book._id.toString()
    }));
    
    return Response.json({ 
      success: true, 
      books: exportBooks,
      count: exportBooks.length
    });
  } catch (error) {
    console.error('Error exporting books:', error);
    return Response.json({ error: 'Failed to export books' }, { status: 500 });
  } finally {
    await client.close();
  }
}
