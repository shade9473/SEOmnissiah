const express = require('express');
const router = express.Router();
const CreditService = require('../services/creditService');
const auth = require('../middleware/auth');

// Get credit balance
router.get('/balance', auth, async (req, res) => {
    try {
        const balance = await CreditService.getCreditBalance(req.user.id);
        res.json({
            success: true,
            balance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create checkout session for credit purchase
router.post('/checkout', auth, async (req, res) => {
    try {
        const session = await CreditService.createCheckoutSession(
            req.user.id,
            req.body.package
        );
        res.json({
            success: true,
            sessionId: session.id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            await CreditService.handleSuccessfulPayment(session);
            res.json({ received: true });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
});

module.exports = router;
