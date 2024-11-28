const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { analyzePage, generateMetaTags } = require('../services/seoService');

// Analyze page SEO
router.post('/analyze', auth, async (req, res) => {
    try {
        const { url } = req.body;
        const analysis = await analyzePage(url);
        res.json(analysis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Generate meta tags
router.post('/meta-tags', auth, async (req, res) => {
    try {
        const { content, keywords } = req.body;
        const metaTags = await generateMetaTags(content, keywords);
        res.json(metaTags);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
