import { Product } from '../../models/Product';
import Interaction from '../../models/Interaction';
import { buildUserProfile } from './scoringEngine';
import mongoose from 'mongoose';

/**
 * getContentBasedRecs — Content-Based Filtering
 * 
 * Recommends products that match the user's preferred categories.
 * 
 * Algorithm:
 * 1. Build the user's category-preference profile (weighted scores)
 * 2. Take the user's top 5 categories
 * 3. Find products the user has NOT purchased in those categories
 * 4. Sort by stock availability and recency
 * 
 * @param userId - The authenticated user's ID
 * @param limit  - Max number of recommendations to return
 * @returns Array of Product documents
 */
export const getContentBasedRecs = async (userId: string, limit: number = 10) => {
    // Build the user's preference profile
    const categoryScores = await buildUserProfile(userId);

    if (categoryScores.length === 0) return [];

    // Take top 5 preferred categories
    const topCategories = categoryScores.slice(0, 5).map(c => c.category);

    // Get product IDs the user has already purchased (to exclude)
    const purchasedInteractions = await Interaction.find({
        userId: new mongoose.Types.ObjectId(userId),
        action: 'purchase'
    })
        .select('productId')
        .lean();

    const purchasedIds = purchasedInteractions
        .filter(i => i.productId)
        .map(i => i.productId!);

    // Find products in preferred categories, excluding purchased ones
    const recommendations = await Product.find({
        category: { $in: topCategories },
        _id: { $nin: purchasedIds },
        stock: { $gt: 0 }
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return recommendations;
};
