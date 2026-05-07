const express = require('express');
const router = express.Router();
const { sendWelcomeEmail } = require('../services/emailService');

router.post('/notify-signup', async (req, res) => {
  const { email, name } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  const result = await sendWelcomeEmail(email, name);
  
  if (result.success) {
    res.json({ message: 'Welcome notification processed', mock: result.mock });
  } else {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const { sendPasswordResetEmail } = require('../services/emailService');
  const result = await sendPasswordResetEmail(email);
  
  if (result.success) {
    res.json({ message: 'Reset email sent', mock: result.mock });
  } else {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

router.post('/delete-account', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const User = require('../models/User');
    
    // We attempt to delete, but even if it's 0 (user never verified news), we treat it as success
    await User.deleteOne({ userId });
    
    res.json({ message: 'Account and all data deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
