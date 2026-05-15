import Interaction from '../../models/Interaction';
import { Product } from '../../models/Product';
import mongoose from 'mongoose';

/**
 * getTrendingProducts — Trending / Popular Products
 * 
 * Finds products with the most weighted interactions in the last N days.
 * Uses the same action weights as the scoring engine for consistency.
 * 
 * @param limit - Max number of trending products to return
 * @param days  - Time window in days (default: 7)
 * @returns Array of Product documents sorted by trending score
 */
export const getTrendingProducts = async (limit: number = 10, days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Aggregate weighted interaction scores per product within the time window
    const trendingAgg = await Interaction.aggregate([
        {
            $match: {
                timestamp: { $gte: cutoffDate },
                productId: { $exists: true, $ne: null },
                action: { $ne: 'search_query' }
            }
        },
        {
            $addFields: {
                weight: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$action', 'purchase'] }, then: 5 },
                            { case: { $eq: ['$action', 'checkout'] }, then: 4 },
                            { case: { $eq: ['$action', 'add_to_cart'] }, then: 3 },
                            { case: { $eq: ['$action', 'click'] }, then: 2 },
                            { case: { $eq: ['$action', 'view'] }, then: 1 },
                            { case: { $eq: ['$action', 'remove_from_cart'] }, then: -1 },
                        ],
                        default: 0
                    }
                }
            }
        },
        {
            $group: {
                _id: '$productId',
                trendScore: { $sum: '$weight' },
                interactionCount: { $sum: 1 }
            }
        },
        { $sort: { trendScore: -1 } },
        { $limit: limit }
    ]);

    if (trendingAgg.length === 0) {
        // Fallback: return newest products with stock
        return await Product.find({ stock: { $gt: 0 } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

    const productIds = trendingAgg.map((t: any) => t._id);

    // Fetch product documents
    const products = await Product.find({
        _id: { $in: productIds },
        stock: { $gt: 0 }
    }).lean();

    // Sort by trending score
    const scoreMap = new Map(
        trendingAgg.map((t: any) => [t._id.toString(), t.trendScore])
    );

    return products.sort(
        (a, b) => (scoreMap.get(b._id.toString()) || 0) - (scoreMap.get(a._id.toString()) || 0)
    );
};
