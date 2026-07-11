const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000 // fail fast if not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMongoConnected = true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn('⚠️ Fallback enabled: Server will run in Mock In-Memory Database Mode!');
    global.isMongoConnected = false;
  }
};

module.exports = connectDB;
