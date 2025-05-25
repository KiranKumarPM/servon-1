const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  serviceId: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  helpful: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index on serviceId and userId to ensure a user can only review a service once
reviewSchema.index({ serviceId: 1, userId: 1 }, { unique: true });

// Add static method to get average rating for a service
reviewSchema.statics.getServiceStats = async function(serviceId) {
  const stats = await this.aggregate([
    { $match: { serviceId: serviceId } },
    { 
      $group: { 
        _id: null, 
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
        distribution: {
          $push: "$rating"
        }
      } 
    }
  ]);
  
  if (stats.length === 0) {
    return { averageRating: 0, reviewCount: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
  
  // Calculate distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].distribution.forEach(rating => {
    distribution[rating]++;
  });
  
  return {
    averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
    reviewCount: stats[0].reviewCount,
    distribution
  };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
