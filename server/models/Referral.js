const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referralCode: {
        type: String,
        unique: true,
        required: true
    },
    referredUsers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        signupDate: {
            type: Date,
            default: Date.now
        },
        creditAwarded: {
            type: Boolean,
            default: false
        }
    }],
    totalReferrals: {
        type: Number,
        default: 0
    },
    totalCreditsEarned: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Generate a unique referral code
referralSchema.statics.generateReferralCode = async function(userId) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;

    while (!isUnique) {
        code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        // Check if code exists
        const existing = await this.findOne({ referralCode: code });
        if (!existing) {
            isUnique = true;
        }
    }

    return code;
};

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
