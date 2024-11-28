import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  ContentCopy as ContentCopyIcon,
  Save as SaveIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import axios from 'axios';

const KeywordMetricsCard = ({ title, value, icon, info }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Tooltip title={info}>
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        {icon}
        <Typography variant="h4" component="div" ml={1}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const KeywordResearch = () => {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedKeywords, setSavedKeywords] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentKeywordSearches') || '[]');
    setRecentSearches(recent);
    
    // Load saved keywords
    const saved = JSON.parse(localStorage.getItem('savedKeywords') || '[]');
    setSavedKeywords(saved);
  }, []);

  const analyzeKeyword = async (keyword = seedKeyword) => {
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/keywords/analyze', {
        seed_keyword: keyword,
      });

      setResults(response.data);
      
      // Update recent searches
      const updatedSearches = [
        keyword,
        ...recentSearches.filter(k => k !== keyword)
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentKeywordSearches', JSON.stringify(updatedSearches));
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to analyze keyword');
    } finally {
      setLoading(false);
    }
  };

  const saveKeyword = (keyword) => {
    const updated = [...new Set([...savedKeywords, keyword])];
    setSavedKeywords(updated);
    localStorage.setItem('savedKeywords', JSON.stringify(updated));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Keyword Research
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
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
                size="large"
                onClick={() => analyzeKeyword()}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Recent Searches
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {recentSearches.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onClick={() => {
                    setSeedKeyword(keyword);
                    analyzeKeyword(keyword);
                  }}
                  icon={<HistoryIcon />}
                />
              ))}
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {results && (
          <>
            {/* Metrics Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <KeywordMetricsCard
                  title="Search Volume"
                  value={results.metrics.volume}
                  icon={<TrendingUpIcon color="primary" />}
                  info="Monthly search volume for this keyword"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KeywordMetricsCard
                  title="Competition"
                  value={`${(results.metrics.competition * 100).toFixed(1)}%`}
                  icon={<TrendingUpIcon color="secondary" />}
                  info="Competition level for this keyword"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KeywordMetricsCard
                  title="CPC"
                  value={`$${results.metrics.cpc.toFixed(2)}`}
                  icon={<TrendingUpIcon color="success" />}
                  info="Average cost per click"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KeywordMetricsCard
                  title="Opportunity Score"
                  value={results.metrics.opportunity}
                  icon={<TrendingUpIcon color="info" />}
                  info="Overall opportunity score (1-100)"
                />
              </Grid>
            </Grid>

            {/* Related Keywords Table */}
            <Typography variant="h6" gutterBottom>
              Related Keywords
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Keyword</TableCell>
                    <TableCell align="right">Search Volume</TableCell>
                    <TableCell align="right">Competition</TableCell>
                    <TableCell align="right">CPC</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.results.map((result) => (
                    <TableRow key={result.keyword}>
                      <TableCell component="th" scope="row">
                        {result.keyword}
                      </TableCell>
                      <TableCell align="right">{result.metrics.volume}</TableCell>
                      <TableCell align="right">
                        {(result.metrics.competition * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell align="right">${result.metrics.cpc.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(result.keyword)}
                          title="Copy to clipboard"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => saveKeyword(result.keyword)}
                          title="Save keyword"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default KeywordResearch;
