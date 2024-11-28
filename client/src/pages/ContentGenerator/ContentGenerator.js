import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Create as CreateIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';

const steps = ['Enter Topic', 'Configure Options', 'Generate Content'];

const ContentGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [remainingCredits, setRemainingCredits] = useState(null);

  const contentTypes = [
    { value: 'blog', label: 'Blog Post' },
    { value: 'article', label: 'Article' },
    { value: 'product', label: 'Product Description' },
    { value: 'social', label: 'Social Media Post' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'authoritative', label: 'Authoritative' },
  ];

  const lengths = [
    { value: 'short', label: 'Short (~300 words)' },
    { value: 'medium', label: 'Medium (~600 words)' },
    { value: 'long', label: 'Long (~1000 words)' },
  ];

  const handleNext = () => {
    if (activeStep === 0 && !topic) {
      setError('Please enter a topic');
      return;
    }
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/content/generate', {
        topic,
        keywords: keywords.split(',').map(k => k.trim()),
        contentType,
        tone,
        length,
      });

      setGeneratedContent(response.data.content);
      setRemainingCredits(response.data.remainingCredits);
      setActiveStep(3);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Enter your topic"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Benefits of Meditation"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Target Keywords (comma-separated)"
              variant="outlined"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., meditation benefits, mindfulness, stress relief"
              multiline
              rows={2}
            />
          </Box>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={contentType}
                  label="Content Type"
                  onChange={(e) => setContentType(e.target.value)}
                >
                  {contentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={tone}
                  label="Tone"
                  onChange={(e) => setTone(e.target.value)}
                >
                  {tones.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Length</InputLabel>
                <Select
                  value={length}
                  label="Length"
                  onChange={(e) => setLength(e.target.value)}
                >
                  {lengths.map((l) => (
                    <MenuItem key={l.value} value={l.value}>
                      {l.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              Ready to Generate Content
            </Typography>
            <Typography color="text.secondary" paragraph>
              This will use 1 credit from your account.
            </Typography>
            {remainingCredits !== null && (
              <Chip
                label={`${remainingCredits} credits remaining`}
                color="primary"
                sx={{ mb: 2 }}
              />
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Generator
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          {activeStep === 3 ? (
            <Box>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Tooltip title="Copy to clipboard">
                      <IconButton onClick={copyToClipboard}>
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download as text file">
                      <IconButton onClick={downloadContent}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                    }}
                  >
                    {generatedContent}
                  </Typography>
                </CardContent>
              </Card>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveStep(0);
                    setGeneratedContent(null);
                  }}
                  startIcon={<RefreshIcon />}
                >
                  Generate New Content
                </Button>
              </Box>
            </Box>
          ) : (
            renderStepContent(activeStep)
          )}
        </Box>

        {activeStep !== 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleGenerate : handleNext}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CreateIcon />}
            >
              {activeStep === steps.length - 1
                ? loading
                  ? 'Generating...'
                  : 'Generate'
                : 'Next'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ContentGenerator;
