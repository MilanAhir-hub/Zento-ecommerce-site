import Interaction from '../../models/Interaction';
import { Product } from '../../models/Product';
import mongoose from 'mongoose';

/**
 * getRecentlyViewed — Recently Viewed Products
 * 
 * Returns the user's most recently viewed products, deduplicated.
 * Uses the aggregation pipeline to get distinct products ordered by latest view time.
 * 
 * @param userId - The authenticated user's ID
 * @param limit  - Max number of recently viewed products (default: 10)
 * @returns Array of Product documents in reverse chronological order
 */
export const getRecentlyViewed = async (userId: string, limit: number = 10) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get distinct recently viewed product IDs, ordered by most recent
    const recentViews = await Interaction.aggregate([
        {
            $match: {
                userId: userObjectId,
                action: { $in: ['view', 'click'] },
                productId: { $exists: true, $ne: null }
            }
        },
        { $sort: { timestamp: -1 } },
        {
            $group: {
                _id: '$productId',
                lastViewed: { $first: '$timestamp' }
            }
        },
        { $sort: { lastViewed: -1 } },
        { $limit: limit }
    ]);

    if (recentViews.length === 0) return [];

    const productIds = recentViews.map((r: any) => r._id);

    // Fetch the product documents
    const products = await Product.find({
        _id: { $in: productIds }
    }).lean();

    // Maintain the reverse-chronological order from the aggregation
    const orderMap = new Map(
        recentViews.map((r: any, idx: number) => [r._id.toString(), idx])
    );

    return products.sort(
        (a, b) => (orderMap.get(a._id.toString()) || 0) - (orderMap.get(b._id.toString()) || 0)
    );
};
