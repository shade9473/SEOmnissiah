const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateContent, optimizeContent } = require('../services/contentService');

// Generate blog content
router.post('/generate', auth, async (req, res) => {
    try {
        const { keyword, outline } = req.body;
        const content = await generateContent(keyword, outline);
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Optimize existing content
router.post('/optimize', auth, async (req, res) => {
    try {
        const { content, targetKeywords } = req.body;
        const optimizedContent = await optimizeContent(content, targetKeywords);
        res.json(optimizedContent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
