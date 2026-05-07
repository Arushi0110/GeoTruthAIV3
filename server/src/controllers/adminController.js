const User = require('../models/User');

const getAnalytics = async (req, res) => {
  try {
    const users = await User.find();

    let totalChecks = 0;
    let fakeCount = 0;
    let trustSum = 0;
    let trend = [];

    users.forEach(user => {
      totalChecks += user.submissions.length;

      user.submissions.forEach(sub => {
        if (sub.prediction === 'fake') fakeCount++;
        trustSum += user.trustScore;

        trend.push({
          date: sub.date,
          trust: user.trustScore
        });
      });
    });

    const realCount = totalChecks - fakeCount;
    const avgTrust = totalChecks ? (trustSum / totalChecks).toFixed(1) : 0;

    res.json({
      totalChecks,
      fakeCount,
      realCount,
      avgTrust,
      trend: trend.slice(-20)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAnalytics };
