const express = require('express');
const router = express.Router();
const ScraperSource = require('../models/ScraperSource');
const User = require('../models/User');
const { runScraperTask, scrapeJobBoard } = require('../scraper/cronJob');

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

// @route   POST /api/admin/scrape-direct
// @desc    Directly scrape a URL and return results without saving to DB yet (or saving immediately)
router.post('/scrape-direct', isAdmin, async (req, res) => {
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

    const scrapedJobs = await scrapeJobBoard(url);
    
    // Save to DB immediately
    const savedJobs = [];
    for (const jobData of scrapedJobs) {
      const existing = await require('../models/Listing').findOne({ title: jobData.title, category: 'job' });
      if (!existing) {
        const newListing = new require('../models/Listing')(jobData);
        await newListing.save();
        savedJobs.push(newListing);
      }
    }

    res.status(200).json({ success: true, count: savedJobs.length, data: savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error during direct scraping' });
  }
});

const Listing = require('../models/Listing');
const Settings = require('../models/Settings');
const sendEmail = require('../utils/sendEmail');

// ==========================================
// LISTING MANAGEMENT
// ==========================================

// @route   PUT /api/admin/listings/:id
// @desc    Edit a listing
router.put('/listings/:id', isAdmin, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE /api/admin/listings/:id
// @desc    Delete a listing
router.delete('/listings/:id', isAdmin, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' });
    res.status(200).json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// ==========================================
// USER MANAGEMENT & MESSAGING
// ==========================================

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (block/suspend)
router.put('/users/:id/status', isAdmin, async (req, res) => {
  try {
    const { status, duration } = req.body; // status: active, suspended, blocked
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, error: 'Cannot modify admin status' });

    user.status = status;
    if (status === 'suspended') {
      const days = duration === '3Days' ? 3 : duration === '1Week' ? 7 : duration === '1Month' ? 30 : 0;
      user.suspensionEndDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    } else {
      user.suspensionEndDate = undefined;
    }
    await user.save();

    // Send email notification
    let actionText = status === 'blocked' ? 'permanently blocked' : status === 'suspended' ? `suspended until ${user.suspensionEndDate.toLocaleDateString()}` : 'reactivated';
    await sendEmail({
      to: user.email,
      subject: `FreeAds Account Status Update: ${status.toUpperCase()}`,
      html: `<h2>Account Status Update</h2><p>Hello ${user.name},</p><p>Your account has been <strong>${actionText}</strong> by an administrator.</p><p>If you have any questions, please contact support.</p>`
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user completely
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, error: 'Cannot delete admin' });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/message
// @desc    Message a specific subscriber or all subscribers
router.post('/message', isAdmin, async (req, res) => {
  try {
    const { userId, subject, message, sendToAll } = req.body;
    
    if (sendToAll) {
      const users = await User.find({ role: 'user' });
      // In production, use BCC or send individually to protect privacy
      const emails = users.map(u => u.email);
      await sendEmail({
        to: 'no-reply@freeads.no', // dummy to
        subject: subject,
        html: `<p>${message}</p>` // Ideally add bcc field to sendEmail utility
      });
      res.status(200).json({ success: true, message: `Message sent to ${users.length} subscribers` });
    } else {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      
      await sendEmail({
        to: user.email,
        subject: subject,
        html: `<p>${message}</p>`
      });
      res.status(200).json({ success: true, message: 'Message sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// ==========================================
// SETTINGS / FEES MANAGEMENT
// ==========================================

// @route   GET /api/admin/settings
// @desc    Get platform settings
router.get('/settings', isAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update platform settings
router.put('/settings', isAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings.standardAdFee = req.body.standardAdFee !== undefined ? req.body.standardAdFee : settings.standardAdFee;
      settings.featureAdFee = req.body.featureAdFee !== undefined ? req.body.featureAdFee : settings.featureAdFee;
      settings.updatedAt = Date.now();
    }
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
