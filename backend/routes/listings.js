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
// @desc    Get all listings with search, filters, and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      category, q, owner, location, minPrice, contactEmail,
      state, occupationCategory, employmentType, workFromHome, gender, isScraped,
      status, page = 1, limit = 100
    } = req.query;
    
    let query = {};

    if (status) {
      query.status = status;
    }

    if (category && ['classified', 'job'].includes(category)) {
      query.category = category;
    }

    if (owner) {
      query.owner = owner;
    }

    if (contactEmail) {
      query.contactEmail = contactEmail;
    }
    
    if (location && location.trim() !== '') {
      const locRegex = new RegExp(location.trim(), 'i');
      query.$or = [{ location: locRegex }, { state: locRegex }];
    }

    if (state && state.trim() !== '') {
      query.state = new RegExp(state.trim(), 'i');
    }

    if (occupationCategory && occupationCategory.trim() !== '') {
      query.occupationCategory = new RegExp(occupationCategory.trim(), 'i');
    }

    if (employmentType && employmentType.trim() !== '') {
      query.employmentType = new RegExp(employmentType.trim(), 'i');
    }

    if (workFromHome === 'true') {
      query.workFromHome = true;
    }

    if (gender && gender.trim() !== '' && gender !== 'Any') {
      query.gender = gender.trim();
    }

    if (isScraped !== undefined) {
      query.isScraped = isScraped === 'true';
    }

    if (minPrice && !isNaN(parseFloat(minPrice))) {
      query.price = { $gte: parseFloat(minPrice) };
    }

    if (q && q.trim() !== '') {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }

    // Filter out expired listings (older than 30 days) for public feeds
    if (!owner && !contactEmail) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: thirtyDaysAgo };
    }

    // Pagination logic
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const startIndex = (pageNum - 1) * limitNum;

    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .populate('owner', 'name email avatar role')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limitNum);
    
    return res.status(200).json({
      success: true,
      count: listings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
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
    const { 
      title, description, price, maxPrice, category, location, contactEmail,
      state, occupationCategory, employmentType, workFromHome,
      contactPhone, contactWhatsapp, gender, isFeatured, companyName, companyWebsite
    } = req.body;

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
      maxPrice,
      category,
      location,
      contactEmail,
      state,
      occupationCategory,
      employmentType,
      workFromHome,
      contactPhone,
      contactWhatsapp,
      gender,
      isFeatured: isFeatured || false,
      companyName: companyName || '',
      companyWebsite: companyWebsite || '',
      owner: user ? user._id : null,
      status: 'active',
      isScraped: false
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

    const allowedFields = [
      'title', 'description', 'price', 'maxPrice', 'category', 'location', 'state',
      'contactEmail', 'contactPhone', 'contactWhatsapp', 'status',
      'companyName', 'companyWebsite', 'occupationCategory', 'employmentType',
      'workFromHome', 'gender', 'isFeatured'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

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

// @route   POST /api/listings/:id/repost
// @desc    Repost a listing (bumps createdAt to now)
router.post('/:id/repost', async (req, res) => {
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
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot repost this listing' });
    }

    listing.createdAt = Date.now();
    await listing.save();

    return res.status(200).json({
      success: true,
      message: 'Listing successfully reposted',
      data: listing
    });
  } catch (error) {
    console.error('Error reposting listing:', error);
    return res.status(500).json({ success: false, error: 'Server error reposting listing' });
  }
});

module.exports = router;
