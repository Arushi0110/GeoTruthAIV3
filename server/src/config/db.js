const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/geotruthai');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error: Database unavailable. Proceeding in fallback mode.');
    // process.exit(1); // Removed to prevent crashing the whole app
  }
};

module.exports = connectDB;
