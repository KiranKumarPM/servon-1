/**
 * AI Service for client-side API interactions
 * Handles communication with the AI endpoints on the server
 */

const API_URL = 'http://localhost:5001/api';

/**
 * Analyze user requirements using AI
 * @param {string} description - User's requirements description
 * @returns {Promise} - Promise with analysis results
 */
export const analyzeRequirements = async (description) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/ai/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze requirements');
  }

  return response.json();
};

/**
 * Get AI-powered service recommendations based on requirement ID
 * @param {string} requirementId - ID of the requirement
 * @returns {Promise} - Promise with recommendation results
 */
export const getRecommendations = async (requirementId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/ai/recommendations/${requirementId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get recommendations');
  }

  return response.json();
};

/**
 * Get a personalized response for the user
 * @param {string} requirements - User's requirements description
 * @param {string} userId - User's ID
 * @returns {Promise} - Promise with personalized response
 */
export const getPersonalizedResponse = async (requirements, userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/ai/personalized-response`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requirements, userId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate personalized response');
  }

  return response.json();
};

/**
 * Estimate service cost using AI
 * @param {string} requirements - User's requirements description
 * @param {string} serviceType - Type of service requested
 * @returns {Promise} - Promise with cost estimation details
 */
export const estimateServiceCost = async (requirements, serviceType) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/ai/estimate-cost`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requirements, serviceType })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to estimate service cost');
  }

  return response.json();
};

export default {
  analyzeRequirements,
  getRecommendations,
  getPersonalizedResponse,
  estimateServiceCost
};
