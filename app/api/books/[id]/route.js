import { MongoClient, ObjectId } from 'mongodb';

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await client.connect();
    const database = client.db('CozyReads');
    const books = database.collection('books');
    
    // Find the book by ID
    const book = await books.findOne({ _id: new ObjectId(id) });
    
    if (!book) {
      return Response.json({ error: 'Book not found' }, { status: 404 });
    }
    
    return Response.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return Response.json({ error: 'Failed to fetch book' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    await client.connect();
    const database = client.db('CozyReads');
    const books = database.collection('books');
    
    // Update the book with expanded metadata
    const updateData = {
      title: body.title,
      author: body.author,
      price: body.price,
      quantity: body.quantity,
      updatedAt: new Date()
    };
    
    // Add optional fields if they exist in the request
    if (body.isbn !== undefined) updateData.isbn = body.isbn;
    if (body.genre !== undefined) updateData.genre = body.genre;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.publishedDate !== undefined) updateData.publishedDate = body.publishedDate;
    if (body.publisher !== undefined) updateData.publisher = body.publisher;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.pages !== undefined) updateData.pages = body.pages;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.rating !== undefined) updateData.rating = body.rating;
    
    // Update the book
    const result = await books.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return Response.json({ error: 'Book not found' }, { status: 404 });
    }
    
    return Response.json({ 
      success: true, 
      message: 'Book updated successfully' 
    });
  } catch (error) {
    console.error('Error updating book:', error);
    return Response.json({ error: 'Failed to update book' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await client.connect();
    const database = client.db('CozyReads');
    const books = database.collection('books');
    
    // Delete the book
    const result = await books.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return Response.json({ error: 'Book not found' }, { status: 404 });
    }
    
    return Response.json({ 
      success: true, 
      message: 'Book deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    return Response.json({ error: 'Failed to delete book' }, { status: 500 });
  } finally {
    await client.close();
  }
}
