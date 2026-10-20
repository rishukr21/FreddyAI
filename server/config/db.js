import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freddyai';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Local MongoDB connection failed (${error.message}).`);
    console.warn(`👉 Running with in-memory cache/mock store until MongoDB is started or MONGODB_URI is provided in .env.`);
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => isConnected;
