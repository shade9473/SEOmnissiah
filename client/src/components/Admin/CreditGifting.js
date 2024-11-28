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
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';
import { CardGiftcard as GiftIcon } from '@mui/icons-material';

const CreditGifting = () => {
    const [giftType, setGiftType] = useState('individual');
    const [userIds, setUserIds] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [reason, setReason] = useState('');
    const [criteria, setCriteria] = useState('inactive');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [stats, setStats] = useState(null);

    const handleGiftCredits = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                creditAmount: parseInt(creditAmount),
                reason
            };

            if (giftType === 'individual') {
                payload.targetUsers = userIds.split(',').map(id => id.trim());
            } else {
                payload.criteria = { status: criteria };
            }

            const response = await fetch('/api/admin/gift-credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (data.success) {
                setSuccess(`Successfully gifted credits to ${data.results.length} users`);
                // Reset form
                setCreditAmount('');
                setReason('');
                setUserIds('');
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/gift-stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    React.useEffect(() => {
        fetchStats();
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Gift Credits
            </Typography>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Credits Gifted
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats?.totalGifted || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Gift Campaigns
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats?.giftCount || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Avg Gift Amount
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats?.avgGiftAmount?.toFixed(0) || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Gift Form */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleGiftCredits}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Gift Type</InputLabel>
                                        <Select
                                            value={giftType}
                                            onChange={(e) => setGiftType(e.target.value)}
                                            label="Gift Type"
                                        >
                                            <MenuItem value="individual">Individual Users</MenuItem>
                                            <MenuItem value="criteria">By Criteria</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {giftType === 'individual' ? (
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="User IDs (comma-separated)"
                                            value={userIds}
                                            onChange={(e) => setUserIds(e.target.value)}
                                            multiline
                                            rows={2}
                                            required
                                        />
                                    </Grid>
                                ) : (
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>User Criteria</InputLabel>
                                            <Select
                                                value={criteria}
                                                onChange={(e) => setCriteria(e.target.value)}
                                                label="User Criteria"
                                            >
                                                <MenuItem value="inactive">Inactive Users</MenuItem>
                                                <MenuItem value="new">New Users</MenuItem>
                                                <MenuItem value="loyal">Loyal Users</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Credit Amount"
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(e.target.value)}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Gift Reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={loading}
                                        startIcon={<GiftIcon />}
                                    >
                                        {loading ? 'Gifting...' : 'Gift Credits'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={!!success}
                autoHideDuration={6000}
                onClose={() => setSuccess(null)}
            >
                <Alert severity="success" onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreditGifting;
