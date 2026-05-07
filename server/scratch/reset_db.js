const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../src/models/User');

const resetDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/geotruthai';
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    
    console.log('Clearing all submissions and resetting scores...');
    const result = await User.updateMany({}, {
      $set: {
        submissions: [],
        trustScore: 50,
        label: 'Neutral',
        fakeRatio: 0
      }
    });
    
    console.log(`Successfully reset ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  }
};

resetDB();
