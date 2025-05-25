import { Box, Container, Typography, Grid, Paper, Stack, Fade } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';

function HowItWorks() {
  const steps = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '1. Search for Services',
      description: 'Browse through our wide range of verified service providers in your area.'
    },
    {
      icon: <HandshakeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '2. Connect with Providers',
      description: 'Get instant quotes from multiple service providers and choose the best one.'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '3. Secure Payment',
      description: 'Make secure payments through our platform only after service completion.'
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '4. Rate & Review',
      description: 'Share your experience and help others make informed decisions.'
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 600,
                mb: 2,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              How SERVON Works
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Get your service needs met in four simple steps
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={1000 + (index * 200)}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    bgcolor: 'background.paper',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      bgcolor: 'background.accent'
                    }
                  }}
                >
                  <Stack spacing={2} alignItems="center" sx={{ height: '100%' }}>
                    {step.icon}
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary" align="center">
                      {step.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HowItWorks;
