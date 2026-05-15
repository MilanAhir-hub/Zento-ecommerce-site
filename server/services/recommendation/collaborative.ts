import Interaction from '../../models/Interaction';
import { Product } from '../../models/Product';
import mongoose from 'mongoose';

/**
 * getCollaborativeRecs — Basic Collaborative Filtering
 * 
 * "Users who interacted with the same products as you, also liked these."
 * 
 * Algorithm:
 * 1. Get the current user's top interacted product IDs
 * 2. Find OTHER users who also interacted with those products
 * 3. Get THOSE users' other product interactions
 * 4. Rank those products by frequency (how many similar users interacted)
 * 5. Exclude products the current user already interacted with
 * 
 * @param userId - The authenticated user's ID
 * @param limit  - Max number of recommendations to return
 * @returns Array of Product documents
 */
export const getCollaborativeRecs = async (userId: string, limit: number = 10) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Step 1: Get current user's interacted product IDs
    const userInteractions = await Interaction.find({
        userId: userObjectId,
        productId: { $exists: true, $ne: null },
        action: { $in: ['view', 'click', 'add_to_cart', 'purchase'] }
    })
        .select('productId')
        .lean();

    if (userInteractions.length === 0) return [];

    const userProductIds = [...new Set(
        userInteractions.filter(i => i.productId).map(i => i.productId!.toString())
    )];

    // Step 2: Find similar users who also interacted with the same products
    const similarUsers = await Interaction.aggregate([
        {
            $match: {
                productId: { $in: userProductIds.map(id => new mongoose.Types.ObjectId(id)) },
                userId: { $ne: userObjectId },
                action: { $in: ['view', 'click', 'add_to_cart', 'purchase'] }
            }
        },
        {
            $group: {
                _id: '$userId',
                sharedProducts: { $addToSet: { $toString: '$productId' } }
            }
        },
        {
            // Only consider users with at least 2 overlapping products
            $match: { 'sharedProducts.1': { $exists: true } }
        },
        { $limit: 50 } // Cap similar users to avoid expensive queries
    ]);

    if (similarUsers.length === 0) return [];

    const similarUserIds = similarUsers.map((u: any) => u._id);

    // Step 3: Get products those similar users interacted with (that current user has NOT)
    const collaborativeProducts = await Interaction.aggregate([
        {
            $match: {
                userId: { $in: similarUserIds },
                productId: {
                    $exists: true,
                    $ne: null,
                    $nin: userProductIds.map(id => new mongoose.Types.ObjectId(id))
                },
                action: { $in: ['add_to_cart', 'purchase'] } // Higher-signal actions only
            }
        },
        {
            $group: {
                _id: '$productId',
                frequency: { $sum: 1 } // How many similar users interacted
            }
        },
        { $sort: { frequency: -1 } },
        { $limit: limit }
    ]);

    if (collaborativeProducts.length === 0) return [];

    const productIds = collaborativeProducts.map((p: any) => p._id);

    // Step 4: Fetch the actual product documents
    const products = await Product.find({
        _id: { $in: productIds },
        stock: { $gt: 0 }
    }).lean();

    // Sort products by the frequency ranking from the aggregation
    const frequencyMap = new Map(
        collaborativeProducts.map((p: any) => [p._id.toString(), p.frequency])
    );

    return products.sort(
        (a, b) => (frequencyMap.get(b._id.toString()) || 0) - (frequencyMap.get(a._id.toString()) || 0)
    );
};
