import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    // Return existing connection immediately
    if (cached.conn && cached.conn.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // Connection pooling optimizations for Vercel
            maxPoolSize: 10,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            // Keep connections alive
            heartbeatFrequencyMS: 10000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('✅ MongoDB connected');
                return mongoose;
            })
            .catch((error) => {
                cached.promise = null;
                console.error('❌ MongoDB connection error:', error.message);
                throw error;
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

// Pre-warm connection on module load (for Vercel)
if (process.env.NODE_ENV === 'production') {
    connectDB().catch(console.error);
}
