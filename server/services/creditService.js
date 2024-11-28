const Credit = require('../models/Credit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CreditGiftService = require('./creditGiftService');

class CreditService {
    static async getCreditBalance(userId) {
        const credit = await Credit.findOne({ userId });
        return credit ? credit.amount : 0;
    }

    static async createCheckoutSession(userId, creditPackage) {
        const packages = {
            small: { credits: 50, price: 499 },  // $4.99
            medium: { credits: 150, price: 999 }, // $9.99
            large: { credits: 500, price: 2499 }  // $24.99
        };

        const pack = packages[creditPackage];
        if (!pack) {
            throw new Error('Invalid credit package');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${pack.credits} SEOmnissiah Credits`,
                        description: `Credit package for generating SEO content`
                    },
                    unit_amount: pack.price
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/credits/cancel`,
            metadata: {
                userId,
                credits: pack.credits
            }
        });

        return session;
    }

    static async handleSuccessfulPayment(session) {
        const { userId, credits } = session.metadata;
        
        let userCredit = await Credit.findOne({ userId });
        if (!userCredit) {
            userCredit = new Credit({ userId, amount: 0 });
        }

        await userCredit.addCredits(
            parseInt(credits),
            'purchase',
            `Purchased ${credits} credits`
        );

        return userCredit;
    }

    static async useCredits(userId, amount, description) {
        let userCredit = await Credit.findOne({ userId });
        if (!userCredit) {
            throw new Error('No credits found for user');
        }

        await userCredit.useCredits(amount, description);
        
        // Check for lucky credits after using credits
        const luckyCredits = await CreditGiftService.checkAndTriggerLuckyCredits(
            userId,
            userCredit.amount
        );

        return {
            credit: userCredit,
            luckyCredits
        };
    }

    static async addBonusCredits(userId, amount, description) {
        let userCredit = await Credit.findOne({ userId });
        if (!userCredit) {
            userCredit = new Credit({ userId, amount: 0 });
        }

        await userCredit.addCredits(amount, 'bonus', description);
        return userCredit;
    }
}

module.exports = CreditService;
