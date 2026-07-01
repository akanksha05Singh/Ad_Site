const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Middleware helper to get user from Bearer token
const getAuthUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1]; // Returns the userId token
};

// @route   GET /api/messages
// @desc    Get all message threads/conversations for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = getAuthUser(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized, token required' });
    }

    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar')
    .populate('listingId', 'title category price')
    .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ success: false, error: 'Server error fetching messages' });
  }
});

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post('/', async (req, res) => {
  try {
    const senderId = getAuthUser(req);
    if (!senderId) {
      return res.status(401).json({ success: false, error: 'Unauthorized, token required' });
    }

    const { receiver, listingId, text } = req.body;

    if (!receiver || !listingId || !text || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Please provide receiver ID, listing ID, and message text' });
    }

    if (senderId === receiver) {
      return res.status(400).json({ success: false, error: 'You cannot send a message to yourself' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver,
      listingId,
      text: text.trim()
    });

    const savedMessage = await newMessage.save();
    
    // Populate sender/receiver details for immediate UI response
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .populate('listingId', 'title category price');

    return res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, error: 'Server error sending message' });
  }
});

module.exports = router;
