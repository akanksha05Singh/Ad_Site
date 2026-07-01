const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Helper static method to hash passwords using built-in crypto
UserSchema.statics.hashPassword = function(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Instance method to check password validity
UserSchema.methods.matchPassword = function(enteredPassword) {
  const hash = crypto.createHash('sha256').update(enteredPassword).digest('hex');
  return this.passwordHash === hash;
};

module.exports = mongoose.model('User', UserSchema);
