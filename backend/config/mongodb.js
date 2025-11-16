import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('📡 Attempting MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI);

    // Remove deprecated options warnings
    mongoose.set('strictQuery', false); // optional but clean

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'DOCTOR-APPOINTMENT-WEBSITE',
      serverSelectionTimeoutMS: 5000, // 5s timeout
    });

    console.log(`✅ MongoDB connected at ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
