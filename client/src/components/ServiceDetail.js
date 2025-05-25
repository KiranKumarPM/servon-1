import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Rating,
  Chip,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ServiceReviews from './ServiceReviews';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the service details from an API
    // For demo purposes, we'll simulate an API call
    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get services from localStorage or use default services
        const servicesString = localStorage.getItem('services');
        const services = servicesString ? JSON.parse(servicesString) : [];
        
        const foundService = services.find(s => s.id === parseInt(id));
        if (foundService) {
          setService(foundService);
        } else {
          // If not found in localStorage, navigate back to services
          navigate('/services');
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!service) {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ my: 4 }}>
          Service not found
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="contained" 
          onClick={() => navigate('/services')}
        >
          Back to Services
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        sx={{ mb: 3 }} 
        onClick={() => navigate('/services')}
      >
        Back to Services
      </Button>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <img 
              src={service.image || 'https://via.placeholder.com/300x200?text=Service'} 
              alt={service.name}
              style={{ width: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" gutterBottom>
                {service.name}
              </Typography>
              <Box>
                <Rating value={service.rating || 4.5} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {service.reviewCount || '15'} reviews
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="h6" color="primary.main" gutterBottom>
              {service.price}
            </Typography>
            
            <Box sx={{ my: 2 }}>
              {service.tags && service.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  variant="outlined" 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            
            <Typography variant="body1" paragraph>
              {service.description || 'No description available for this service.'}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mr: 2 }}
                onClick={() => navigate(`/quote/${service.id}`)}
              >
                Get Quote
              </Button>
              <Button 
                variant="outlined"
                onClick={() => navigate('/quotations')}
              >
                View Quotations
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Service Details
        </Typography>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                What's Included
              </Typography>
              <ul>
                <li>Professional consultation</li>
                <li>Quality materials and tools</li>
                <li>Experienced technicians</li>
                <li>Warranty on service</li>
                <li>Post-service support</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Service Provider
              </Typography>
              <Typography variant="body1">
                <strong>Provider:</strong> {service.provider || 'Professional Services Inc.'}
              </Typography>
              <Typography variant="body1">
                <strong>Experience:</strong> {service.experience || '10+ years'}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {service.location || 'Mumbai, Maharashtra'}
              </Typography>
              <Typography variant="body1">
                <strong>Response Time:</strong> {service.responseTime || 'Within 24 hours'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* Service Reviews Component */}
      <ServiceReviews service={service} />
    </Container>
  );
};

export default ServiceDetail;
