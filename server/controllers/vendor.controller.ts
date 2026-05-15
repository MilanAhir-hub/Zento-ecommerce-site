import { Response } from "express";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { AuthRequest } from "../middlewares/auth.middleware";
import { uploadToCloudinary } from "../middlewares/upload.middleware";

export const createVendorProduct = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const vendorId = req.userId;

        const { title, description, price, stock, category, subcategory } = req.body;

        // Validate required fields
        if (!title || !description || price === undefined || stock === undefined || !category) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields including category",
            });
            return;
        }

        // Parse existing images
        let existingImageUrls: string[] = [];
        if (req.body.existingImages) {
            existingImageUrls = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : [req.body.existingImages];
        }

        // Get uploaded files
        const files = req.files as Express.Multer.File[] || [];

        if (files.length === 0 && existingImageUrls.length === 0) {
            res.status(400).json({
                success: false,
                message: "At least one product image is required",
            });
            return;
        }

        // Validate max images
        if (files.length + existingImageUrls.length > 6) {
            res.status(400).json({
                success: false,
                message: "Maximum 6 images allowed",
            });
            return;
        }

        // Upload images to Cloudinary
        const uploadResults = await Promise.all(
            files.map((file, index) =>
                uploadToCloudinary(
                    file.buffer,
                    "zento/products",
                    `${vendorId}_${Date.now()}_${Math.round(Math.random() * 1e9)}_${index}`
                )
            )
        );

        // Extract public_id from url helper
        const getPublicId = (url: string) => {
            try {
                const parts = url.split('/upload/');
                if (parts.length > 1) {
                    const pathParts = parts[1].split('/');
                    if (pathParts[0].startsWith('v') && !isNaN(parseInt(pathParts[0].substring(1)))) {
                        pathParts.shift();
                    }
                    const fullId = pathParts.join('/');
                    const dotIdx = fullId.lastIndexOf('.');
                    return dotIdx > -1 ? fullId.substring(0, dotIdx) : fullId;
                }
            } catch (e) { }
            return "unknown";
        };

        // Format new images for database
        let images = uploadResults.map((img) => ({
            url: img.url,
            public_id: img.public_id,
        }));

        // Append existing images (AI enhanced)
        existingImageUrls.forEach(url => {
            images.push({ url, public_id: getPublicId(url) });
        });

        // Primary image
        const imageUrl = images.length > 0 ? images[0].url : "";

        // Create product
        const product = await Product.create({
            title,
            vendorId,
            description,
            category,
            subcategory,
            price,
            stock,
            imageUrl,
            images,
        });

        res.status(201).json({
            success: true,
            product,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

// Update a vendor product
export const updateVendorProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const vendorId = req.userId;

        const updateData: any = { ...req.body };

        // Parse existing images (URLs that the frontend kept)
        let existingImageUrls: string[] = [];
        if (req.body.existingImages) {
            existingImageUrls = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : [req.body.existingImages];
        }

        const getPublicId = (url: string) => {
            try {
                const parts = url.split('/upload/');
                if (parts.length > 1) {
                    const pathParts = parts[1].split('/');
                    if (pathParts[0].startsWith('v') && !isNaN(parseInt(pathParts[0].substring(1)))) {
                        pathParts.shift();
                    }
                    const fullId = pathParts.join('/');
                    const dotIdx = fullId.lastIndexOf('.');
                    return dotIdx > -1 ? fullId.substring(0, dotIdx) : fullId;
                }
            } catch (e) { }
            return "unknown";
        };

        // If new images were uploaded, upload them to Cloudinary
        const files = req.files as Express.Multer.File[] || [];
        let finalImages: { url: string, public_id: string }[] = [];

        // Add preserved/enhanced existing images
        existingImageUrls.forEach(url => {
            finalImages.push({ url, public_id: getPublicId(url) });
        });

        if (files.length > 0) {
            const uploadResults = await Promise.all(
                files.map((file, index) =>
                    uploadToCloudinary(
                        file.buffer,
                        "zento/products",
                        `${vendorId}_${Date.now()}_${Math.round(Math.random() * 1e9)}_${index}`
                    )
                )
            );
            const uploadedImages = uploadResults.map((img) => ({
                url: img.url,
                public_id: img.public_id,
            }));

            finalImages = [...finalImages, ...uploadedImages];
        }

        if (finalImages.length > 0) {
            updateData.images = finalImages;
            updateData.imageUrl = finalImages[0].url;
        } else {
            // Prevent clearing all images accidentally, require at least one
            res.status(400).json({ success: false, message: "At least one product image is required" });
            return;
        }

        // Find and update the product only if it belongs to this vendor
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id, vendorId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found or unauthorized to update" });
            return;
        }

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Delete a vendor product
export const deleteVendorProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const vendorId = req.userId;

        // Delete the product only if it belongs to this vendor
        const deletedProduct = await Product.findOneAndDelete({ _id: id, vendorId });

        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found or unauthorized to delete" });
            return;
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Get all products for the authenticated vendor (with optional pagination/filtering)
export const getVendorProducts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendorId = req.userId;

        // Pagination logic
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Filtering logic setup
        const searchQuery = req.query.search ? String(req.query.search) : "";

        // Ensure we only query this vendor's products
        const filter: any = { vendorId };

        if (searchQuery) {
            filter.title = { $regex: searchQuery, $options: "i" };
        }

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            products,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Get a specific vendor product by ID
export const getVendorProductById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const vendorId = req.userId;

        // Only return if it belongs to the authenticated vendor
        const product = await Product.findOne({ _id: id, vendorId });

        if (!product) {
            res.status(404).json({ message: "Product not found or unauthorized" });
            return;
        }

        res.status(200).json({ success: true, product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// --- ORDER MANAGEMENT ---

// Get all orders for the authenticated vendor (with optional pagination)
export const getVendorOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendorId = req.userId;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const filter: any = { vendorId };

        const totalOrders = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "name email")
            .populate("items.product", "title imageUrl price");

        res.status(200).json({
            success: true,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            orders,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Update order status
export const updateVendorOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const vendorId = req.userId;
        const { status } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id, vendorId },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            res.status(404).json({ message: "Order not found or unauthorized to update status" });
            return;
        }

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Get a specific vendor order by ID
export const getvendororderbyid = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const vendorId = req.userId;

        const order = await Order.findOne({ _id: id, vendorId })
            .populate("user", "name email")
            .populate("items.product", "title imageUrl price description");

        if (!order) {
            res.status(404).json({ message: "Order not found or unauthorized" });
            return;
        }

        res.status(200).json({ success: true, order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Get vendor dashboard statistics (total products, total orders, total revenue, pending orders)
export const getVendorDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendorId = req.userId;

        // Verify the vendor exists
        if (!vendorId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        // Run independent aggregation queries in parallel using Promise.all to dramatically boost speed
        const [
            totalProducts,
            totalOrders,
            pendingOrdersCount,
            revenueAggregation
        ] = await Promise.all([
            // 1. Total distinct Products created by this vendor
            Product.countDocuments({ vendorId }),

            // 2. Total active Orders tied to this vendor
            Order.countDocuments({ vendorId }),

            // 3. Total subset of orders manually marked "Pending"
            Order.countDocuments({ vendorId, status: "Pending" }),

            // 4. Aggregation Pipeline to sum up total revenue calculation based ONLY on non-cancelled orders
            Order.aggregate([
                {
                    $match: {
                        vendorId,
                        status: { $ne: "Cancelled" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" }
                    }
                }
            ])
        ]);

        // If the array returned something, grab its `.totalRevenue`, otherwise default to 0
        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                totalRevenue,
                pendingOrders: pendingOrdersCount,
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

export const getTopSellingProducts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendorId = req.userId;

        if (!vendorId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const limit = parseInt(req.query.limit as string) || 5;

        // Use MongoDB aggregation to calculate total units sold per product
        const topProducts = await Order.aggregate([
            {
                // 1. Only look at non-cancelled orders belonging to this vendor
                $match: {
                    vendorId,
                    status: { $ne: "Cancelled" }
                }
            },
            {
                // 2. Unwind the items array so each product in the order becomes its own document
                $unwind: "$items"
            },
            {
                // 3. Group by the product ID and sum up the quantity sold & revenue
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            {
                // 4. Sort by highest total sold first
                $sort: { totalSold: -1 }
            },
            {
                // 5. Limit the results to top 5 (or user-defined limit)
                $limit: limit
            },
            {
                // 6. Join with the Products collection to get product names and images
                $lookup: {
                    from: "products", // Mongoose pluralizes standard collections
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                // 7. Unwind the result from $lookup
                $unwind: "$productDetails"
            },
            {
                // 8. Project exactly what the frontend needs
                $project: {
                    _id: 1, // product id
                    totalSold: 1,
                    totalRevenue: 1,
                    title: "$productDetails.title",
                    imageUrl: "$productDetails.imageUrl",
                    price: "$productDetails.price",
                    stock: "$productDetails.stock"
                }
            }
        ]);

        res.status(200).json({ success: true, topProducts });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// --- STORE MANAGEMENT ---

// Get vendor store information
export const getStoreInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendorId = req.userId;

        const vendor = await User.findById(vendorId).select("name email storeName storeDescription logo address");

        if (!vendor) {
            res.status(404).json({ message: "Vendor profile not found" });
            return;
        }

        res.status(200).json({ success: true, store: vendor });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Update vendor store information
export const updateStoreInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendorId = req.userId;
        const { storeName, storeDescription, logo, address } = req.body;

        console.log("Updating store info for vendor:", vendorId);
        console.log("New data from body:", req.body);

        const updatedVendor = await User.findByIdAndUpdate(
            vendorId,
            {
                $set: {
                    storeName,
                    storeDescription,
                    logo,
                    address
                }
            },
            { new: true, runValidators: true }
        ).select("-password -resetPasswordOTP -resetPasswordOTPExpires");

        console.log("Update database result:", updatedVendor ? "User found & updated" : "User not found");

        if (!updatedVendor) {
            res.status(404).json({ message: "Vendor not found" });
            return;
        }

        res.status(200).json({ success: true, store: updatedVendor });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};