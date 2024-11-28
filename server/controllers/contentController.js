const contentService = require('../services/contentService');

exports.generateContent = async (req, res) => {
    try {
        const { topic, outline } = req.body;
        
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }

        const content = await contentService.generateContent(topic, outline);
        
        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        console.error('Content generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating content',
            error: error.message
        });
    }
};
