const User = require('../models/User');

const updateUserTrust = async (userId, predictionData) => {
  let user = await User.findOne({ userId });
  if (!user) user = new User({ userId });
  
  user.submissions.push({
    text: predictionData.input_text,
    prediction: predictionData.bert_prediction,
    confidence: predictionData.bert_confidence
  });
  
  const total = user.submissions.length;
  const fakes = user.submissions.filter(s => s.prediction === 'fake').length;
  user.fakeRatio = fakes / total;
  
  user.trustScore = Math.max(0, 100 - (user.fakeRatio * 100));
  user.label = user.fakeRatio < 0.3 ? 'Reliable' : user.fakeRatio > 0.6 ? 'Suspicious' : 'Neutral';
  
  await user.save();
};

const getUserTrust = async (userId) => {
  const user = await User.findOne({ userId });
  return user ? {
    trustScore: user.trustScore,
    label: user.label,
    submissions: user.submissions.length,
    fakeRatio: user.fakeRatio.toFixed(2)
  } : null;
};

module.exports = {
  updateUserTrust,
  getUserTrust
};
