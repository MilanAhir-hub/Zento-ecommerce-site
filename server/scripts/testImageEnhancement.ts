import axios from "axios";
import * as fs from "fs";
import * as path from "path";

/**
 * Run this test script after you:
 * 1. Add REMOVE_BG_API_KEY and REPLICATE_API_TOKEN in server/.env
 * 2. Put a 'test-image.jpg' in this scripts/ folder
 * 3. Add your Vendor JWT token below.
 */
const testEnhanceImage = async () => {
    try {
        const token = "PUT_YOUR_VENDOR_JWT_TOKEN_HERE";

        const imagePath = path.join(__dirname, "test-image.jpg");
        if (!fs.existsSync(imagePath)) {
            console.log("Please add a 'test-image.jpg' file in the server/scripts/ directory to run this test.");
            return;
        }

        // We use global FormData / Blob for modern Node.js (v18+)
        const { Blob } = require('buffer');
        const buffer = fs.readFileSync(imagePath);
        const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append("image", blob, "test-image.jpg");

        console.log("Sending image to /api/vendor/ai/enhance-image...");

        const response = await axios.post("http://localhost:5000/api/vendor/ai/enhance-image", formData, {
            headers: {
                Cookie: `token=${token}`
            }
        });

        console.log("Success! Processing result:");
        console.log(response.data);
    } catch (error: any) {
        console.error("Test failed:");
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testEnhanceImage();
