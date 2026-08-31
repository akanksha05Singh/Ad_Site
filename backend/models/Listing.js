const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price or Min Salary is required'],
    min: [0, 'Price must be a positive number']
  },
  maxPrice: {
    type: Number,
    min: [0, 'Max Salary must be a positive number']
  },
  category: {
    type: String,
    enum: {
      values: ['classified', 'job'],
      message: '{VALUE} is not a valid category (must be "classified" or "job")'
    },
    required: [true, 'Category is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'pending'],
    default: 'active'
  },
  // New Job Filtering Fields
  state: {
    type: String,
    trim: true
  },
  occupationCategory: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String, // e.g. "Full-time", "Part-time"
    trim: true
  },
  workFromHome: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for formatted price or salary string
ListingSchema.virtual('formattedPrice').get(function() {
  if (this.category === 'job') {
    return `${this.price.toLocaleString()} NOK / year`;
  }
  return `${this.price.toLocaleString()} NOK`;
});

// Ensure virtuals are serialized
ListingSchema.set('toJSON', { virtuals: true });
ListingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Listing', ListingSchema);
