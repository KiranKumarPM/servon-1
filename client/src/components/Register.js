import React, { useState } from 'react';
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
  Grid,
  MenuItem
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: 'customer',
    businessType: '',
    location: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate form data
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill all required fields');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      console.log('Sending OTP request with data:', { 
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      });

      const response = await fetch('http://localhost:5001/api/auth/send-otp', {
        // Using port 5001 since our server is running on this port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setMessage(data.message);
      setStep(2);
    } catch (err) {
      console.error('OTP Error:', err);
      setError(err.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/verify-otp', {
        // Using port 5001 since our server is running on this port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          otp: otp,
          userDetails: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            userType: formData.userType,
            businessType: formData.businessType,
            location: formData.location
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const data = await response.json();
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
                mb: 4
              }}
            >
              Create Account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOTP}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

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
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91XXXXXXXXXX"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  select
                  label="User Type"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="provider">Service Provider</MenuItem>
                </TextField>

                {formData.userType === 'provider' && (
                  <>
                    <TextField
                      fullWidth
                      label="Business Type"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

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
                  Send OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                {message && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {message}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                  Verify OTP
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setMessage('');
                  }}
                >
                  Back to Registration
                </Button>
              </form>
            )}

            <Typography
              variant="body1"
              align="center"
              sx={{ mt: 2 }}
            >
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Login here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
}

export default Register;
