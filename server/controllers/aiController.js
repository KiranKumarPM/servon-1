const aiService = require('../services/aiService');
const Service = require('../models/Service');
const Requirement = require('../models/Requirement');
const User = require('../models/User');

/**
 * Get AI-powered service recommendations based on user requirements
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { requirementId } = req.params;
    
    // Get the requirement details
    const requirement = await Requirement.findById(requirementId);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    // Get all available services
    const services = await Service.find().populate('provider', 'name rating');
    
    // Generate recommendations using AI service
    const recommendations = aiService.recommendServices(
      requirement.description,
      services,
      5 // Limit to top 5 recommendations
    );
    
    res.json({
      requirement,
      recommendations
    });
  } catch (error) {
    console.error('Error in AI recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};

/**
 * Analyze user requirements and provide insights
 */
exports.analyzeRequirements = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    
    // Analyze requirements using AI service
    const analysis = aiService.analyzeRequirements(description);
    
    res.json({
      analysis,
      description
    });
  } catch (error) {
    console.error('Error in AI analysis:', error);
    res.status(500).json({ message: 'Error analyzing requirements', error: error.message });
  }
};

/**
 * Generate a personalized response for the user
 */
exports.getPersonalizedResponse = async (req, res) => {
  try {
    const { requirements, userId } = req.body;
    
    if (!requirements || !userId) {
      return res.status(400).json({ message: 'Requirements and userId are required' });
    }
    
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate personalized response using AI service
    const response = aiService.generatePersonalizedResponse(requirements, user);
    
    res.json({
      response,
      user: { id: user._id, name: user.name }
    });
  } catch (error) {
    console.error('Error generating personalized response:', error);
    res.status(500).json({ message: 'Error generating response', error: error.message });
  }
};

/**
 * Estimate service cost based on requirements
 */
exports.estimateServiceCost = async (req, res) => {
  try {
    const { requirements, serviceType } = req.body;
    
    if (!requirements || !serviceType) {
      return res.status(400).json({ message: 'Requirements and serviceType are required' });
    }
    
    // Estimate cost using AI service
    const costEstimate = aiService.estimateServiceCost(requirements, serviceType);
    
    res.json({
      estimate: costEstimate,
      serviceType
    });
  } catch (error) {
    console.error('Error estimating service cost:', error);
    res.status(500).json({ message: 'Error estimating cost', error: error.message });
  }
};
