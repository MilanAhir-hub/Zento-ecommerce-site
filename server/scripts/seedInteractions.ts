/**
 * Seed script to generate sample interaction data for testing the recommendation engine.
 * 
 * Usage: npx ts-node scripts/seedInteractions.ts
 * 
 * Creates interactions for 2 test users with different browsing patterns
 * so you can verify that recommendations differ per user.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Interaction from '../models/Interaction';
import { Product } from '../models/Product';

const seedInteractions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        // Fetch some real products from the database
        const products = await Product.find({}).limit(20).lean();

        if (products.length < 6) {
            console.error('Need at least 6 products in the database to seed interactions.');
            process.exit(1);
        }

        // Get 2 real user IDs from Interaction collection (if any exist)
        // Or you can hardcode test user IDs from your database
        const existingUsers = await Interaction.aggregate([
            { $group: { _id: '$userId' } },
            { $limit: 2 }
        ]);

        if (existingUsers.length < 1) {
            console.log('No existing users found in Interaction collection.');
            console.log('Please log in with 2 different accounts and interact with products first.');
            console.log('Then re-run this script to add more test data.');
            process.exit(0);
        }

        const userIds = existingUsers.map((u: any) => u._id);

        // --- USER 1: Interested in first half of products ---
        const user1Products = products.slice(0, 10);
        const user1Interactions = [];

        for (const product of user1Products.slice(0, 5)) {
            // Views (multiple for higher scoring)
            user1Interactions.push({
                userId: userIds[0],
                productId: product._id,
                action: 'view',
                price: product.price,
                timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // random within last 7 days
            });
        }

        // Cart and purchase for top 2
        for (const product of user1Products.slice(0, 2)) {
            user1Interactions.push({
                userId: userIds[0],
                productId: product._id,
                action: 'add_to_cart',
                price: product.price,
                quantity: 1,
                timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)
            });
        }

        user1Interactions.push({
            userId: userIds[0],
            productId: user1Products[0]._id,
            action: 'purchase',
            price: user1Products[0].price,
            quantity: 1,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        });

        // --- USER 2: Interested in second half of products (if 2 users exist) ---
        if (userIds.length >= 2) {
            const user2Products = products.slice(10, 20);
            const user2Interactions = [];

            for (const product of user2Products.slice(0, 5)) {
                user2Interactions.push({
                    userId: userIds[1],
                    productId: product._id,
                    action: 'view',
                    price: product.price,
                    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
                });
            }

            for (const product of user2Products.slice(0, 3)) {
                user2Interactions.push({
                    userId: userIds[1],
                    productId: product._id,
                    action: 'add_to_cart',
                    price: product.price,
                    quantity: 1,
                    timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)
                });
            }

            await Interaction.insertMany(user2Interactions);
            console.log(`Seeded ${user2Interactions.length} interactions for User 2 (${userIds[1]})`);
        }

        await Interaction.insertMany(user1Interactions);
        console.log(`Seeded ${user1Interactions.length} interactions for User 1 (${userIds[0]})`);

        console.log('\n✅ Seed complete! Recommendations should now differ per user.');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seedInteractions();
