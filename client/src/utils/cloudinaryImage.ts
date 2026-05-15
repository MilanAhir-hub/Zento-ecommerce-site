/**
 * Cloudinary image optimization utility.
 *
 * We store the original (full-quality) image URL in the database.
 * At render time, we inject Cloudinary URL transformation parameters
 * to serve a properly sized, format-auto, quality-auto version.
 *
 * This means thumbnails (ProductCard) get a small, fast image,
 * while the detail page gets a full-size, high-quality image.
 */

/**
 * Injects Cloudinary transformation params into an existing secure_url.
 * Works by inserting the transformation string after "/upload/".
 *
 * @param url    - The original Cloudinary secure_url stored in DB
 * @param width  - Desired width in pixels (optional)
 * @param height - Desired height in pixels (optional)
 * @param crop   - Cloudinary crop mode (default: 'limit' — never upscales)
 * @returns      - Optimized delivery URL
 */
export function getCloudinaryUrl(
    url: string | undefined | null,
    options: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string | number;
        format?: string;
    } = {}
): string {
    if (!url || !url.includes('/upload/')) return url || '';

    const {
        width,
        height,
        crop = 'limit',
        quality = 'auto',
        format = 'auto',
    } = options;

    const parts: string[] = [`q_${quality}`, `f_${format}`];
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    if (width || height) parts.push(`c_${crop}`);

    const transformation = parts.join(',');
    return url.replace('/upload/', `/upload/${transformation}/`);
}
