const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMetrics, generateReport } = require('../services/analyticsService');

// Get analytics metrics
router.get('/metrics', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const metrics = await getMetrics(startDate, endDate);
        res.json(metrics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Generate performance report
router.post('/report', auth, async (req, res) => {
    try {
        const { metrics, format } = req.body;
        const report = await generateReport(metrics, format);
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
