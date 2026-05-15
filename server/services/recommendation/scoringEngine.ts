import Interaction from '../../models/Interaction';
import { Product } from '../../models/Product';
import mongoose from 'mongoose';

/**
 * ACTION WEIGHTS — defines how strongly each interaction type 
 * contributes to recommendation scoring.
 */
const ACTION_WEIGHTS: Record<string, number> = {
    view: 1,
    click: 2,
    add_to_cart: 3,
    remove_from_cart: -1,
    checkout: 4,
    purchase: 5,
};

/**
 * Represents the user's preference score for a single category.
 */
export interface CategoryScore {
    category: string;
    score: number;
}

/**
 * Represents the user's preference score for a single product.
 */
export interface ProductScore {
    productId: string;
    score: number;
}

/**
 * buildUserProfile - Aggregates a user's interactions into weighted 
 * category preferences. This is the foundation for content-based filtering.
 * 
 * Process:
 * 1. Fetch all interactions for the user (last 200)
 * 2. Look up the category of each product they interacted with
 * 3. Sum the weighted scores per category
 * 
 * @returns Array of { category, score } sorted by score descending
 */
export const buildUserProfile = async (userId: string): Promise<CategoryScore[]> => {
    // Fetch the user's recent interactions (excluding search_query since those have no productId)
    const interactions = await Interaction.find({
        userId: new mongoose.Types.ObjectId(userId),
        action: { $ne: 'search_query' },
        productId: { $exists: true, $ne: null }
    })
        .sort({ timestamp: -1 })
        .limit(200)
        .lean();

    if (interactions.length === 0) return [];

    // Get unique product IDs from interactions
    const productIds = [...new Set(interactions.map(i => i.productId!.toString()))];

    // Fetch products to get their categories
    const products = await Product.find({
        _id: { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) }
    })
        .select('_id category')
        .lean();

    // Build a productId → category lookup map
    const productCategoryMap = new Map<string, string>();
    for (const p of products) {
        productCategoryMap.set(p._id.toString(), p.category);
    }

    // Accumulate weighted scores per category
    const categoryScores = new Map<string, number>();

    for (const interaction of interactions) {
        const category = productCategoryMap.get(interaction.productId!.toString());
        if (!category) continue;

        const weight = ACTION_WEIGHTS[interaction.action] ?? 0;
        const currentScore = categoryScores.get(category) || 0;
        categoryScores.set(category, currentScore + weight);
    }

    // Convert to sorted array
    return Array.from(categoryScores.entries())
        .map(([category, score]) => ({ category, score }))
        .sort((a, b) => b.score - a.score);
};

/**
 * buildProductScores — Aggregates a user's interactions into weighted 
 * per-product scores. Used to rank which products the user cares about most.
 * 
 * @returns Array of { productId, score } sorted by score descending
 */
export const buildProductScores = async (userId: string): Promise<ProductScore[]> => {
    const interactions = await Interaction.find({
        userId: new mongoose.Types.ObjectId(userId),
        action: { $ne: 'search_query' },
        productId: { $exists: true, $ne: null }
    })
        .sort({ timestamp: -1 })
        .limit(200)
        .lean();

    if (interactions.length === 0) return [];

    const productScores = new Map<string, number>();

    for (const interaction of interactions) {
        const pid = interaction.productId!.toString();
        const weight = ACTION_WEIGHTS[interaction.action] ?? 0;
        const currentScore = productScores.get(pid) || 0;
        productScores.set(pid, currentScore + weight);
    }

    return Array.from(productScores.entries())
        .map(([productId, score]) => ({ productId, score }))
        .sort((a, b) => b.score - a.score);
};
