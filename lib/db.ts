// FILE: /lib/db.ts
import mongoose from 'mongoose';

// Extend global type to include mongoose
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ledgerfy';
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !MONGODB_URI || MONGODB_URI.includes('localhost');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If using mock data, return a mock connection
  if (USE_MOCK_DATA) {
    console.log('🔧 Using mock data - skipping database connection');
    return { 
      readyState: 1, 
      name: 'mock-db',
      host: 'mock-host',
      port: 27017
    };
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((connection) => {
      return connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
