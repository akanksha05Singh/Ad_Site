const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const Listing = require('./models/Listing');
const { seedDatabaseIfNeeded } = require('./seedData');
const listingsRouter = require('./routes/listings');
const authRouter = require('./routes/auth');
const messagesRouter = require('./routes/messages');

const app = express();

// 1. Production HTTP Headers Security (Helmet protection)
app.use(helmet());

// 2. Strict CORS Whitelisting for deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true
}));

app.use(express.json());

// 3. API Rate Limiting to prevent brute-force/DDoS on auth endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    error: 'Too many login or registration attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authRateLimiter);

// Routes
app.use('/api/listings', listingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'FreeAds API is fully operational' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freeads';

// 4. Production-tuned Mongoose connection pools
const mongooseOptions = {
  maxPoolSize: 50,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(async () => {
    console.log('Successfully connected to MongoDB with production connection pool configuration.');
    // Seed sample listings if database is empty
    await seedDatabaseIfNeeded(Listing);
    
    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed! Please make sure MongoDB is running.', err.message);
    
    // Fallback: If MongoDB fails, let server start anyway to allow client to connect
    app.get('/api/listings', (req, res) => {
      res.status(503).json({
        success: false,
        error: 'Database connection failed. Please ensure MongoDB is running locally on your system.'
      });
    });
    
    app.listen(PORT, () => {
      console.warn(`Server started on port ${PORT} without MongoDB connection (running in fallback error mode).`);
    });
  });
