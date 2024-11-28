const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [{
        type: {
            type: String,
            enum: ['purchase', 'use', 'refund', 'bonus'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Method to add credits
creditSchema.methods.addCredits = async function(amount, type = 'purchase', description = '') {
    this.amount += amount;
    this.transactions.push({
        type,
        amount,
        description
    });
    return await this.save();
};

// Method to use credits
creditSchema.methods.useCredits = async function(amount, description = '') {
    if (this.amount < amount) {
        throw new Error('Insufficient credits');
    }
    this.amount -= amount;
    this.transactions.push({
        type: 'use',
        amount: -amount,
        description
    });
    return await this.save();
};

const Credit = mongoose.model('Credit', creditSchema);

module.exports = Credit;
