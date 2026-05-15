import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

const run = async () => {
    // Test both v1 and v1beta
    for (const version of ['v1', 'v1beta']) {
        console.log(`\n========== API VERSION: ${version} ==========`);
        try {
            const res = await axios.get(`https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`);
            const models = res.data.models as any[];

            console.log(`\n--- Models supporting generateContent ---`);
            models
                .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
                .forEach((m: any) => console.log(`  ✅ ${m.name} (${m.displayName})`));

            console.log(`\n--- Models supporting embedContent ---`);
            models
                .filter((m: any) => m.supportedGenerationMethods?.includes('embedContent'))
                .forEach((m: any) => console.log(`  ✅ ${m.name} (${m.displayName})`));
        } catch (e: any) {
            console.error(`Error for ${version}:`, e.message);
        }
    }
};

run();
