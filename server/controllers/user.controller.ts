import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { Wishlist } from "../models/Wishlist";
import { Review } from "../models/Review";
import { Address } from "../models/Address";
import { Notification } from "../models/Notification";
import { AuthRequest } from "../middlewares/auth.middleware";

export const profile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const user = await User.findById(userId).select("-password -resetPasswordOTP -resetPasswordOTPExpires");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// --- PRODUCT BROWSING ---

// Get all products (with optional pagination)
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments();
        const products = await Product.find()
            .sort({ createdAt: -1 }) // Newest first
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

// Get a single product by its ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json({ success: true, product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Search products by keyword (in title or description)
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const keyword = req.query.keyword ? String(req.query.keyword) : "";
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        if (!keyword) {
            res.status(400).json({ message: "Please provide a search keyword" });
            return;
        }

        const filter = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

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

// Get products by category
export const getProductByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        if (!category) {
            res.status(400).json({ message: "Please provide a category" });
            return;
        }

        const filter = {
            category: { $regex: new RegExp(`^${category}$`, 'i') }
        }; // Case-insensitive exact match

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

// --- CART MANAGEMENT ---

// Get current user's active shopping cart
export const getMyCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        let cart = await Cart.findOne({ user: userId })
            .populate("items.product", "title price imageUrl stock");

        // If a cart hasn't been created yet for this user, send an empty structured one
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        res.status(200).json({ success: true, cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Add an item to the shopping cart
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            res.status(400).json({ message: "Product ID is required" });
            return;
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        if (product.stock < quantity) {
            res.status(400).json({ message: "Not enough stock available" });
            return;
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Initial cart creation
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            // Check if the item already exists in the cart list
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

            if (itemIndex > -1) {
                // If the product exists, incrementally add requested quantity to its current quantity
                cart.items[itemIndex].quantity += quantity;

                // Double check stock limit again after incrementing
                if (cart.items[itemIndex].quantity > product.stock) {
                    res.status(400).json({ message: "Cannot exceed available stock" });
                    return;
                }
            } else {
                // Item is totally new, push into array natively
                cart.items.push({ product: productId as any, quantity });
            }

            await cart.save();
        }

        // Return updated populated cart for frontend to seamlessly rerender
        await cart.populate("items.product", "title price imageUrl stock");
        res.status(200).json({ success: true, cart });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Update existing cart item quantity explicitly (e.g. from an input field)
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params; // ID of the specific product
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 1) {
            res.status(400).json({ message: "Valid quantity (1 or more) is required" });
            return;
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === id);

        if (itemIndex > -1) {
            // Verify new requested explicit quantity against actual stock
            const product = await Product.findById(id);
            if (!product || product.stock < quantity) {
                res.status(400).json({ message: "Not enough stock available" });
                return;
            }

            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            await cart.populate("items.product", "title price imageUrl stock");

            res.status(200).json({ success: true, cart });
        } else {
            res.status(404).json({ message: "Product not found in active cart" });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Remove a specific product completely from the user's cart
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params; // Product ID to wipe out

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: id } } },
            { new: true }
        ).populate("items.product", "title price imageUrl stock");

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        res.status(200).json({ success: true, cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Wipe out all products in the cart (e.g. post-purchase)
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
// --- ORDER MANAGEMENT ---

// Create a new order directly from the current active cart
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: "Cannot create an order from an empty cart" });
            return;
        }

        // 1. Double check stock and group items cleanly by the `vendorId` field on their embedded Product models!
        const itemsByVendor: Record<string, any[]> = {};

        for (const item of cart.items) {
            const product: any = item.product;

            // Fail fast if an item was suddenly purchased out of stock by someone else
            if (!product || product.stock < item.quantity) {
                res.status(400).json({ message: `Product ${product?.title || "Unknown"} is out of stock` });
                return;
            }

            const vId = product.vendorId.toString();

            if (!itemsByVendor[vId]) {
                itemsByVendor[vId] = [];
            }

            itemsByVendor[vId].push({
                product: product._id,
                quantity: item.quantity,
                price: product.price, // Lock in the snapshot price of the product at checkout time
            });
        }

        const createdOrders = [];

        // 2. Iterate each vendor category individually and produce a discrete Order document for each vendor
        for (const [vendorId, items] of Object.entries(itemsByVendor)) {
            // Calculate exact total amount for this specific vendor's subset of the cart
            const totalAmount = items.reduce((acc, currentItem) => acc + (currentItem.price * currentItem.quantity), 0);

            const newOrder = await Order.create({
                user: userId,
                vendorId,
                items,
                totalAmount,
                status: 'Pending'
            });

            createdOrders.push(newOrder);

            // Deduct the inventory live so nobody else can buy it
            for (const item of items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity } // safely decrement natively using DB guarantees
                });
            }
        }

        // 3. Wipe out the user's cart now that orders have successfully processed
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

        res.status(201).json({ success: true, message: "Order placed successfully", orders: createdOrders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Get all orders historically placed by this user
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalOrders = await Order.countDocuments({ user: userId });
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("items.product", "title price imageUrl")
            .populate("vendorId", "storeName name");

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

// Inspect a specific order
export const getMyOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Ensure users cannot view orders secretly belonging to other users
        const order = await Order.findOne({ _id: id, user: userId })
            .populate("items.product", "title price imageUrl category description");

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json({ success: true, order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Cancel an order securely (Must not be shipped or delivered)
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const order = await Order.findOne({ _id: id, user: userId });

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        if (order.status === "Shipped" || order.status === "Delivered" || order.status === "Cancelled") {
            res.status(400).json({ message: `Order cannot be cancelled because it is already ${order.status}` });
            return;
        }

        // Mutate status to Cancelled
        order.status = "Cancelled";
        await order.save();

        // Very important: Safely return the reserved stock quantities back into the Product inventory pool
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        res.status(200).json({ success: true, message: "Order cancelled successfully, stock returned", order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
// --- WISHLIST MANAGEMENT ---

// Get current user's active wishlist
export const getMyWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        let wishlist = await Wishlist.findOne({ user: userId })
            .populate("items", "title price imageUrl stock category");

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [] });
        }

        res.status(200).json({ success: true, wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Add product to wishlist
export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        if (!productId) {
            res.status(400).json({ message: "Product ID is required" });
            return;
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [productId] });
        } else {
            // Prevent duplicates! Unlike a cart, you don't have "quantities" of a wish. 
            // So we explicitly check if the ID already exists in the array natively stringified.
            const isAlreadyAdded = wishlist.items.some(id => id.toString() === productId);

            if (isAlreadyAdded) {
                res.status(400).json({ message: "Product is already in your wishlist" });
                return;
            }

            wishlist.items.push(productId as any);
            await wishlist.save();
        }

        await wishlist.populate("items", "title price imageUrl stock category");
        res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Remove a generic item from the wishlist
export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params; // Product ID 

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $pull: { items: id } }, // Target the pure array natively using native Mongoose pull operators
            { new: true }
        ).populate("items", "title price imageUrl stock category");

        if (!wishlist) {
            res.status(404).json({ message: "Wishlist not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Removed from wishlist", wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Clear the entire wishlist permanently
export const clearWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Wishlist cleared successfully", wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
// --- REVIEWS AND RATINGS ---

// Add a product review (Only if purchased!)
export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { productId, rating, comment } = req.body;

        if (!productId || rating === undefined || !comment) {
            res.status(400).json({ message: "Product ID, rating, and comment are required" });
            return;
        }

        // Rule: User can review only if purchased.
        const hasPurchased = await Order.findOne({
            user: userId,
            "items.product": productId,
            status: { $ne: "Cancelled" } // As long as order went through and didn't cancel
        });

        if (!hasPurchased) {
            res.status(403).json({ message: "You can only review products you have officially purchased" });
            return;
        }

        // Prevent multiple reviews on the exact same product from the exact same user
        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            res.status(400).json({ message: "You have already reviewed this product" });
            return;
        }

        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment
        });

        res.status(201).json({ success: true, message: "Review added successfully", review });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Update an existing personal review
export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params; // Review ID
        const { rating, comment } = req.body;

        const review = await Review.findOne({ _id: id, user: userId });

        if (!review) {
            res.status(404).json({ message: "Review not found or unauthorized to edit" });
            return;
        }

        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        await review.save();

        res.status(200).json({ success: true, message: "Review updated successfully", review });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Delete a personal review
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const review = await Review.findOneAndDelete({ _id: id, user: userId });

        if (!review) {
            res.status(404).json({ message: "Review not found or unauthorized to delete" });
            return;
        }

        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Get reviews for a specific product (Public endpoint)
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalReviews = await Review.countDocuments({ product: productId });

        // Find reviews and populate the author info cleanly
        const reviews = await Review.find({ product: productId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "name picture");

        // Calculate average rating dynamically for star displays
        const avgAggregation = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId as string) } },
            { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);

        const averageRating = avgAggregation.length > 0 ? Number(avgAggregation[0].averageRating.toFixed(1)) : 0;

        res.status(200).json({
            success: true,
            totalReviews,
            averageRating,
            totalPages: Math.ceil(totalReviews / limit),
            currentPage: page,
            reviews,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
// --- PROFILE MANAGEMENT ---

// Update My Profile (name, picture, etc)
export const updateMYProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { name, picture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { name, picture } },
            { new: true, runValidators: true }
        ).select("-password -resetPasswordOTP -resetPasswordOTPExpires");

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Delete My Account (Permanently)
export const deleteMyAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        // Cascade delete all their stuff so the database doesn't clutter
        await User.findByIdAndDelete(userId);
        await Cart.findOneAndDelete({ user: userId });
        await Wishlist.findOneAndDelete({ user: userId });
        await Address.deleteMany({ user: userId });
        await Notification.deleteMany({ user: userId });
        // NOTE: we generally preserve Orders for accounting reasons instead of deleting them

        // Delete JWT cookie via clearing it natively in standard Express
        res.clearCookie("token");

        res.status(200).json({ success: true, message: "Account successfully deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// --- ADDRESS MANAGEMENT ---

// Get all my addresses
export const getMyAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });

        res.status(200).json({ success: true, addresses });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Add a new address
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { street, city, state, postalCode, country, isDefault } = req.body;

        // Automatically toggle off older default statuses if they requested this one to be default
        if (isDefault) {
            await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
        }

        const newAddress = await Address.create({
            user: userId,
            street,
            city,
            state,
            postalCode,
            country,
            isDefault: isDefault || false
        });

        res.status(201).json({ success: true, message: "Address added successfully", address: newAddress });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Update an address
export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const { isDefault } = req.body;

        if (isDefault) {
            await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
        }

        const address = await Address.findOneAndUpdate(
            { _id: id, user: userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!address) {
            res.status(404).json({ message: "Address not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Address updated", address });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Delete address
export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const deletedAddress = await Address.findOneAndDelete({ _id: id, user: userId });

        if (!deletedAddress) {
            res.status(404).json({ message: "Address not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Address deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// --- NOTIFICATIONS ---

// Get my notifications
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

        res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Mark unread notifications explicitly as read
export const markNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        // Mutates all existing unread notifications belonging to the user safely
        await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: "Notifications marked as read" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

