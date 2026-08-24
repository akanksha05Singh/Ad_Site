const mongoose = require('mongoose');

const ScraperSourceSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastScrapedAt: {
    type: Date,
    default: null
  },
  jobsFound: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScraperSource', ScraperSourceSchema);
