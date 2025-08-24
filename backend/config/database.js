import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log("🔎 MONGODB_URI:", process.env.MONGO_URI); // <-- debug
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
