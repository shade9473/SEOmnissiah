import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Tooltip,
    Alert,
    Grid,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    ContentCopy as CopyIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    Email as EmailIcon,
    Share as ShareIcon
} from '@mui/icons-material';

const ReferralProgram = () => {
    const [referralData, setReferralData] = useState(null);
    const [shareContent, setShareContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            const response = await fetch('/api/referral/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setReferralData(data.stats);
                setShareContent(data.shareContent);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setError('Failed to copy to clipboard');
        }
    };

    const shareOnTwitter = () => {
        if (!shareContent) return;
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.twitter)}`,
            '_blank'
        );
    };

    const shareOnLinkedIn = () => {
        if (!shareContent) return;
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareContent.linkedin)}`,
            '_blank'
        );
    };

    const shareViaEmail = () => {
        if (!shareContent) return;
        window.location.href = `mailto:?subject=${encodeURIComponent(shareContent.email.subject)}&body=${encodeURIComponent(shareContent.email.body)}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Referral Program
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Your Referral Stats
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h4" color="primary">
                                            {referralData?.totalReferrals || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Referrals
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h4" color="primary">
                                            {referralData?.totalCreditsEarned || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Credits Earned
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h4" color="primary">
                                            {Math.max(0, 5 - (referralData?.totalReferrals || 0))}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Referrals until bonus
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Share Your Referral Link
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={referralData?.referralLink || ''}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <IconButton onClick={() => copyToClipboard(referralData?.referralLink)}>
                                                <CopyIcon />
                                            </IconButton>
                                        )
                                    }}
                                />
                                {copied && (
                                    <Typography variant="caption" color="primary">
                                        Copied to clipboard!
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Share on Social Media
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Tooltip title="Share on Twitter">
                                    <IconButton onClick={shareOnTwitter} color="primary">
                                        <TwitterIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share on LinkedIn">
                                    <IconButton onClick={shareOnLinkedIn} color="primary">
                                        <LinkedInIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share via Email">
                                    <IconButton onClick={shareViaEmail} color="primary">
                                        <EmailIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Rewards
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">
                                    • Get <strong>50 credits</strong> for each friend who joins
                                </Typography>
                                <Typography variant="body1">
                                    • Your friends get <strong>25 credits</strong> when they sign up
                                </Typography>
                                <Typography variant="body1">
                                    • Bonus <strong>100 credits</strong> when you reach 5 referrals!
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReferralProgram;
