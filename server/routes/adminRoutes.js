const express = require('express');
const router = express.Router();
const CreditGiftService = require('../services/creditGiftService');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Admin routes for gifting credits
router.post('/gift-credits', [auth, adminAuth], async (req, res) => {
    try {
        const campaign = await CreditGiftService.createGiftCampaign(req.body);
        res.json({
            success: true,
            results: campaign
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get gifting statistics
router.get('/gift-stats', [auth, adminAuth], async (req, res) => {
    try {
        const stats = await CreditGiftService.getGiftingStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
