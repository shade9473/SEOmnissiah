const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    settings: {
        apiKeys: {
            semrush: String,
            ahrefs: String,
            openai: String
        },
        preferences: {
            contentLength: {
                type: Number,
                default: 1500
            },
            targetKeywordCount: {
                type: Number,
                default: 5
            },
            monetizationStrategies: [{
                type: String,
                enum: ['affiliate', 'ads', 'sponsored', 'products']
            }]
        }
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

module.exports = mongoose.model('User', UserSchema);
