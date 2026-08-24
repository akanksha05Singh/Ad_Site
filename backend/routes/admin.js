const express = require('express');
const router = express.Router();
const ScraperSource = require('../models/ScraperSource');
const User = require('../models/User');
const { runScraperTask } = require('../scraper/cronJob');

// Middleware to verify admin (simplified)
const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = await User.findById(token);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @route   GET /api/admin/scraper-sources
// @desc    Get all scraper URLs
router.get('/scraper-sources', isAdmin, async (req, res) => {
  try {
    const sources = await ScraperSource.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sources });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/scraper-sources
// @desc    Add a new scraper URL
router.post('/scraper-sources', isAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    // Simple URL validation
    try {
      new URL(url);
    } catch (_) {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }

    const newSource = new ScraperSource({ url });
    await newSource.save();
    
    res.status(201).json({ success: true, data: newSource });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'URL already exists' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE /api/admin/scraper-sources/:id
// @desc    Delete a scraper URL
router.delete('/scraper-sources/:id', isAdmin, async (req, res) => {
  try {
    const source = await ScraperSource.findByIdAndDelete(req.params.id);
    if (!source) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }
    res.status(200).json({ success: true, message: 'Source deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/scraper-sources/run
// @desc    Manually trigger the scraper
router.post('/scraper-sources/run', isAdmin, async (req, res) => {
  try {
    // Fire and forget so we don't block the request if it takes long
    runScraperTask();
    res.status(200).json({ success: true, message: 'Scraping job triggered manually in the background.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
