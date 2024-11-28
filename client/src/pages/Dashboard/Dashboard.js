import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Create as CreateIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const StatCard = ({ title, value, icon, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, searchesResponse] = await Promise.all([
          axios.get('/api/dashboard/stats'),
          axios.get('/api/dashboard/recent-searches'),
        ]);

        setStats(statsResponse.data);
        setRecentSearches(searchesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Research Keywords',
      description: 'Find high-potential keywords for your content',
      icon: <SearchIcon />,
      action: () => navigate('/dashboard/keywords'),
    },
    {
      title: 'Generate Content',
      description: 'Create SEO-optimized content',
      icon: <CreateIcon />,
      action: () => navigate('/dashboard/content'),
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.email?.split('@')[0]}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your SEO performance and tools.
        </Typography>
      </Paper>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Credits"
            value={stats?.credits || 0}
            icon={<StarIcon sx={{ color: 'white' }} />}
            subtitle="Available credits"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Searches"
            value={stats?.searches || 0}
            icon={<SearchIcon sx={{ color: 'white' }} />}
            subtitle="Total keyword searches"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Content"
            value={stats?.content || 0}
            icon={<CreateIcon sx={{ color: 'white' }} />}
            subtitle="Pieces generated"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Growth"
            value={`${stats?.growth || 0}%`}
            icon={<TrendingUpIcon sx={{ color: 'white' }} />}
            subtitle="Monthly growth"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              {quickActions.map((action, index) => (
                <React.Fragment key={action.title}>
                  <ListItem
                    button
                    onClick={action.action}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>{action.icon}</ListItemIcon>
                    <ListItemText
                      primary={action.title}
                      secondary={action.description}
                    />
                  </ListItem>
                  {index < quickActions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Searches
            </Typography>
            {recentSearches.length > 0 ? (
              <List>
                {recentSearches.map((search, index) => (
                  <React.Fragment key={search.id}>
                    <ListItem
                      button
                      onClick={() => navigate(`/dashboard/keywords?q=${search.keyword}`)}
                    >
                      <ListItemIcon>
                        <SearchIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={search.keyword}
                        secondary={new Date(search.timestamp).toLocaleDateString()}
                      />
                    </ListItem>
                    {index < recentSearches.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={3}>
                <Typography color="text.secondary">
                  No recent searches yet
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard/keywords')}
                  sx={{ mt: 2 }}
                >
                  Start Researching
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
