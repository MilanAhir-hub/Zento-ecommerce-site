import { getDynamicVisionModel, getDynamicEmbeddingModel } from "../services/ai/modelSelector";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
    try {
        console.log("--- Testing Vision Model ---");
        const visionModel = await getDynamicVisionModel();
        const visionResult = await visionModel.generateContent("Say hello in one word.");
        console.log(`✅ Vision OK: "${visionResult.response.text().trim()}"`);
    } catch (e: any) {
        console.error(`❌ Vision FAILED: ${e.message}`);
    }

    try {
        console.log("\n--- Testing Embedding Model ---");
        const embeddingModel = await getDynamicEmbeddingModel();
        const embedResult = await embeddingModel.embedContent("blue cotton t-shirt");
        console.log(`✅ Embedding OK: vector length = ${embedResult.embedding.values.length}`);
    } catch (e: any) {
        console.error(`❌ Embedding FAILED: ${e.message}`);
    }
};

test();
