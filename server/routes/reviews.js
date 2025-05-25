const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Get all reviews for a service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    
    // Get reviews for the service, sorted by newest first
    const reviews = await Review.find({ serviceId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email') // Populate user details
      .lean();
    
    // Get service statistics
    const stats = await Review.getServiceStats(serviceId);
    
    res.json({
      reviews,
      stats
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new review
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;
    
    if (!serviceId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user has already reviewed this service
    const existingReview = await Review.findOne({ 
      serviceId: parseInt(serviceId), 
      userId: req.user.id 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }
    
    // Create new review
    const review = new Review({
      serviceId: parseInt(serviceId),
      userId: req.user.id,
      rating: parseInt(rating),
      comment,
      verified: true
    });
    
    await review.save();
    
    // Get updated service statistics
    const stats = await Review.getServiceStats(parseInt(serviceId));
    
    res.status(201).json({
      review,
      stats,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Find the review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if the user is the owner of the review
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    
    // Update the review
    if (rating) review.rating = parseInt(rating);
    if (comment) review.comment = comment;
    
    await review.save();
    
    // Get updated service statistics
    const stats = await Review.getServiceStats(review.serviceId);
    
    res.json({
      review,
      stats,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if the user is the owner of the review
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    const serviceId = review.serviceId;
    
    // Delete the review
    await Review.findByIdAndDelete(req.params.id);
    
    // Get updated service statistics
    const stats = await Review.getServiceStats(serviceId);
    
    res.json({
      message: 'Review deleted successfully',
      stats
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark a review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    // Find the review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Increment helpful count
    review.helpful += 1;
    await review.save();
    
    res.json({
      message: 'Review marked as helpful',
      helpfulCount: review.helpful
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
