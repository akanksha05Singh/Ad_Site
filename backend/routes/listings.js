const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const User = require('../models/User');

// Helper to get auth user from token (simplified)
const getAuthUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return await User.findById(token);
};

// @route   GET /api/listings
// @desc    Get all listings with optional search and category filters
router.get('/', async (req, res) => {
  try {
    const { category, q, owner } = req.query;
    let query = {};

    if (category && ['classified', 'job'].includes(category)) {
      query.category = category;
    }

    if (owner) {
      query.owner = owner;
    }

    if (q && q.trim() !== '') {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }

    const listings = await Listing.find(query)
      .populate('owner', 'name email avatar role')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return res.status(500).json({ success: false, error: 'Server error fetching listings' });
  }
});

// @route   POST /api/listings
// @desc    Create a new listing
router.post('/', async (req, res) => {
  try {
    const { title, description, price, category, location, contactEmail } = req.body;

    if (!title || !description || price === undefined || !category || !location || !contactEmail) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Optional owner lookup from authorization token
    const user = await getAuthUser(req);

    const newListing = new Listing({
      title,
      description,
      price,
      category,
      location,
      contactEmail,
      owner: user ? user._id : null,
      status: 'active'
    });

    const savedListing = await newListing.save();

    return res.status(201).json({
      success: true,
      data: savedListing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    return res.status(500).json({ success: false, error: 'Server error creating listing' });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update an existing listing
router.put('/:id', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // Check ownership (only owner or admin can edit)
    if (listing.owner && listing.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not own this listing' });
    }

    const { title, description, price, category, location, contactEmail, status } = req.body;
    
    // Update fields
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price !== undefined) listing.price = price;
    if (category) listing.category = category;
    if (location) listing.location = location;
    if (contactEmail) listing.contactEmail = contactEmail;
    if (status) listing.status = status;

    const updatedListing = await listing.save();

    return res.status(200).json({
      success: true,
      data: updatedListing
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    return res.status(500).json({ success: false, error: 'Server error updating listing' });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
router.delete('/:id', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // Check ownership
    if (listing.owner && listing.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Listing successfully deleted'
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return res.status(500).json({ success: false, error: 'Server error deleting listing' });
  }
});

module.exports = router;
