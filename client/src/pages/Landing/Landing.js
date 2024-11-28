import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Create as CreateIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const features = [
  {
    icon: <SearchIcon fontSize="large" />,
    title: 'Smart Keyword Research',
    description: 'Discover high-potential keywords using advanced algorithms and real-time data analysis.'
  },
  {
    icon: <CreateIcon fontSize="large" />,
    title: 'AI-Powered Content',
    description: 'Generate engaging, SEO-optimized content that ranks well and converts visitors.'
  },
  {
    icon: <TrendingUpIcon fontSize="large" />,
    title: 'Performance Analytics',
    description: 'Track your content performance and optimize your SEO strategy for better results.'
  }
];

function Landing() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            KeywordKarnival
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Transform your content strategy with AI-powered SEO tools and keyword research
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Ready to boost your SEO game?
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
          >
            Join thousands of content creators who are already using KeywordKarnival
            to improve their search rankings and drive more traffic.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
            >
              Start Your Free Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;
