const mongoose = require('mongoose');

const KeywordMetricsSchema = new mongoose.Schema({
    volume: {
        type: Number,
        required: true
    },
    competition: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    cpc: {
        type: Number,
        required: true
    },
    opportunity: {
        type: Number,
        required: true
    }
});

const KeywordResultSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true
    },
    metrics: KeywordMetricsSchema
});

const KeywordResearchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seedKeyword: {
        type: String,
        required: true
    },
    results: [KeywordResultSchema],
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    metadata: {
        source: {
            type: String,
            enum: ['semrush', 'ahrefs', 'mock'],
            required: true
        },
        searchVolume: Number,
        avgCpc: Number,
        competition: Number
    }
});

// Index for faster queries
KeywordResearchSchema.index({ userId: 1, timestamp: -1 });
KeywordResearchSchema.index({ seedKeyword: 'text' });

module.exports = mongoose.model('KeywordResearch', KeywordResearchSchema);
