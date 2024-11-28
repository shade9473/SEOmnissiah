const Referral = require('../models/Referral');
const CreditService = require('./creditService');

const REFERRAL_REWARDS = {
    REFERRER_CREDITS: 50,  // Credits for referring someone
    REFEREE_CREDITS: 25,   // Credits for signing up with a referral
    BONUS_THRESHOLD: 5,    // Number of referrals needed for bonus
    BONUS_CREDITS: 100     // Bonus credits for reaching threshold
};

class ReferralService {
    static async createReferralCode(userId) {
        const referralCode = await Referral.generateReferralCode(userId);
        const referral = new Referral({
            referrerId: userId,
            referralCode
        });
        await referral.save();
        return referral;
    }

    static async getReferralByCode(code) {
        return await Referral.findOne({ referralCode: code });
    }

    static async getReferralStats(userId) {
        const referral = await Referral.findOne({ referrerId: userId });
        if (!referral) return null;

        return {
            referralCode: referral.referralCode,
            totalReferrals: referral.totalReferrals,
            totalCreditsEarned: referral.totalCreditsEarned,
            referredUsers: referral.referredUsers
        };
    }

    static async processReferral(referralCode, newUserId) {
        const referral = await this.getReferralByCode(referralCode);
        if (!referral) {
            throw new Error('Invalid referral code');
        }

        // Check if user was already referred
        const alreadyReferred = referral.referredUsers.some(
            ref => ref.userId.toString() === newUserId.toString()
        );
        if (alreadyReferred) {
            throw new Error('User already referred');
        }

        // Add referred user
        referral.referredUsers.push({
            userId: newUserId,
            creditAwarded: false
        });
        referral.totalReferrals += 1;

        // Award credits to referrer
        await CreditService.addBonusCredits(
            referral.referrerId,
            REFERRAL_REWARDS.REFERRER_CREDITS,
            `Referral bonus for inviting a new user`
        );
        referral.totalCreditsEarned += REFERRAL_REWARDS.REFERRER_CREDITS;

        // Award credits to new user
        await CreditService.addBonusCredits(
            newUserId,
            REFERRAL_REWARDS.REFEREE_CREDITS,
            `Welcome bonus for joining via referral`
        );

        // Check for bonus threshold
        if (referral.totalReferrals === REFERRAL_REWARDS.BONUS_THRESHOLD) {
            await CreditService.addBonusCredits(
                referral.referrerId,
                REFERRAL_REWARDS.BONUS_CREDITS,
                `Bonus for reaching ${REFERRAL_REWARDS.BONUS_THRESHOLD} referrals!`
            );
            referral.totalCreditsEarned += REFERRAL_REWARDS.BONUS_CREDITS;
        }

        await referral.save();
        return referral;
    }

    static async generateShareableLink(referralCode) {
        const baseUrl = process.env.CLIENT_URL || 'https://seomnissiah.com';
        return `${baseUrl}/signup?ref=${referralCode}`;
    }

    static async generateSocialShareContent(referralCode) {
        const link = await this.generateShareableLink(referralCode);
        
        return {
            twitter: `🚀 Generate SEO-optimized content for free! Join SEOmnissiah using my referral link and get ${REFERRAL_REWARDS.REFEREE_CREDITS} free credits: ${link} #SEO #ContentCreation`,
            
            linkedin: `I've been using SEOmnissiah to generate SEO-optimized content, and it's been a game-changer! Join using my referral link to get ${REFERRAL_REWARDS.REFEREE_CREDITS} free credits: ${link}`,
            
            email: {
                subject: "Get Free SEO Content Generation Credits",
                body: `Hey,\n\nI wanted to share this amazing tool I've been using for SEO content generation. Join SEOmnissiah using my referral link and get ${REFERRAL_REWARDS.REFEREE_CREDITS} free credits to try it out:\n\n${link}\n\nEnjoy!`
            }
        };
    }
}

module.exports = ReferralService;
