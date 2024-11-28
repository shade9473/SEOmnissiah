import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  ContentCopy as ContentCopyIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const KeywordResearch = () => {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeKeyword = async () => {
    if (!seedKeyword.trim()) {
      setError('Please enter a keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/keywords/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seed_keywords: seedKeyword }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze keyword');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const KeywordCard = ({ keyword, metrics }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h3">
            {keyword}
          </Typography>
          <Box>
            <Tooltip title="Copy keyword">
              <IconButton size="small" onClick={() => navigator.clipboard.writeText(keyword)}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save keyword">
              <IconButton size="small">
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip
            icon={<TrendingUpIcon />}
            label={`Volume: ${metrics.volume}`}
            variant="outlined"
            color="primary"
          />
          <Chip
            label={`Competition: ${metrics.competition}`}
            variant="outlined"
            color={metrics.competition < 0.5 ? 'success' : 'warning'}
          />
          <Chip
            label={`CPC: $${metrics.cpc}`}
            variant="outlined"
            color="secondary"
          />
        </Box>
        {metrics.trend && (
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Trend: {metrics.trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Keyword Research
          <Tooltip title="Using Edward Stern's Compact Keywords methodology">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter your seed keyword"
                variant="outlined"
                value={seedKeyword}
                onChange={(e) => setSeedKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeKeyword()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={analyzeKeyword}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                {loading ? 'Analyzing...' : 'Analyze Keyword'}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {results && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              {results.keywords.map((item, index) => (
                <KeywordCard
                  key={index}
                  keyword={item.keyword}
                  metrics={item.metrics}
                />
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default KeywordResearch;
