import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store files in memory for Cloudinary upload (no local disk writing needed)
const storage = multer.memoryStorage();

// Accept only image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Multer middleware
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
    },
});

// Helper: Upload a single buffer to Cloudinary
export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string,
    filename?: string
): Promise<{ url: string; public_id: string; secure_url: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename || `product_${Date.now()}`,
                overwrite: true,
                // No upload-time transformation: store the original at full quality.
                // Resize/optimize at delivery time via Cloudinary URL parameters instead.
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error || new Error('Cloudinary upload failed'));
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                });
            }
        );
        uploadStream.end(buffer);
    });
};

export default cloudinary;
