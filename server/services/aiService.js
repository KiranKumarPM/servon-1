/**
 * AI Service for intelligent recommendations and analysis
 * This service uses basic ML algorithms to provide smart recommendations
 */

// Simple TF-IDF based recommendation system
function calculateSimilarity(userRequirements, serviceDescription) {
  // Convert to lowercase and split into words
  const userWords = userRequirements.toLowerCase().split(/\W+/).filter(word => word.length > 2);
  const serviceWords = serviceDescription.toLowerCase().split(/\W+/).filter(word => word.length > 2);
  
  // Count word frequencies
  const userWordFreq = {};
  const serviceWordFreq = {};
  
  userWords.forEach(word => {
    userWordFreq[word] = (userWordFreq[word] || 0) + 1;
  });
  
  serviceWords.forEach(word => {
    serviceWordFreq[word] = (serviceWordFreq[word] || 0) + 1;
  });
  
  // Calculate similarity score (dot product of word frequencies)
  let similarityScore = 0;
  Object.keys(userWordFreq).forEach(word => {
    if (serviceWordFreq[word]) {
      similarityScore += userWordFreq[word] * serviceWordFreq[word];
    }
  });
  
  return similarityScore;
}

/**
 * Recommends services based on user requirements
 * @param {string} requirements - User's requirements description
 * @param {Array} availableServices - List of available services
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} - Sorted list of recommended services with scores
 */
function recommendServices(requirements, availableServices, limit = 5) {
  // Calculate similarity scores for each service
  const scoredServices = availableServices.map(service => {
    const description = `${service.name} ${service.description || ''} ${service.provider || ''} ${service.businessType || ''}`;
    const score = calculateSimilarity(requirements, description);
    
    return {
      ...service,
      similarityScore: score
    };
  });
  
  // Sort by similarity score (descending)
  const sortedServices = scoredServices.sort((a, b) => b.similarityScore - a.similarityScore);
  
  // Return top N recommendations
  return sortedServices.slice(0, limit);
}

/**
 * Analyzes user requirements to extract key features
 * @param {string} requirements - User's requirements description
 * @returns {Object} - Extracted features and keywords
 */
function analyzeRequirements(requirements) {
  // Extract keywords (simple implementation)
  const words = requirements.toLowerCase().split(/\W+/).filter(word => word.length > 2);
  const wordFreq = {};
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Sort words by frequency
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
  
  // Detect urgency based on specific words
  const urgencyWords = ['urgent', 'emergency', 'immediately', 'asap', 'quick', 'fast'];
  const hasUrgencyWords = words.some(word => urgencyWords.includes(word));
  
  // Estimate complexity based on description length and specific terms
  const complexityWords = ['complex', 'difficult', 'specialized', 'expert', 'professional'];
  const hasComplexityWords = words.some(word => complexityWords.includes(word));
  const complexity = hasComplexityWords ? 'high' : 
                    (requirements.length > 100 ? 'medium' : 'low');
  
  return {
    keywords: sortedWords,
    urgency: hasUrgencyWords ? 'high' : 'normal',
    complexity: complexity,
    estimatedDuration: complexity === 'high' ? '3-5 days' : 
                      (complexity === 'medium' ? '1-2 days' : '2-5 hours')
  };
}

/**
 * Generates a personalized response for the user based on their requirements
 * @param {string} requirements - User's requirements description
 * @param {Object} user - User information
 * @returns {string} - Personalized response
 */
function generatePersonalizedResponse(requirements, user) {
  const analysis = analyzeRequirements(requirements);
  const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                   (new Date().getHours() < 18 ? 'afternoon' : 'evening');
  
  const greeting = `Good ${timeOfDay}, ${user.name}!`;
  const intro = `Based on your requirements, we've analyzed your needs:`;
  
  const urgencyResponse = analysis.urgency === 'high' 
    ? "We understand this is urgent and will prioritize finding you the right service provider quickly."
    : "We'll find you the right service provider for your needs.";
  
  const complexityResponse = `Your request appears to be of ${analysis.complexity} complexity and may take approximately ${analysis.estimatedDuration} to complete.`;
  
  const keywordsResponse = `We've identified these key aspects of your request: ${analysis.keywords.join(', ')}.`;
  
  return `${greeting}\n\n${intro}\n\n${urgencyResponse}\n\n${complexityResponse}\n\n${keywordsResponse}\n\nWe'll connect you with the best service providers for this job.`;
}

/**
 * Estimates the cost of a service based on requirements and service type
 * @param {string} requirements - User's requirements description
 * @param {string} serviceType - Type of service requested
 * @returns {Object} - Cost estimation details
 */
function estimateServiceCost(requirements, serviceType) {
  const analysis = analyzeRequirements(requirements);
  
  // Base rates for different service types (in ₹ per hour)
  const baseRates = {
    'plumbing': 400,
    'electrical': 500,
    'carpentry': 450,
    'painting': 350,
    'cleaning': 300,
    'default': 400
  };
  
  const baseRate = baseRates[serviceType.toLowerCase()] || baseRates.default;
  
  // Adjust rate based on complexity
  const complexityMultiplier = 
    analysis.complexity === 'high' ? 1.5 :
    analysis.complexity === 'medium' ? 1.2 : 1.0;
  
  // Adjust rate based on urgency
  const urgencyMultiplier = analysis.urgency === 'high' ? 1.3 : 1.0;
  
  // Calculate hourly rate
  const hourlyRate = baseRate * complexityMultiplier * urgencyMultiplier;
  
  // Estimate duration in hours
  let estimatedHours;
  if (analysis.complexity === 'high') {
    estimatedHours = { min: 8, max: 20 };
  } else if (analysis.complexity === 'medium') {
    estimatedHours = { min: 4, max: 8 };
  } else {
    estimatedHours = { min: 1, max: 4 };
  }
  
  // Calculate total cost range
  const minCost = Math.round(hourlyRate * estimatedHours.min);
  const maxCost = Math.round(hourlyRate * estimatedHours.max);
  
  return {
    hourlyRate: Math.round(hourlyRate),
    estimatedHours,
    costRange: { min: minCost, max: maxCost },
    formattedEstimate: `₹${minCost} - ₹${maxCost}`,
    complexity: analysis.complexity,
    urgency: analysis.urgency
  };
}

module.exports = {
  recommendServices,
  analyzeRequirements,
  generatePersonalizedResponse,
  estimateServiceCost
};
