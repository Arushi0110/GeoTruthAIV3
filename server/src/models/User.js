const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  submissions: [{
    text: String,
    prediction: String,
    confidence: Number,
    date: { type: Date, default: Date.now }
  }],
  trustScore: { type: Number, default: 50 },
  label: { type: String, enum: ['Reliable', 'Neutral', 'Suspicious'], default: 'Neutral' },
  fakeRatio: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
