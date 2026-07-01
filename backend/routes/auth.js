const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper to sanitize user output
const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    bookmarks: user.bookmarks,
    createdAt: user.createdAt
  };
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Hash password and create user
    const passwordHash = User.hashPassword(password);
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'user',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}` // nice default avatar
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      token: savedUser._id, // simplify token as userID for Stage 2
      user: sanitizeUser(savedUser)
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, error: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Match password
    const isMatch = user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      token: user._id,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private (using authorization header)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Not authorized, token missing' });
    }

    const token = authHeader.split(' ')[1];
    
    // In our simplified auth, the token is the user ID
    const user = await User.findById(token).populate('bookmarks');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, error: 'Server error fetching user profile' });
  }
});

// @route   POST /api/auth/bookmark/:listingId
// @desc    Add or remove a bookmark
// @access  Private
router.post('/bookmark/:listingId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    const user = await User.findById(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const listingId = req.params.listingId;
    const isBookmarked = user.bookmarks.includes(listingId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== listingId);
    } else {
      user.bookmarks.push(listingId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      bookmarks: user.bookmarks,
      isBookmarked: !isBookmarked
    });
  } catch (error) {
    console.error('Bookmark error:', error);
    return res.status(500).json({ success: false, error: 'Server error processing bookmark' });
  }
});

module.exports = router;
