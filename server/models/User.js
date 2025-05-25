const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['provider', 'customer'],
    required: true,
  },
  businessType: {
    type: String,
    required: function() {
      return this.userType === 'provider';
    },
  },
  location: {
    type: String,
    required: function() {
      return this.userType === 'provider';
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  credits: {
    type: Number,
    default: function() {
      return this.userType === 'provider' ? 0 : null;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
