const express = require('express');
const router = express.Router();
const ReferralService = require('../services/referralService');
const auth = require('../middleware/auth');

// Get referral stats and code
router.get('/stats', auth, async (req, res) => {
    try {
        const stats = await ReferralService.getReferralStats(req.user.id);
        
        // If user doesn't have a referral code yet, create one
        if (!stats) {
            const newReferral = await ReferralService.createReferralCode(req.user.id);
            stats = {
                referralCode: newReferral.referralCode,
                totalReferrals: 0,
                totalCreditsEarned: 0,
                referredUsers: []
            };
        }

        // Generate shareable link and content
        const referralLink = await ReferralService.generateShareableLink(stats.referralCode);
        const shareContent = await ReferralService.generateSocialShareContent(stats.referralCode);

        res.json({
            success: true,
            stats: {
                ...stats,
                referralLink
            },
            shareContent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Process referral during signup
router.post('/process', auth, async (req, res) => {
    try {
        const { referralCode } = req.body;
        const referral = await ReferralService.processReferral(referralCode, req.user.id);
        
        res.json({
            success: true,
            message: 'Referral processed successfully',
            creditsAwarded: true
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
