import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  Divider,
  Avatar,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useNavigate } from 'react-router-dom';
import reviewService from '../services/reviewService';

// Styled components
const ReviewPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[3]
  }
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: value === 5 ? theme.palette.success.main :
                    value === 4 ? theme.palette.success.light :
                    value === 3 ? theme.palette.warning.main :
                    value === 2 ? theme.palette.warning.light :
                    theme.palette.error.main,
  }
}));

// Generate random reviews for demo purposes
const generateReviews = (serviceId) => {
  const reviewCount = 5 + Math.floor(Math.random() * 10); // 5-15 reviews
  const reviews = [];
  
  const reviewTexts = [
    "Great service! The technician was professional and completed the job quickly.",
    "Very satisfied with the work done. Would definitely recommend to others.",
    "Good service but a bit expensive compared to others.",
    "The service provider was punctual and did an excellent job.",
    "Excellent work! They went above and beyond what was expected.",
    "The quality of work was good, but they left a mess behind.",
    "Very professional and knowledgeable. Fixed the issue in no time.",
    "Decent service but could improve on communication.",
    "Outstanding service! They were thorough and explained everything clearly.",
    "The technician was friendly and fixed the problem efficiently.",
    "Not completely satisfied with the results. Had to call them back to fix some issues.",
    "Prompt service and reasonable pricing. Will use again.",
    "They did a good job but arrived later than scheduled.",
    "Excellent customer service and quality work.",
    "The service was okay, but I expected more for the price I paid."
  ];
  
  const names = [
    "Rahul Sharma", "Priya Patel", "Amit Kumar", "Deepa Singh", "Vikram Mehta",
    "Neha Gupta", "Sanjay Verma", "Anita Desai", "Rajesh Khanna", "Sunita Rao",
    "Kiran Joshi", "Anil Kapoor", "Meena Iyer", "Suresh Reddy", "Pooja Malhotra"
  ];
  
  for (let i = 0; i < reviewCount; i++) {
    const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars for more positive reviews
    const reviewTextIndex = Math.floor(Math.random() * reviewTexts.length);
    const nameIndex = Math.floor(Math.random() * names.length);
    
    reviews.push({
      id: `review-${serviceId}-${i}`,
      user: {
        id: `user-${i}`,
        name: names[nameIndex],
        avatar: null
      },
      rating,
      comment: reviewTexts[reviewTextIndex],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(), // Random date in last 30 days
      helpful: Math.floor(Math.random() * 10),
      verified: Math.random() > 0.3 // 70% chance of being verified
    });
  }
  
  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
};

const ServiceReviews = ({ service }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Fetch reviews from the API
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Call the review service to get reviews for this service
        const response = await reviewService.getServiceReviews(service.id);
        
        // Format the reviews for display
        const formattedReviews = response.reviews.map(review => ({
          id: review._id,
          user: {
            id: review.userId._id,
            name: review.userId.name,
            avatar: null
          },
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.createdAt).toLocaleDateString(),
          helpful: review.helpful,
          verified: review.verified
        }));
        
        setReviews(formattedReviews);
        
        // Set rating statistics from the API response
        setRatingStats({
          average: response.stats.averageRating,
          total: response.stats.reviewCount,
          distribution: response.stats.distribution
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // If API fails, fall back to generated reviews for demo
        const generatedReviews = generateReviews(service.id);
        setReviews(generatedReviews);
        
        // Calculate rating statistics
        const total = generatedReviews.length;
        const sum = generatedReviews.reduce((acc, review) => acc + review.rating, 0);
        const average = total > 0 ? sum / total : 0;
        
        // Calculate distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        generatedReviews.forEach(review => {
          distribution[review.rating]++;
        });
        
        setRatingStats({
          average: parseFloat(average.toFixed(1)),
          total,
          distribution
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [service.id]);
  
  const handleReviewDialogOpen = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/service/${service.id}` } });
      return;
    }
    
    setReviewDialogOpen(true);
  };
  
  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
    // Reset form
    setNewReview({
      rating: 5,
      comment: ''
    });
  };
  
  const handleReviewSubmit = async () => {
    if (!newReview.comment.trim()) {
      return; // Don't submit empty reviews
    }
    
    setSubmitLoading(true);
    
    try {
      // Call the API to add a new review
      const response = await reviewService.addReview(
        service.id,
        newReview.rating,
        newReview.comment
      );
      
      const user = JSON.parse(localStorage.getItem('user')) || {
        id: 'current-user',
        name: 'You'
      };
      
      // Format the new review for display
      const newReviewObj = {
        id: response.review._id,
        user: {
          id: user.id,
          name: user.name,
          avatar: null
        },
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString(),
        helpful: 0,
        verified: true
      };
      
      // Add new review to the top
      const updatedReviews = [newReviewObj, ...reviews];
      setReviews(updatedReviews);
      
      // Update rating statistics from API response
      setRatingStats({
        average: response.stats.averageRating,
        total: response.stats.reviewCount,
        distribution: response.stats.distribution
      });
      
      setSnackbar({
        open: true,
        message: 'Your review has been submitted successfully!',
        severity: 'success'
      });
      
      handleReviewDialogClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit review. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleHelpfulClick = async (reviewId) => {
    try {
      // Call the API to mark the review as helpful
      const response = await reviewService.markReviewAsHelpful(reviewId);
      
      // Update the local state with the new helpful count
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: response.helpfulCount } 
          : review
      ));
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to mark review as helpful.',
        severity: 'error'
      });
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Ratings & Reviews
      </Typography>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
                  {ratingStats.average}
                </Typography>
                <Rating value={ratingStats.average} precision={0.1} readOnly size="large" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Based on {ratingStats.total} reviews
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 2 }}>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingStats.distribution[rating] || 0;
                  const percentage = ratingStats.total > 0 
                    ? Math.round((count / ratingStats.total) * 100) 
                    : 0;
                    
                  return (
                    <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: 20 }}>
                        {rating}
                      </Typography>
                      <StarIcon sx={{ color: 'gold', fontSize: 16, mx: 0.5 }} />
                      <Box sx={{ flex: 1, mx: 1 }}>
                        <ProgressBar 
                          variant="determinate" 
                          value={percentage}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                        {percentage}%
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={handleReviewDialogOpen}
              >
                Write a Review
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewPaper key={review.id} elevation={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {review.user.avatar ? (
                        <img src={review.user.avatar} alt={review.user.name} />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.user.name}
                        </Typography>
                        {review.verified && (
                          <Chip 
                            icon={<VerifiedIcon fontSize="small" />} 
                            label="Verified" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {review.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                
                <Typography variant="body1" sx={{ my: 2 }}>
                  {review.comment}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    startIcon={<ThumbUpIcon />} 
                    size="small" 
                    onClick={() => handleHelpfulClick(review.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    Helpful ({review.helpful})
                  </Button>
                </Box>
              </ReviewPaper>
            ))
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No reviews yet. Be the first to review this service!
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={handleReviewDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Rate this service
            </Typography>
            <Rating
              size="large"
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
            />
          </Box>
          
          <TextField
            fullWidth
            label="Your review"
            multiline
            rows={4}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Share your experience with this service..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewDialogClose}>Cancel</Button>
          <Button 
            onClick={handleReviewSubmit} 
            variant="contained" 
            disabled={!newReview.comment.trim() || submitLoading}
          >
            {submitLoading ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceReviews;
