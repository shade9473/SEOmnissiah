import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import { Create as CreateIcon } from '@mui/icons-material';

const steps = ['Enter Topic', 'Generate Outline', 'Create Content'];

const ContentGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(3); // Free credits for new users

  const handleGenerate = async () => {
    if (credits <= 0) {
      setError('No credits remaining. Purchase more credits to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
        },
        body: JSON.stringify({
          topic,
          outline: outline || 'auto'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate content');
      }

      setContent(data.data);
      setCredits(prev => prev - 1);
      setActiveStep(2);
    } catch (err) {
      setError(err.message);
      setCredits(prev => prev + 1); // Refund credit on error
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Enter your topic or keyword"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setActiveStep(1)}
              disabled={!topic || loading}
              sx={{ mt: 2 }}
            >
              Next
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Customize your outline (optional)"
              variant="outlined"
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              placeholder="Leave empty for AI-generated outline"
              disabled={loading}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(0)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                disabled={loading}
                startIcon={loading ? null : <CreateIcon />}
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generated Content
                </Typography>
                <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                  {content}
                </Typography>
              </CardContent>
            </Card>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setActiveStep(0);
                  setContent('');
                }}
              >
                Generate New Content
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigator.clipboard.writeText(content);
                }}
              >
                Copy to Clipboard
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Generator
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={`${credits} credits remaining`}
            color={credits > 0 ? 'primary' : 'error'}
            variant="outlined"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {/* Implement purchase credits */}}
          >
            Get More Credits
          </Button>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStep()}
      </Paper>
    </Container>
  );
};

export default ContentGenerator;
