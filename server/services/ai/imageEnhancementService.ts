import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Service to handle image background removal and resizing via hybrid AI model.
 * If usage is < 50, routes to remove.bg, otherwise strictly to replicate.com rembg model.
 */

// Model version for cjwbw/rembg on Replicate
const REPLICATE_REMBG_VERSION = "fb8af171cfa1616ddcf1242c093f9c46bcada5bad4c2f26d61f1c7d242c161eb";

export const enhanceImageWithAI = async (
    imageBuffer: Buffer,
    mimetype: string,
    filename: string,
    usageCount: number
): Promise<Buffer> => {

    // Validate buffer
    if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error("Invalid image buffer provided.");
    }

    if (usageCount < 50) {
        console.log(`Usage is ${usageCount}. Routing to perform Remove.bg AI...`);
        return await processWithRemoveBg(imageBuffer, mimetype, filename);
    } else {
        console.log(`Usage is ${usageCount}. Routing to perform Replicate AI...`);
        return await processWithReplicate(imageBuffer, mimetype);
    }
};

const processWithRemoveBg = async (buffer: Buffer, mimetype: string, filename: string): Promise<Buffer> => {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
        throw new Error("REMOVE_BG_API_KEY is not configured.");
    }

    // Using global Blob and FormData available in modern Node.js
    const blob = new Blob([new Uint8Array(buffer)], { type: mimetype });
    const formData = new FormData();
    formData.append('image_file', blob, filename);
    formData.append('size', 'auto'); // Allows remove.bg to automatically resize nicely

    try {
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                'X-Api-Key': apiKey,
                // axios will automatically set the correct Content-Type for FormData
            },
            responseType: 'arraybuffer',
            maxBodyLength: Infinity // Allow large image uploads
        });

        return Buffer.from(response.data);
    } catch (error: any) {
        if (error.response) {
            console.error("Remove.bg failed:", error.response.data.toString());
            throw new Error(`Remove.bg Error: ${error.response.statusText}`);
        }
        throw new Error(`Remove.bg Error: ${error.message}`);
    }
};

const processWithReplicate = async (buffer: Buffer, mimetype: string): Promise<Buffer> => {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
        throw new Error("REPLICATE_API_TOKEN is not configured.");
    }

    try {
        const base64Image = buffer.toString('base64');
        const dataUri = `data:${mimetype};base64,${base64Image}`;

        // 1. Create Prediction
        let predictionResponse = await axios.post('https://api.replicate.com/v1/predictions', {
            version: REPLICATE_REMBG_VERSION,
            input: { image: dataUri }
        }, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        });

        let prediction = predictionResponse.data;
        const getUrl = prediction.urls.get;

        // 2. Poll for Completion
        // Replicate's API requires polling for the result
        while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // sleep 1s
            const statusResponse = await axios.get(getUrl, {
                headers: { 'Authorization': `Bearer ${apiToken}` }
            });
            prediction = statusResponse.data;
        }

        if (prediction.status === 'failed') {
            throw new Error("Replicate model prediction failed.");
        }

        // 3. Download Output Image
        // Output is usually a URL to the processed image file
        const outputUrl = prediction.output;
        if (!outputUrl) {
            throw new Error("Replicate succeeded but no output was returned.");
        }

        const imageResponse = await axios.get(outputUrl, {
            responseType: 'arraybuffer',
            maxBodyLength: Infinity
        });

        return Buffer.from(imageResponse.data);
    } catch (error: any) {
        if (error.response) {
            console.error("Replicate failed:", error.response.data);
            throw new Error(`Replicate Error: ${error.response.status}`);
        }
        throw new Error(`Replicate Error: ${error.message}`);
    }
};
