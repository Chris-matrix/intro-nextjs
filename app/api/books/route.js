import { MongoClient } from 'mongodb';

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortField = searchParams.get('sortField') || 'title';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000');
    
    await client.connect();
    const database = client.db('CozyReads');
    const books = database.collection('books');
    
    // Build query based on filters
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre) {
      query.genre = genre;
    }
    
    if (minPrice || maxPrice) {
      query.price = { 
        $gte: minPrice, 
        $lte: maxPrice 
      };
    }
    
    // Count total matching documents for pagination
    const totalBooks = await books.countDocuments(query);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    // Find books with pagination and sorting
    const skip = (page - 1) * limit;
    const allBooks = await books
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return Response.json({
      books: allBooks,
      pagination: {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return Response.json({ error: 'Failed to fetch books' }, { status: 500 });
  } finally {
    // Close the connection when done
    await client.close();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.author) {
      return Response.json({ error: 'Title and author are required' }, { status: 400 });
    }
    
    await client.connect();
    const database = client.db('CozyReads');
    const books = database.collection('books');
    
    // Insert the new book with expanded metadata
    const result = await books.insertOne({
      title: body.title,
      author: body.author,
      price: body.price || 0,
      quantity: body.quantity || 0,
      isbn: body.isbn || '',
      genre: body.genre || '',
      description: body.description || '',
      publishedDate: body.publishedDate || null,
      publisher: body.publisher || '',
      language: body.language || 'English',
      pages: body.pages || 0,
      coverImage: body.coverImage || '',
      tags: body.tags || [],
      rating: body.rating || 0,
      reviews: body.reviews || [],
      salesHistory: body.salesHistory || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return Response.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Book added successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return Response.json({ error: 'Failed to add book' }, { status: 500 });
  } finally {
    await client.close();
  }
<<<<<<< HEAD
<<<<<<< HEAD
}


=======
}
>>>>>>> 3a285dee90da412a71326a90439d625170d3023d
=======
}


>>>>>>> eb6e63ca551e556c552ea5db59ac8c030a68aea7
