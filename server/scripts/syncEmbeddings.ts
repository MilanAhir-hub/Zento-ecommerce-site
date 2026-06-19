import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../models/Product";
import { generateTextEmbedding } from "../services/ai/visualSearchService";

dotenv.config();

const syncEmbeddings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");
        console.log("✅ connected to MongoDB");

        // Find products that do not have a valid imageEmbedding field (missing, null, or empty array)
        const products = await Product.find({
            $or: [
                { imageEmbedding: { $exists: false } },
                { imageEmbedding: { $size: 0 } },
                { imageEmbedding: null }
            ]
        }).select("+imageEmbedding");
        console.log(`Found ${products.length} products without embeddings. Generating now...`);

        let count = 0;
        for (const product of products) {
            console.log(`Processing [${count + 1}/${products.length}]: ${product.title}`);

            // For existing products, we generate a text embedding based on title + description
            // which allows them to be searchable by semantic meaning as well.
            const textToEmbed = `${product.title}. ${product.description}. Category: ${product.category}.`;

            try {
                const embedding = await generateTextEmbedding(textToEmbed);
                product.imageEmbedding = embedding;
                await product.save();
                console.log(`  ✅ Embedding saved.`);
                count++;
            } catch (err: any) {
                console.error(`  ❌ Failed to generate embedding:`, err.message);
            }

            // Basic rate limiting to prevent hitting Gemini API limits (15 RPM for free tier)
            await new Promise((resolve) => setTimeout(resolve, 4000));
        }

        console.log(`🎉 Finished! Synced embeddings for ${count} products.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error syncing embeddings:", error);
        process.exit(1);
    }
};

syncEmbeddings();
