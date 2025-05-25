import { API_URL } from '../config';

const reviewService = {
  // Get all reviews for a service
  getServiceReviews: async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/reviews/service/${serviceId}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reviews');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching service reviews:', error);
      throw error;
    }
  },
  
  // Add a new review
  addReview: async (serviceId, rating, comment) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serviceId, rating, comment })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },
  
  // Update a review
  updateReview: async (reviewId, rating, comment) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, comment })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },
  
  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
  
  // Mark a review as helpful
  markReviewAsHelpful: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark review as helpful');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  }
};

export default reviewService;
