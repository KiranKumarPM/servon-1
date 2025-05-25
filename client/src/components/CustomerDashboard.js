import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Rating,
  Tab,
  Tabs,
  Badge,
  Alert,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessIcon from '@mui/icons-material/Business';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function CustomerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [favoriteProviders, setFavoriteProviders] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in and is a customer
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.userType !== 'customer') {
      navigate('/login', { state: { message: 'Please login as a customer' } });
      return;
    }
    
    // Fetch customer data
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // For demo purposes, we'll use mock data
        // In a real app, you would fetch this from your API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        setCustomer({
          id: user.id || '1',
          name: user.name || 'Customer User',
          email: user.email || 'customer@example.com',
          phone: user.phone || '+91 9876543210',
          location: 'Mumbai, Maharashtra',
          isVerified: user.isVerified || true,
          joinedDate: user.createdAt || '2023-05-15',
          profileImage: null
        });
        
        // Mock service requests
        setServiceRequests([
          {
            id: 'sr1',
            serviceType: 'Plumbing Services',
            description: 'Leaking kitchen sink that needs repair',
            location: 'Andheri East, Mumbai',
            date: '2025-05-24',
            status: 'pending',
            quotations: [
              {
                id: 'q1',
                providerName: 'Plumbing Experts',
                amount: 1500,
                rating: 4.5,
                estimatedTime: '2 hours'
              },
              {
                id: 'q2',
                providerName: 'Mumbai Plumbers',
                amount: 1800,
                rating: 4.2,
                estimatedTime: '3 hours'
              }
            ]
          },
          {
            id: 'sr2',
            serviceType: 'Electrical Work',
            description: 'Need to install new light fixtures in the living room',
            location: 'Bandra West, Mumbai',
            date: '2025-05-26',
            status: 'confirmed',
            provider: {
              name: 'ElectroFix Solutions',
              rating: 4.8,
              phone: '+91 9876543211'
            },
            amount: 2500
          },
          {
            id: 'sr3',
            serviceType: 'Painting',
            description: 'Painting for 2 bedrooms with premium quality paint',
            location: 'Powai, Mumbai',
            date: '2025-05-15',
            status: 'completed',
            provider: {
              name: 'ColorMaster Painters',
              rating: 4.7,
              phone: '+91 9876543212'
            },
            amount: 12000,
            isReviewed: true
          }
        ]);
        
        // Mock favorite providers
        setFavoriteProviders([
          {
            id: 'p1',
            name: 'ElectroFix Solutions',
            businessType: 'Electrical Work',
            rating: 4.8,
            reviewCount: 124,
            image: null
          },
          {
            id: 'p2',
            name: 'ColorMaster Painters',
            businessType: 'Painting',
            rating: 4.7,
            reviewCount: 98,
            image: null
          },
          {
            id: 'p3',
            name: 'CleanHome Services',
            businessType: 'Home Cleaning',
            rating: 4.9,
            reviewCount: 156,
            image: null
          }
        ]);
        
        // Mock recent services
        setRecentServices([
          {
            id: 's1',
            name: 'Plumbing Services',
            description: 'Professional plumbing services for all your needs',
            image: 'https://source.unsplash.com/random/300x200/?plumbing',
            rating: 4.5,
            reviewCount: 230
          },
          {
            id: 's2',
            name: 'Electrical Work',
            description: 'Expert electricians for installations and repairs',
            image: 'https://source.unsplash.com/random/300x200/?electrical',
            rating: 4.7,
            reviewCount: 185
          },
          {
            id: 's3',
            name: 'Painting',
            description: 'Quality painting services for homes and offices',
            image: 'https://source.unsplash.com/random/300x200/?painting',
            rating: 4.6,
            reviewCount: 210
          },
          {
            id: 's4',
            name: 'Home Cleaning',
            description: 'Professional cleaning services for spotless homes',
            image: 'https://source.unsplash.com/random/300x200/?cleaning',
            rating: 4.8,
            reviewCount: 275
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerData();
  }, [navigate]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        {/* Customer Profile Section */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={2}>
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
                  src={customer.profileImage}
                >
                  {!customer.profileImage && <PersonIcon sx={{ fontSize: 40 }} />}
                </Avatar>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mr: 1 }}>
                    {customer.name}
                  </Typography>
                  {customer.isVerified && (
                    <Chip 
                      icon={<VerifiedIcon />} 
                      label="Verified" 
                      color="primary" 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {customer.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {customer.phone}
                </Typography>
                <Typography variant="body2">
                  <strong>Member since:</strong> {new Date(customer.joinedDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Location:</strong> {customer.location}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/customer/profile/edit')}
                    sx={{ mt: 1 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Search Section */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Find Services
            </Typography>
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="What service do you need today?"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Popular Services:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry', 'Appliance Repair'].map(service => (
                  <Chip 
                    key={service}
                    label={service} 
                    onClick={() => navigate(`/services?category=${service}`)}
                    clickable
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main Content Tabs */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="customer dashboard tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab 
                  label="My Requests" 
                  icon={
                    <Badge badgeContent={serviceRequests.filter(sr => sr.status === 'pending').length} color="error">
                      <AssignmentIcon />
                    </Badge>
                  } 
                  iconPosition="start" 
                />
                <Tab label="Recent Services" icon={<HistoryIcon />} iconPosition="start" />
                <Tab label="Favorite Providers" icon={<FavoriteIcon />} iconPosition="start" />
                <Tab label="Messages" icon={<MessageIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* My Requests Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Service Requests</Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/services')}
                >
                  Request New Service
                </Button>
              </Box>
              
              {serviceRequests.length > 0 ? (
                <List>
                  {serviceRequests.map(request => (
                    <Paper key={request.id} sx={{ mb: 3, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {request.serviceType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Location: {request.location} | Date: {new Date(request.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {request.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={
                                request.status === 'pending' ? 'Pending Quotes' : 
                                request.status === 'confirmed' ? 'Confirmed' : 
                                'Completed'
                              } 
                              color={
                                request.status === 'pending' ? 'warning' : 
                                request.status === 'confirmed' ? 'info' : 
                                'success'
                              } 
                              size="small" 
                              sx={{ mr: 2 }}
                            />
                            {request.status === 'confirmed' && (
                              <Typography variant="body2">
                                Provider: {request.provider.name} ({request.provider.rating} ★)
                              </Typography>
                            )}
                            {request.status === 'completed' && !request.isReviewed && (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<StarIcon />}
                                onClick={() => navigate(`/review/${request.id}`)}
                              >
                                Leave Review
                              </Button>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            {request.status !== 'pending' && (
                              <Typography variant="h6" color="primary">
                                ₹{request.amount}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: 2 }}>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => navigate(`/customer/requests/${request.id}`)}
                            >
                              View Details
                            </Button>
                            {request.status === 'pending' && (
                              <Button 
                                variant="contained" 
                                color="primary" 
                                size="small"
                                sx={{ ml: 1 }}
                                onClick={() => navigate(`/customer/requests/${request.id}/quotations`)}
                              >
                                View Quotes ({request.quotations?.length || 0})
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {/* Show quotations if status is pending */}
                      {request.status === 'pending' && request.quotations && request.quotations.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Received Quotations:
                          </Typography>
                          <Grid container spacing={2}>
                            {request.quotations.map(quote => (
                              <Grid item xs={12} sm={6} key={quote.id}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="subtitle2">
                                      {quote.providerName}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Rating value={quote.rating} precision={0.1} size="small" readOnly />
                                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({quote.rating})
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                      Estimated time: {quote.estimatedTime}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                      ₹{quote.amount}
                                    </Typography>
                                  </CardContent>
                                  <CardActions>
                                    <Button 
                                      size="small" 
                                      variant="contained" 
                                      color="primary"
                                      fullWidth
                                      onClick={() => {
                                        // Accept quotation logic
                                        setServiceRequests(serviceRequests.map(sr => 
                                          sr.id === request.id 
                                            ? { 
                                                ...sr, 
                                                status: 'confirmed',
                                                provider: {
                                                  name: quote.providerName,
                                                  rating: quote.rating,
                                                  phone: '+91 9876543211' // Mock phone number
                                                },
                                                amount: quote.amount
                                              } 
                                            : sr
                                        ));
                                      }}
                                    >
                                      Accept Quote
                                    </Button>
                                  </CardActions>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  You don't have any service requests yet. Click "Request New Service" to get started.
                </Alert>
              )}
            </TabPanel>
            
            {/* Recent Services Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Recently Viewed Services
              </Typography>
              
              {recentServices.length > 0 ? (
                <Grid container spacing={3}>
                  {recentServices.map(service => (
                    <Grid item xs={12} sm={6} md={3} key={service.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                          <img
                            src={service.image}
                            alt={service.name}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="h2">
                            {service.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={service.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({service.reviewCount})
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {service.description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            variant="contained"
                            onClick={() => navigate(`/services/${service.id}`)}
                          >
                            View Service
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  You haven't viewed any services yet. Explore our services to see them here.
                </Alert>
              )}
            </TabPanel>
            
            {/* Favorite Providers Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Your Favorite Service Providers
              </Typography>
              
              {favoriteProviders.length > 0 ? (
                <Grid container spacing={3}>
                  {favoriteProviders.map(provider => (
                    <Grid item xs={12} sm={6} md={4} key={provider.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              sx={{ width: 60, height: 60, bgcolor: 'primary.main', mr: 2 }}
                              src={provider.image}
                            >
                              {!provider.image && <BusinessIcon sx={{ fontSize: 30 }} />}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {provider.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {provider.businessType}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={provider.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({provider.rating}) · {provider.reviewCount} reviews
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small"
                            onClick={() => navigate(`/providers/${provider.id}`)}
                          >
                            View Profile
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            onClick={() => navigate(`/request-service?provider=${provider.id}`)}
                          >
                            Request Service
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  You don't have any favorite service providers yet. Mark providers as favorites to see them here.
                </Alert>
              )}
            </TabPanel>
            
            {/* Messages Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                This section will show your messages with service providers.
              </Alert>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CustomerDashboard;
