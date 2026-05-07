const axios = require('axios');
const { updateUserTrust, getUserTrust } = require('../services/trustService');
let ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';
if (ML_SERVICE_URL && !ML_SERVICE_URL.startsWith('http')) {
  ML_SERVICE_URL = `https://${ML_SERVICE_URL}.onrender.com`;
}

const verifyNews = async (req, res) => {
  try {
    const { text, image_url, userId } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let mlPayload = { text };

    if (image_url) {
      mlPayload.image_url = image_url;
    }

    if (req.file) {
      mlPayload.image_url = req.file.path;
    }

    const mlResponse = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      mlPayload
    );

    if (userId) {
      try {
        await updateUserTrust(userId, mlResponse.data);
      } catch (dbErr) {
        console.warn("⚠️ Warning: Could not update user trust (Database unavailable)");
      }
    }

    let user_trust_score = null;
    if (userId) {
      try {
        user_trust_score = await getUserTrust(userId);
      } catch (dbErr) {
        // Ignore DB error for trust score
      }
    }

    res.json({
      ...mlResponse.data,
      user_trust_score
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Verification failed',
      details: error.message
    });
  }
};

module.exports = { verifyNews };
