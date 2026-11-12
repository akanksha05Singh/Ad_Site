const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  price: {
    type: Number,
    required: [true, 'Min salary is required'],
    min: [0, 'Min salary must be a positive number']
  },
  maxPrice: {
    type: Number,
    min: [0, 'Max salary must be a positive number']
  },
  category: {
    type: String,
    enum: {
      values: ['classified', 'job', 'JOB'],
      message: '{VALUE} is not a valid category'
    },
    default: 'job'
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  contactEmail: {
    type: String,
    trim: true,
    default: ''
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
  companyName: {
    type: String,
    trim: true,
    default: ''
  },
  companyWebsite: {
    type: String,
    trim: true,
    default: ''
  },
  state: {
    type: String,
    trim: true,
    default: ''
  },
  occupationCategory: {
    type: String,
    trim: true,
    default: ''
  },
  employmentType: {
    type: String,
    trim: true,
    default: 'Any'
  },
  workFromHome: {
    type: Boolean,
    default: false
  },
  isScraped: {
    type: Boolean,
    default: false
  },
  originalLink: {
    type: String,
    trim: true,
    default: ''
  },
  contactPerson: {
    type: String,
    trim: true,
    default: ''
  },
  designation: {
    type: String,
    trim: true,
    default: ''
  },
  contactPhone: {
    type: String,
    trim: true,
    default: ''
  },
  phoneCountryCode: {
    type: String,
    trim: true,
    default: '+91'
  },
  hidePhone: {
    type: Boolean,
    default: false
  },
  contactWhatsapp: {
    type: String,
    trim: true,
    default: ''
  },
  whatsappCountryCode: {
    type: String,
    trim: true,
    default: '+91'
  },
  gender: {
    type: String,
    default: 'Any'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ListingSchema.virtual('formattedPrice').get(function() {
  if (this.category === 'job') {
    return `₹${this.price.toLocaleString()} / month`;
  }
  return `₹${this.price.toLocaleString()}`;
});

ListingSchema.set('toJSON', { virtuals: true });
ListingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Listing', ListingSchema);
