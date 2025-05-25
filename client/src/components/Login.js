import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Fade,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('customer');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token) {
      // Redirect to appropriate dashboard based on user type
      if (user.userType === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    }
  }, [navigate]);

  const handleUserTypeChange = (event, newValue) => {
    setUserType(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Include the selected userType in the request
      const loginData = {
        ...formData,
        userType: userType // Add the selected user type
      };
      
      console.log('Sending login request with data:', loginData);
      
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();
      
      // Store user data and token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on user type
      if (data.user.userType === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Fade in timeout={1000}>
        <Card
          sx={{
            p: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            borderRadius: 2,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
            }
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textAlign: 'center',
                mb: 2
              }}
            >
              Welcome Back
            </Typography>
            
            <Tabs
              value={userType}
              onChange={handleUserTypeChange}
              centered
              sx={{ mb: 3 }}
            >
              <Tab value="customer" label="Customer" />
              <Tab value="provider" label="Service Provider" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.2)',
                  }
                }}
              >
                Login
              </Button>
            </form>

            <Typography
              variant="body1"
              align="center"
              sx={{ mt: 2 }}
            >
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Register here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
}

export default Login;
