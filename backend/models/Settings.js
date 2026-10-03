const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  standardAdFee: {
    type: Number,
    default: 0
  },
  featureAdFee: {
    type: Number,
    default: 10
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
