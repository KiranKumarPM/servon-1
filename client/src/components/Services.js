import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  CardMedia
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InfoIcon from '@mui/icons-material/Info';
import aiService from '../services/aiService';

function Services() {
  const navigate = useNavigate();
  const [quoteDialog, setQuoteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // Debug effect to monitor dialog state
  useEffect(() => {
    console.log('Dialog state changed:', { quoteDialog, selectedService });
    
    // Ensure quote dialog opens only when we have a selected service
    if (quoteDialog && !selectedService) {
      console.error('Quote dialog opened without a selected service');
      setQuoteDialog(false);
    }
  }, [quoteDialog, selectedService]);
  
  // Function to handle viewing service details
  const handleViewServiceDetails = (service) => {
    // Navigate to service detail page
    navigate(`/service/${service.id}`);
  };
  
  const [quoteDetails, setQuoteDetails] = useState({
    description: '',
    duration: '',
    location: ''
  });
  
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEstimate, setAiEstimate] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const validateQuoteDetails = () => {
    const newErrors = {};
    if (!quoteDetails.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!quoteDetails.duration || parseFloat(quoteDetails.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (!quoteDetails.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetQuote = async () => {
    console.log('Quote Details:', quoteDetails);
    console.log('Selected Service:', selectedService);

    if (validateQuoteDetails()) {
      try {
        // First get the traditional estimate
        const hourlyRate = parseInt(selectedService.price.match(/\\d+/)[0]);
        const duration = parseFloat(quoteDetails.duration);
        const estimatedCost = hourlyRate * duration;

        console.log('Traditional Calculation:', { hourlyRate, duration, estimatedCost });

        if (isNaN(estimatedCost)) {
          throw new Error('Invalid calculation');
        }

        // Now get AI-powered estimate
        setAiLoading(true);
        setAiEstimate(null);
        setAiAnalysis(null);
        
        try {
          // Get AI analysis of requirements
          const analysisResponse = await aiService.analyzeRequirements(quoteDetails.description);
          setAiAnalysis(analysisResponse.analysis);
          
          // Get AI cost estimate
          const serviceType = selectedService.name.toLowerCase().includes('plumbing') ? 'plumbing' :
                            selectedService.name.toLowerCase().includes('electrical') ? 'electrical' :
                            selectedService.name.toLowerCase().includes('carpentry') ? 'carpentry' :
                            selectedService.name.toLowerCase().includes('painting') ? 'painting' : 'default';
          
          const estimateResponse = await aiService.estimateServiceCost(quoteDetails.description, serviceType);
          setAiEstimate(estimateResponse.estimate);
          
          console.log('AI Estimate:', estimateResponse.estimate);
        } catch (aiError) {
          console.error('AI estimation error:', aiError);
          // Continue with traditional estimate if AI fails
        } finally {
          setAiLoading(false);
        }

        setSnackbar({
          open: true,
          message: `Quote generated for ${selectedService.name}. Check the dialog for details.`,
          severity: 'success'
        });
      } catch (error) {
        console.error('Calculation error:', error);
        setSnackbar({
          open: true,
          message: 'Error calculating quote. Please try again.',
          severity: 'error'
        });
        setQuoteDialog(false);
        setQuoteDetails({ description: '', duration: '', location: '' });
        setErrors({});
      }
    } else {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly.',
        severity: 'error'
      });
    }
  };

  // Define all services
  const services = [
    {
      id: 1,
      name: 'Plumbing Services',
      provider: 'John\'s Plumbing',
      rating: 4.5,
      price: '₹500/hour',
      description: 'Expert plumbing services including pipe repairs, fixture installation, drain cleaning, and water heater maintenance.',
      image: 'https://images.unsplash.com/photo-1606274741559-d3a3b4a7d20f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Electrical Work',
      provider: 'ElectroTech',
      rating: 4.8,
      price: '₹600/hour',
      description: 'Professional electrical services for residential and commercial properties. Wiring, installations, repairs, and safety inspections.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Carpentry',
      provider: 'WoodWorks',
      rating: 4.3,
      price: '₹450/hour',
      description: 'Custom carpentry services including furniture making, repairs, installations, and wooden structure building.',
      image: 'https://images.unsplash.com/photo-1601564921647-b446839a013f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Painting',
      provider: 'ColorMaster',
      rating: 4.6,
      price: '₹400/hour',
      description: 'Interior and exterior painting services with premium quality paints and expert finish for homes and offices.',
      image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: 'Home Cleaning',
      provider: 'CleanSweep',
      rating: 4.7,
      price: '₹350/hour',
      description: 'Comprehensive home cleaning services including deep cleaning, sanitization, and regular maintenance cleaning.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      name: 'Appliance Repair',
      provider: 'FixIt Appliances',
      rating: 4.4,
      price: '₹550/hour',
      description: 'Repair services for all major household appliances including refrigerators, washing machines, ovens, and air conditioners.',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 7,
      name: 'Gardening & Landscaping',
      provider: 'Green Thumb',
      rating: 4.9,
      price: '₹400/hour',
      description: 'Professional gardening and landscaping services including lawn maintenance, plant care, and garden design.',
      image: 'https://images.unsplash.com/photo-1599685315640-4cbebf7f3c55?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 8,
      name: 'Pest Control',
      provider: 'BugBusters',
      rating: 4.5,
      price: '₹600/visit',
      description: 'Effective pest control services for homes and businesses. Safe elimination of insects, rodents, and other pests.',
      image: 'https://images.unsplash.com/photo-1584179234953-0274809a7499?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 9,
      name: 'Interior Design',
      provider: 'Design Dreams',
      rating: 4.8,
      price: '₹800/hour',
      description: 'Creative interior design services to transform your space. Includes consultation, planning, and execution.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 10,
      name: 'HVAC Services',
      provider: 'Cool Comfort',
      rating: 4.6,
      price: '₹650/hour',
      description: 'Heating, ventilation, and air conditioning services. Installation, maintenance, and repair of all HVAC systems.',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 11,
      name: 'Moving & Packing',
      provider: 'Swift Movers',
      rating: 4.4,
      price: '₹3000/move',
      description: 'Professional moving services with careful handling of your belongings. Includes packing, transportation, and unpacking.',
      image: 'https://images.unsplash.com/photo-1600518464441-9306b00c4ea4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 12,
      name: 'Locksmith',
      provider: 'SecureLock',
      rating: 4.7,
      price: '₹500/service',
      description: 'Emergency and scheduled locksmith services. Lock installation, repair, key duplication, and security upgrades.',
      image: 'https://images.unsplash.com/photo-1617729290430-6b2c8e4a2f0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Available Services
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Browse our wide range of professional services for your home and office needs
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              {service.image && (
                <Box 
                  sx={{ 
                    height: 180, 
                    overflow: 'hidden',
                    backgroundImage: `url(${service.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {service.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {service.provider}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Rating value={service.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({service.rating})
                  </Typography>
                </Box>
                {service.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {service.description}
                  </Typography>
                )}
                <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
                  {service.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => {
                    console.log('Get Quote clicked for:', service.name);
                    setSelectedService(service);
                    setQuoteDialog(true);
                  }}
                >
                  Get Quote
                </Button>
                <Box>
                  <Button 
                    size="small"
                    onClick={() => navigate('/quotations')}
                    sx={{ mr: 1 }}
                  >
                    Quotations
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => handleViewServiceDetails(service)}
                  >
                    Details
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quote Dialog */}
      <Dialog 
        open={quoteDialog} 
        onClose={() => {
          setQuoteDialog(false);
          setQuoteDetails({ description: '', duration: '', location: '' });
          setErrors({});
          setAiEstimate(null);
          setAiAnalysis(null);
        }} 
        maxWidth="md" 
        fullWidth
        TransitionProps={{
          onEnter: () => console.log('Dialog entered'),
          onExited: () => console.log('Dialog exited')
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Get Quote for {selectedService?.name}
          {aiEstimate && (
            <Chip 
              icon={<SmartToyIcon fontSize="small" />} 
              label="AI Enhanced" 
              color="primary" 
              size="small" 
              sx={{ ml: 1 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {!aiEstimate ? (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Please provide the following details to get a quote for {selectedService?.name}.
              </DialogContentText>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Job Description"
                  multiline
                  rows={4}
                  value={quoteDetails.description}
                  onChange={(e) => {
                    setQuoteDetails({ ...quoteDetails, description: e.target.value });
                    setErrors({ ...errors, description: '' });
                  }}
                  error={!!errors.description}
                  helperText={errors.description}
                  sx={{ mt: 2, mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Estimated Duration (hours)"
                  type="number"
                  value={quoteDetails.duration}
                  onChange={(e) => {
                    setQuoteDetails({ ...quoteDetails, duration: e.target.value });
                    setErrors({ ...errors, duration: '' });
                  }}
                  error={!!errors.duration}
                  helperText={errors.duration}
                  inputProps={{ min: 0, step: 0.5 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Location"
                  value={quoteDetails.location}
                  onChange={(e) => {
                    setQuoteDetails({ ...quoteDetails, location: e.target.value });
                    setErrors({ ...errors, location: '' });
                  }}
                  error={!!errors.location}
                  helperText={errors.location}
                />
              </Stack>
            </>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Job Description:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {quoteDetails.description}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Location: {quoteDetails.location}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SmartToyIcon color="primary" />
                      AI-Enhanced Estimate
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Hourly Rate:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          ₹{aiEstimate.hourlyRate}/hour
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Estimated Hours:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {aiEstimate.estimatedHours.min}-{aiEstimate.estimatedHours.max} hours
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Estimate:
                        </Typography>
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600, mb: 2 }}>
                          {aiEstimate.formattedEstimate}
                        </Typography>
                      </Grid>
                      
                      {aiAnalysis && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Complexity:
                            </Typography>
                            <Chip 
                              label={aiAnalysis.complexity.toUpperCase()} 
                              color={aiAnalysis.complexity === 'high' ? 'error' : 
                                    aiAnalysis.complexity === 'medium' ? 'warning' : 'success'} 
                              size="small" 
                              sx={{ mt: 0.5 }}
                            />
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Urgency:
                            </Typography>
                            <Chip 
                              label={aiAnalysis.urgency.toUpperCase()} 
                              color={aiAnalysis.urgency === 'high' ? 'error' : 'info'} 
                              size="small" 
                              sx={{ mt: 0.5 }}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Service Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="subtitle2" color="text.secondary">
                      Service Provider:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedService?.provider}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">
                      Standard Rate:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedService?.price}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">
                      Provider Rating:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={selectedService?.rating} precision={0.5} readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({selectedService?.rating}) · {Math.floor(Math.random() * 20) + 5} reviews
                      </Typography>
                    </Box>
                    
                    {aiAnalysis && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">
                          Keywords Identified:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {aiAnalysis.keywords.slice(0, 5).map((keyword, index) => (
                            <Chip 
                              key={index} 
                              label={keyword} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {aiLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Analyzing your requirements with AI...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {aiEstimate ? (
            <>
              <Button onClick={() => {
                setAiEstimate(null);
                setAiAnalysis(null);
              }}>
                Back
              </Button>
              <Button 
                variant="contained"
                color="success"
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: 'Quote accepted! A service provider will contact you soon.',
                    severity: 'success'
                  });
                  // Create a service request object from the quote details
                  const serviceRequest = {
                    id: 'sr-' + Math.floor(Math.random() * 10000),
                    description: quoteDetails.description,
                    serviceType: selectedService.name,
                    location: quoteDetails.location,
                    duration: `${quoteDetails.duration} hours`,
                    date: new Date().toLocaleDateString(),
                    status: 'open',
                    price: aiEstimate ? aiEstimate.formattedEstimate : `₹${parseInt(selectedService.price.match(/\\d+/)[0]) * parseFloat(quoteDetails.duration)}`
                  };
                  
                  // Navigate to quotations page with the service request data
                  navigate('/quotations', { state: { serviceRequest } });
                  
                  // Reset the dialog state
                  setQuoteDialog(false);
                  setQuoteDetails({ description: '', duration: '', location: '' });
                  setErrors({});
                  setAiEstimate(null);
                  setAiAnalysis(null);
                }}
              >
                Get Quotations
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setQuoteDialog(false)}>Cancel</Button>
              <Button 
                variant="contained"
                onClick={handleGetQuote}
                disabled={aiLoading}
              >
                {aiLoading ? 'Processing...' : 'Get Quote'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Services;
