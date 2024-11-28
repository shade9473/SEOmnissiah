const Credit = require('../models/Credit');
const User = require('../models/User');

class CreditGiftService {
    // Constants for lucky credit feature
    static LUCKY_CREDIT_THRESHOLD = 5; // Trigger when user has 5 or fewer credits
    static LUCKY_CREDIT_CHANCE = 0.7;  // 70% chance of getting lucky credits
    static LUCKY_CREDIT_RANGE = {
        min: 5,
        max: 10
    };

    static async giftCreditsToUser(userId, amount, reason) {
        const credit = await Credit.findOne({ userId });
        if (!credit) {
            throw new Error('User credit record not found');
        }

        await credit.addCredits(amount, 'gift', reason);
        return credit;
    }

    static async giftCreditsToMultipleUsers(userIds, amount, reason) {
        const results = await Promise.allSettled(
            userIds.map(userId => this.giftCreditsToUser(userId, amount, reason))
        );

        return results.map((result, index) => ({
            userId: userIds[index],
            success: result.status === 'fulfilled',
            error: result.status === 'rejected' ? result.reason.message : null
        }));
    }

    static async giftCreditsByUserCriteria(criteria, amount, reason) {
        const users = await User.find(criteria);
        return await this.giftCreditsToMultipleUsers(
            users.map(user => user._id),
            amount,
            reason
        );
    }

    static async checkAndTriggerLuckyCredits(userId, currentCredits) {
        // Only check for initial free credits (checking if total transactions is low)
        const credit = await Credit.findOne({ userId });
        if (!credit || credit.transactions.length > 5) {
            return null;
        }

        // Check if user is at the threshold
        if (currentCredits <= this.LUCKY_CREDIT_THRESHOLD) {
            // Determine if user gets lucky credits
            if (Math.random() < this.LUCKY_CREDIT_CHANCE) {
                const luckyAmount = Math.floor(
                    Math.random() * (this.LUCKY_CREDIT_RANGE.max - this.LUCKY_CREDIT_RANGE.min + 1)
                ) + this.LUCKY_CREDIT_RANGE.min;

                await credit.addCredits(
                    luckyAmount,
                    'bonus',
                    '🍀 Lucky bonus credits!'
                );

                return {
                    received: true,
                    amount: luckyAmount,
                    message: `Congratulations! You've received ${luckyAmount} lucky bonus credits!`
                };
            }
        }

        return null;
    }

    // Admin functions for managing gifts
    static async createGiftCampaign(campaignData) {
        const {
            targetUsers,
            creditAmount,
            reason,
            criteria = null
        } = campaignData;

        if (criteria) {
            return await this.giftCreditsByUserCriteria(criteria, creditAmount, reason);
        } else if (targetUsers && targetUsers.length > 0) {
            return await this.giftCreditsToMultipleUsers(targetUsers, creditAmount, reason);
        }

        throw new Error('Invalid campaign parameters');
    }

    static async getGiftingStats() {
        const stats = await Credit.aggregate([
            {
                $unwind: '$transactions'
            },
            {
                $match: {
                    'transactions.type': 'gift'
                }
            },
            {
                $group: {
                    _id: null,
                    totalGifted: { $sum: '$transactions.amount' },
                    giftCount: { $sum: 1 },
                    avgGiftAmount: { $avg: '$transactions.amount' }
                }
            }
        ]);

        return stats[0] || {
            totalGifted: 0,
            giftCount: 0,
            avgGiftAmount: 0
        };
    }
}

module.exports = CreditGiftService;
