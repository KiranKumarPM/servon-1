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
  Alert
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`provider-tabpanel-${index}`}
      aria-labelledby={`provider-tab-${index}`}
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

function ProviderDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    thisMonth: 0
  });
  const [stats, setStats] = useState({
    totalServices: 0,
    activeQuotations: 0,
    completedJobs: 0,
    averageRating: 0,
    totalReviews: 0
  });

  useEffect(() => {
    // Check if user is logged in and is a provider
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.userType !== 'provider') {
      navigate('/login', { state: { message: 'Please login as a service provider' } });
      return;
    }
    
    // Fetch provider data
    const fetchProviderData = async () => {
      setLoading(true);
      try {
        // For demo purposes, we'll use mock data
        // In a real app, you would fetch this from your API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        setProvider({
          id: user.id || '1',
          name: user.name || 'Service Provider',
          businessType: user.businessType || 'Plumbing Services',
          location: user.location || 'Mumbai, Maharashtra',
          isVerified: user.isVerified || true,
          joinedDate: user.createdAt || '2023-01-15',
          credits: user.credits || 500,
          profileImage: null
        });
        
        // Mock services offered by this provider
        setServices([
          {
            id: 1,
            name: 'Basic Plumbing Service',
            description: 'Fixing leaks, unclogging drains, and basic plumbing repairs',
            price: '₹500/hour',
            rating: 4.5,
            reviewCount: 28,
            isActive: true
          },
          {
            id: 2,
            name: 'Advanced Plumbing Installation',
            description: 'Installation of new plumbing systems, fixtures, and appliances',
            price: '₹800/hour',
            rating: 4.7,
            reviewCount: 15,
            isActive: true
          },
          {
            id: 3,
            name: 'Emergency Plumbing Service',
            description: '24/7 emergency service for urgent plumbing issues',
            price: '₹1200/hour',
            rating: 4.8,
            reviewCount: 32,
            isActive: true
          }
        ]);
        
        // Mock quotations
        setQuotations([
          {
            id: 'q1',
            customerName: 'Rahul Sharma',
            serviceType: 'Basic Plumbing Service',
            description: 'Leaking kitchen sink that needs repair',
            location: 'Andheri East, Mumbai',
            date: '2025-05-24',
            status: 'pending',
            amount: 1500
          },
          {
            id: 'q2',
            customerName: 'Priya Patel',
            serviceType: 'Advanced Plumbing Installation',
            description: 'Need to install a new water heater in the bathroom',
            location: 'Bandra West, Mumbai',
            date: '2025-05-26',
            status: 'accepted',
            amount: 3200
          },
          {
            id: 'q3',
            customerName: 'Amit Kumar',
            serviceType: 'Emergency Plumbing Service',
            description: 'Burst pipe causing water damage to the ceiling',
            location: 'Powai, Mumbai',
            date: '2025-05-23',
            status: 'completed',
            amount: 2400
          }
        ]);
        
        // Mock earnings data
        setEarnings({
          total: 25000,
          pending: 4500,
          thisMonth: 12000
        });
        
        // Mock stats
        setStats({
          totalServices: 3,
          activeQuotations: 2,
          completedJobs: 15,
          averageRating: 4.6,
          totalReviews: 75
        });
        
      } catch (error) {
        console.error('Error fetching provider data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviderData();
  }, [navigate]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
        {/* Provider Profile Section */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={2}>
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
                  src={provider.profileImage}
                >
                  {!provider.profileImage && <BusinessIcon sx={{ fontSize: 40 }} />}
                </Avatar>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mr: 1 }}>
                    {provider.name}
                  </Typography>
                  {provider.isVerified && (
                    <Chip 
                      icon={<VerifiedIcon />} 
                      label="Verified" 
                      color="primary" 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {provider.businessType}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Location:</strong> {provider.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Member since:</strong> {new Date(provider.joinedDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 1 }}>
                    <Rating value={stats.averageRating} precision={0.1} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({stats.averageRating}) · {stats.totalReviews} reviews
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 1 }}>
                    <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Credits:</strong> ₹{provider.credits}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/provider/profile/edit')}
                    sx={{ mt: 1 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    ₹{earnings.total}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    ₹{earnings.thisMonth} this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Services Offered
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.totalServices}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    All active services
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Active Quotations
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.activeQuotations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Pending customer approval
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Completed Jobs
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.completedJobs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Total jobs completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Main Content Tabs */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="provider dashboard tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Services" icon={<LocalOfferIcon />} iconPosition="start" />
                <Tab 
                  label="Quotations" 
                  icon={
                    <Badge badgeContent={quotations.filter(q => q.status === 'pending').length} color="error">
                      <AssignmentIcon />
                    </Badge>
                  } 
                  iconPosition="start" 
                />
                <Tab label="Customers" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Reviews" icon={<StarIcon />} iconPosition="start" />
                <Tab label="Messages" icon={<MessageIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Services Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Your Services</Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/provider/services/add')}
                >
                  Add New Service
                </Button>
              </Box>
              
              {services.length > 0 ? (
                <Grid container spacing={3}>
                  {services.map(service => (
                    <Grid item xs={12} md={6} key={service.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="div">
                              {service.name}
                            </Typography>
                            <Chip 
                              label={service.isActive ? 'Active' : 'Inactive'} 
                              color={service.isActive ? 'success' : 'default'} 
                              size="small" 
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {service.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" color="primary" fontWeight="bold">
                              {service.price}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={service.rating} precision={0.1} size="small" readOnly />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({service.reviewCount})
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => navigate(`/provider/services/edit/${service.id}`)}>
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            color={service.isActive ? 'error' : 'success'}
                            onClick={() => {
                              // Toggle service active status
                              setServices(services.map(s => 
                                s.id === service.id ? { ...s, isActive: !s.isActive } : s
                              ));
                            }}
                          >
                            {service.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  You haven't added any services yet. Click "Add New Service" to get started.
                </Alert>
              )}
            </TabPanel>
            
            {/* Quotations Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">Quotation Requests</Typography>
              </Box>
              
              {quotations.length > 0 ? (
                <List>
                  {quotations.map(quotation => (
                    <Paper key={quotation.id} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {quotation.serviceType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            From: {quotation.customerName} | Location: {quotation.location}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {quotation.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={
                                quotation.status === 'pending' ? 'Pending' : 
                                quotation.status === 'accepted' ? 'Accepted' : 
                                'Completed'
                              } 
                              color={
                                quotation.status === 'pending' ? 'warning' : 
                                quotation.status === 'accepted' ? 'info' : 
                                'success'
                              } 
                              size="small" 
                              sx={{ mr: 2 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Requested for: {new Date(quotation.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="h6" color="primary">
                              ₹{quotation.amount}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: 2 }}>
                            {quotation.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outlined" 
                                  color="error" 
                                  size="small" 
                                  sx={{ mr: 1 }}
                                  onClick={() => {
                                    // Reject quotation logic
                                    setQuotations(quotations.filter(q => q.id !== quotation.id));
                                  }}
                                >
                                  Reject
                                </Button>
                                <Button 
                                  variant="contained" 
                                  color="primary" 
                                  size="small"
                                  onClick={() => {
                                    // Accept quotation logic
                                    setQuotations(quotations.map(q => 
                                      q.id === quotation.id ? { ...q, status: 'accepted' } : q
                                    ));
                                  }}
                                >
                                  Accept
                                </Button>
                              </>
                            )}
                            {quotation.status === 'accepted' && (
                              <Button 
                                variant="contained" 
                                color="success" 
                                size="small"
                                onClick={() => {
                                  // Mark as completed logic
                                  setQuotations(quotations.map(q => 
                                    q.id === quotation.id ? { ...q, status: 'completed' } : q
                                  ));
                                }}
                              >
                                Mark Completed
                              </Button>
                            )}
                            {quotation.status === 'completed' && (
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => navigate(`/provider/quotations/${quotation.id}`)}
                              >
                                View Details
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  You don't have any quotation requests yet.
                </Alert>
              )}
            </TabPanel>
            
            {/* Customers Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Your Customers
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                This section will show your customer list and their service history.
              </Alert>
            </TabPanel>
            
            {/* Reviews Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                This section will display reviews from your customers.
              </Alert>
            </TabPanel>
            
            {/* Messages Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                This section will show your message history with customers.
              </Alert>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProviderDashboard;
