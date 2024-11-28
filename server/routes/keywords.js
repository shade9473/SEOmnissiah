const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getKeywordData } = require('../services/keywordService');

// Get keyword suggestions and metrics
router.post('/analyze', auth, async (req, res) => {
    try {
        const { seed_keywords } = req.body;
        const keywordData = await getKeywordData(seed_keywords);
        res.json(keywordData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Save keyword research
router.post('/save', auth, async (req, res) => {
    try {
        const { keywords, projectId } = req.body;
        // Implementation for saving keywords
        res.json({ message: 'Keywords saved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
