import { MongoClient } from 'mongodb';

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('CozyReads');
    const books = database.collection('books');
    
    // Get distinct genres
    const genres = await books.distinct('genre');
    
    // Get price range
    const priceStats = await books.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]).toArray();
    
    const priceRange = priceStats.length > 0 
      ? { min: priceStats[0].minPrice, max: priceStats[0].maxPrice }
      : { min: 0, max: 100 };
    
    // If no genres found, provide some defaults
    const filteredGenres = genres.filter(g => g && g.trim() !== '');
    const defaultGenres = filteredGenres.length > 0 
      ? filteredGenres 
      : ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography'];
    
    return Response.json({
      genres: defaultGenres,
      priceRange
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    // Return default values if there's an error
    return Response.json({ 
      genres: ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography'],
      priceRange: { min: 0, max: 100 }
    });
  } finally {
    await client.close();
  }
}
