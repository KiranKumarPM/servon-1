import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Rating
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RecommendIcon from '@mui/icons-material/Recommend';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SmartToyIcon from '@mui/icons-material/SmartToy';

function AIRecommendations() {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState('');
  const [serviceType, setServiceType] = useState('plumbing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [costEstimate, setCostEstimate] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleRequirementsChange = (e) => {
    setRequirements(e.target.value);
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
  };

  const analyzeRequirements = async () => {
    if (!requirements.trim()) {
      setError('Please enter your requirements');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:5001/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: requirements })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze requirements');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setActiveTab('analysis');
    } catch (err) {
      console.error('Error analyzing requirements:', err);
      setError(err.message || 'Failed to analyze requirements');
    } finally {
      setLoading(false);
    }
  };

  const estimateServiceCost = async () => {
    if (!requirements.trim()) {
      setError('Please enter your requirements');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:5001/api/ai/estimate-cost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          requirements, 
          serviceType 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to estimate service cost');
      }

      const data = await response.json();
      setCostEstimate(data.estimate);
      setActiveTab('cost');
    } catch (err) {
      console.error('Error estimating service cost:', err);
      setError(err.message || 'Failed to estimate service cost');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <SmartToyIcon fontSize="large" />
        AI Service Assistant
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Our AI assistant can analyze your requirements, estimate costs, and provide personalized recommendations.
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mt: 4, 
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Describe your requirements"
              multiline
              rows={4}
              value={requirements}
              onChange={handleRequirementsChange}
              placeholder="Example: I need to fix a leaking pipe in my bathroom. The leak is under the sink and has been ongoing for 2 days."
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Service Type"
              value={serviceType}
              onChange={handleServiceTypeChange}
              SelectProps={{
                native: true,
              }}
              variant="outlined"
            >
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="carpentry">Carpentry</option>
              <option value="painting">Painting</option>
              <option value="cleaning">Cleaning</option>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={analyzeRequirements}
              disabled={loading}
              startIcon={<AnalyticsIcon />}
              sx={{ flex: 1 }}
            >
              Analyze
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={estimateServiceCost}
              disabled={loading}
              startIcon={<MonetizationOnIcon />}
              sx={{ flex: 1 }}
            >
              Estimate Cost
            </Button>
          </Grid>
        </Grid>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        
        {(analysis || costEstimate) && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Button
                variant={activeTab === 'analysis' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('analysis')}
                disabled={!analysis}
                sx={{ mr: 1 }}
              >
                Analysis
              </Button>
              
              <Button
                variant={activeTab === 'cost' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('cost')}
                disabled={!costEstimate}
              >
                Cost Estimate
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {activeTab === 'analysis' && analysis && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Analysis Results
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Complexity:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {analysis.complexity.charAt(0).toUpperCase() + analysis.complexity.slice(1)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Urgency:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Estimated Duration:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {analysis.estimatedDuration}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Keywords:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {analysis.keywords.map((keyword, index) => (
                          <Chip 
                            key={index} 
                            label={keyword} 
                            color="primary" 
                            variant="outlined" 
                            size="small" 
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'cost' && costEstimate && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cost Estimate
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Hourly Rate:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        ₹{costEstimate.hourlyRate}/hour
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Estimated Hours:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {costEstimate.estimatedHours.min} - {costEstimate.estimatedHours.max} hours
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Estimate:
                      </Typography>
                      <Typography variant="h5" color="primary.main" sx={{ mb: 2, fontWeight: 600 }}>
                        {costEstimate.formattedEstimate}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        * This is an AI-generated estimate based on your requirements and may vary based on actual service provider rates and job complexity.
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<RecommendIcon />}
                    fullWidth
                    onClick={() => navigate('/services')}
                  >
                    Find Service Providers
                  </Button>
                </CardActions>
              </Card>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default AIRecommendations;
