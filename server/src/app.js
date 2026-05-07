require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Connect to Database
connectDB();

// API Routes
app.use('/api', routes);

// Health
app.get('/health', (req, res) => res.json({ status: 'OK', mlService: ML_SERVICE_URL }));

// Proxy ML endpoints
app.use('/ml', async (req, res) => {
  try {
    const response = await axios({ 
      method: req.method, 
      url: `${ML_SERVICE_URL}${req.url}`, 
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(502).json({ error: 'ML service unavailable' });
  }
});

const { errorHandler, notFound } = require('./middlewares/error.middleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;

