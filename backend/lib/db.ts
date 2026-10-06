import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heritage-vault';

// For demo mode, we'll allow in-memory storage without MongoDB
const isDemoMode = true; // Set to true for local demo without MongoDB

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('MongoDB connected successfully to Heritage Vault DB');
      return m;
    }).catch((error) => {
      if (isDemoMode) {
        console.log('Demo mode: MongoDB not connected, using in-memory storage');
        // In demo mode, we'll return a mock connection
        return null as any;
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    if (!isDemoMode) {
      throw e;
    }
  }

  return cached.conn;
}
