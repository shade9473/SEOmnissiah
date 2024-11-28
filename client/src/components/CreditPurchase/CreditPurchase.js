import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const creditPackages = [
    {
        id: 'small',
        credits: 50,
        price: 4.99,
        popular: false,
        description: 'Perfect for small projects and testing'
    },
    {
        id: 'medium',
        credits: 150,
        price: 9.99,
        popular: true,
        description: 'Most popular choice for regular content creators'
    },
    {
        id: 'large',
        credits: 500,
        price: 24.99,
        popular: false,
        description: 'Best value for power users'
    }
];

const CreditPurchase = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentCredits, setCurrentCredits] = useState(0);

    useEffect(() => {
        fetchCurrentCredits();
    }, []);

    const fetchCurrentCredits = async () => {
        try {
            const response = await fetch('/api/credits/balance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setCurrentCredits(data.balance);
            }
        } catch (err) {
            console.error('Error fetching credits:', err);
        }
    };

    const handlePurchase = async (packageId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/credits/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ package: packageId })
            });

            const session = await response.json();

            if (!session.success) {
                throw new Error(session.message);
            }

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId: session.sessionId
            });

            if (error) {
                throw error;
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Purchase Credits
            </Typography>

            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                    Current Balance: {currentCredits} credits
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {creditPackages.map((pack) => (
                    <Grid item xs={12} md={4} key={pack.id}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                ...(pack.popular && {
                                    border: '2px solid',
                                    borderColor: 'primary.main'
                                })
                            }}
                        >
                            {pack.popular && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}
                                >
                                    Most Popular
                                </Box>
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {pack.credits} Credits
                                </Typography>
                                <Typography variant="h4" color="primary" gutterBottom>
                                    ${pack.price}
                                </Typography>
                                <Typography color="text.secondary">
                                    {pack.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    fullWidth
                                    variant={pack.popular ? "contained" : "outlined"}
                                    color="primary"
                                    onClick={() => handlePurchase(pack.id)}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Purchase'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CreditPurchase;
