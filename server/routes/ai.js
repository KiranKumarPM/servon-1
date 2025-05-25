const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Get AI-powered service recommendations based on requirement ID
router.get('/recommendations/:requirementId', auth, aiController.getRecommendations);

// Analyze requirements and provide insights
router.post('/analyze', auth, aiController.analyzeRequirements);

// Generate personalized response
router.post('/personalized-response', auth, aiController.getPersonalizedResponse);

// Estimate service cost
router.post('/estimate-cost', auth, aiController.estimateServiceCost);

module.exports = router;
