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
    const { name, email, password, role, provider } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const emailDomain = email.split('@')[1];
    if (emailDomain === 'freeads.no' && email !== 'admin@freeads.no') {
      return res.status(403).json({
        success: false,
        error: 'Not all @freeads.no emails are accepted. Only admin@freeads.no is allowed.'
      });
    }

    // Domain restriction: Administrator accounts require a verified admin@freeads.no email
    if (role === 'admin') {
      if (email !== 'admin@freeads.no') {
        return res.status(403).json({
          success: false,
          error: 'Administrator accounts can only be registered using the admin@freeads.no email address. Please use a different role or contact your system administrator.'
        });
      }
    }

    // Handle Social Provider Bypass
    if (provider) {
      const passwordHash = User.hashPassword(password || Math.random().toString(36).slice(-8));
      const newUser = new User({
        name,
        email,
        passwordHash,
        role: role || 'user',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        isVerified: true // automatically verified
      });
      const savedUser = await newUser.save();
      return res.status(201).json({
        success: true,
        token: savedUser._id,
        user: sanitizeUser(savedUser)
      });
    }

    // Standard Email Flow (Requires Verification)
    const passwordHash = User.hashPassword(password);
    
    // Generate 6-digit code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'user',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry
    });

    const savedUser = await newUser.save();

    // In a real app, send email here. For MVP, we return it or console log it.
    console.log(`[MVP] Verification Code for ${email}: ${verificationToken}`);

    return res.status(201).json({
      success: true,
      message: 'Verification required',
      userId: savedUser._id,
      verificationToken // Sending back for MVP testing purposes
    });
  } catch (error) {
    console.error('Signup error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
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

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email not verified. Please verify your email first.',
        requiresVerification: true,
        userId: user._id
      });
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

// @route   POST /api/auth/verify-email
// @desc    Verify user email code
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    if (!userId || !code) {
      return res.status(400).json({ success: false, error: 'Missing user ID or verification code' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'User is already verified' });
    }

    if (user.verificationToken !== code) {
      return res.status(400).json({ success: false, error: 'Invalid verification code' });
    }

    if (new Date() > user.verificationTokenExpiry) {
      return res.status(400).json({ success: false, error: 'Verification code has expired' });
    }

    // Success
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      token: user._id,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ success: false, error: 'Server error during verification' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request a password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist for security reasons (don't leak emails)
      // but for this MVP we'll log it to console so the dev can see it
      return res.status(200).json({ success: true, message: 'If email exists, reset link sent' });
    }

    // Generate 6-digit code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    console.log(`[MVP] Password Reset Code for ${email}: ${resetToken}`);

    return res.status(200).json({
      success: true,
      message: 'If email exists, reset link sent',
      resetToken // Return it for MVP testing purposes
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, error: 'Server error during password reset request' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found or invalid code' });
    }

    if (user.resetPasswordToken !== code) {
      return res.status(400).json({ success: false, error: 'Invalid reset code' });
    }

    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ success: false, error: 'Reset code has expired' });
    }

    // Hash the new password and clear the token
    user.passwordHash = User.hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully reset'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, error: 'Server error during password reset' });
  }
});

module.exports = router;
