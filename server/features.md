# AI Image Enhancement Backend Features

- **Automated Background Removal**: Vendors can upload product images and magically remove backgrounds to maintain a clean, professional look for their store.
- **Smart Image Resizing**: Automatically resizes the processed images to standard e-commerce dimensions, ensuring consistency across the platform.
- **Hybrid AI Model Routing**: Intelligently routes requests based on usage to optimize cost and quality:
  - Uses the premium **remove.bg** API for the first 50 requests per month.
  - Seamlessly falls back to the **Replicate (rembg model)** API for users exceeding the free tier limit.
- **Vendor Usage Tracking**: Accurately monitors each vendor's monthly AI usage, automatically resetting the counter on a rolling monthly basis.
- **Efficient Cloud Storage Integration**: Processes images in-memory and uploads them directly to Cloudinary, ensuring fast delivery and saving local disk space.
- **Secure and Authenticated**: The enhancement endpoints are fully protected, accessible only to authenticated users with a Vendor role.
