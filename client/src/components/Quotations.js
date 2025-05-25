import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import HandymanIcon from '@mui/icons-material/Handyman';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageIcon from '@mui/icons-material/Message';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

function Quotations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serviceRequest, setServiceRequest] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [acceptDialog, setAcceptDialog] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  
  // Get service request details from location state or fetch from API
  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // If we have service details in location state, use them
        if (location.state?.serviceRequest) {
          setServiceRequest(location.state.serviceRequest);
          
          // Mock quotations data - in a real app, you'd fetch this from an API
          const mockQuotations = generateMockQuotations(location.state.serviceRequest);
          setQuotations(mockQuotations);
        } else {
          // If no state is passed, show sample data
          const mockServiceRequest = {
            id: 'sr-' + Math.floor(Math.random() * 10000),
            description: 'Leaking pipe under kitchen sink needs repair',
            serviceType: 'Plumbing',
            location: 'Bangalore, Karnataka',
            duration: '2 hours',
            date: new Date().toLocaleDateString(),
            status: 'open'
          };
          
          setServiceRequest(mockServiceRequest);
          const mockQuotations = generateMockQuotations(mockServiceRequest);
          setQuotations(mockQuotations);
        }
      } catch (err) {
        console.error('Error fetching quotations:', err);
        setError('Failed to load quotations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location.state]);
  
  // Generate mock quotations for demo purposes
  const generateMockQuotations = (serviceRequest) => {
    const providers = [
      { id: 'p1', name: 'Raj Plumbing Services', rating: 4.8, completedJobs: 124 },
      { id: 'p2', name: 'City Plumbers', rating: 4.5, completedJobs: 87 },
      { id: 'p3', name: 'Quick Fix Solutions', rating: 4.2, completedJobs: 56 },
      { id: 'p4', name: 'Expert Handyman', rating: 4.7, completedJobs: 103 }
    ];
    
    return providers.map((provider, index) => {
      // Calculate a somewhat random price based on the provider's rating
      const basePrice = 500; // Base price for the service
      const priceVariation = Math.floor(Math.random() * 200) - 100; // Random variation between -100 and +100
      const price = basePrice + priceVariation + (provider.rating * 50); // Higher rated providers charge a bit more
      
      return {
        id: `q-${index + 1}`,
        provider,
        price: Math.round(price),
        estimatedDuration: `${Math.floor(Math.random() * 2) + 1}-${Math.floor(Math.random() * 3) + 2} hours`,
        availableDate: new Date(Date.now() + (Math.floor(Math.random() * 3) * 86400000)).toLocaleDateString(), // Random date in next 3 days
        message: `I can help with your ${serviceRequest.serviceType.toLowerCase()} needs. I have the necessary tools and experience to fix this issue quickly and efficiently.`,
        status: 'pending'
      };
    });
  };
  
  const handleAcceptQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setAcceptDialog(true);
  };
  
  const confirmAcceptQuotation = () => {
    // In a real app, you would make an API call here to accept the quotation
    const updatedQuotations = quotations.map(q => 
      q.id === selectedQuotation.id 
        ? { ...q, status: 'accepted' } 
        : { ...q, status: q.status === 'accepted' ? 'pending' : q.status }
    );
    
    setQuotations(updatedQuotations);
    setAcceptDialog(false);
    
    // Show success message or redirect to chat with the provider
  };
  
  const handleContactProvider = (quotation) => {
    // In a real app, this would navigate to a chat with the provider
    navigate('/messages', { 
      state: { 
        provider: quotation.provider,
        serviceRequest
      } 
    });
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading quotations...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/services')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Services
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          variant="outlined" 
          sx={{ mr: 2 }}
          onClick={() => navigate('/services')}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Quotations
        </Typography>
      </Box>
      
      {serviceRequest && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" gutterBottom>
            Service Request Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Description:</strong> {serviceRequest.description}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HandymanIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {serviceRequest.serviceType}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {serviceRequest.location}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Estimated duration: {serviceRequest.duration}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Chip 
                label={serviceRequest.status === 'open' ? 'Open' : 'Closed'} 
                color={serviceRequest.status === 'open' ? 'success' : 'default'}
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>
      )}
      
      <Typography variant="h6" gutterBottom>
        {quotations.length > 0 
          ? `${quotations.length} Quotations Received` 
          : 'No Quotations Yet'}
      </Typography>
      
      {quotations.length > 0 ? (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {quotations.map((quotation, index) => (
            <Card key={quotation.id} sx={{ mb: 3, border: quotation.status === 'accepted' ? '2px solid #4caf50' : '1px solid rgba(0,0,0,0.1)' }}>
              {quotation.status === 'accepted' && (
                <Box sx={{ bgcolor: '#4caf50', color: 'white', py: 0.5, px: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    Accepted Quotation
                  </Typography>
                </Box>
              )}
              
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {quotation.provider.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={quotation.provider.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({quotation.provider.rating})
                          </Typography>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16 }} />
                          <Typography variant="body2">
                            {quotation.provider.completedJobs} jobs completed
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                      {quotation.message}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper', 
                      borderRadius: 1,
                      border: '1px solid rgba(0,0,0,0.1)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
                        ₹{quotation.price}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {quotation.estimatedDuration}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Available: {quotation.availableDate}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              
              <CardActions sx={{ px: 2, pb: 2 }}>
                {quotation.status === 'accepted' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<MessageIcon />}
                    onClick={() => handleContactProvider(quotation)}
                  >
                    Contact Provider
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAcceptQuotation(quotation)}
                    disabled={quotations.some(q => q.status === 'accepted')}
                  >
                    Accept Quotation
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </List>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="body1" color="text.secondary">
            No quotations have been received yet for this service request.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Service providers will review your request and send quotations soon.
          </Typography>
        </Paper>
      )}
      
      {/* Accept Quotation Dialog */}
      <Dialog
        open={acceptDialog}
        onClose={() => setAcceptDialog(false)}
      >
        <DialogTitle>Accept Quotation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to accept the quotation from {selectedQuotation?.provider.name}? 
            This will close your service request to other providers.
          </DialogContentText>
          
          {selectedQuotation && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                {selectedQuotation.provider.name}
              </Typography>
              
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MonetizationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                Price: ₹{selectedQuotation.price}
              </Typography>
              
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                Duration: {selectedQuotation.estimatedDuration}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAcceptQuotation} color="primary" variant="contained">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Quotations;
