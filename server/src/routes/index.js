const express = require('express');
const router = express.Router();

const verifyRoutes = require('./verifyRoutes');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');

router.use('/verify', verifyRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

module.exports = router;
