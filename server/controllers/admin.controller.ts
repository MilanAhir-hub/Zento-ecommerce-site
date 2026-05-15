import { Request, Response } from "express";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { VendorRequest } from "../models/VendorRequest";
import { Notification } from "../models/Notification";
import { getIO } from "../utils/socket";

// ==========================================
// OVERVIEW STATS
// ==========================================
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Calculate total revenue from all delivered/paid orders
        const orders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        const activeOrders = await Order.countDocuments({ status: { $in: ['pending', 'processing', 'shipped'] } });
        const totalCustomers = await User.countDocuments({ role: 'user' });
        const pendingVendors = await VendorRequest.countDocuments({ status: 'pending' });

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                activeOrders,
                totalCustomers,
                pendingVendors
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// ==========================================
// ORDERS MANAGEMENT
// ==========================================
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // ⭐ REAL-TIME UPDATE
        try {
            getIO().emit("admin_order_update");
            getIO().emit("admin_stats_update");
        } catch (e) {
            console.error("Socket emit failed:", e);
        }

        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// ==========================================
// PRODUCTS MANAGEMENT
// ==========================================
export const getAllAdminProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find()
            .populate({
                path: 'vendorId',
                model: 'User',
                select: 'name email storeName'
            })
            .sort({ createdAt: -1 });

        // Map the populated vendorId to a 'vendor' field for the frontend
        const formattedProducts = products.map(p => {
            const productObj: any = p.toObject();
            if (productObj.vendorId && typeof productObj.vendorId === 'object') {
                productObj.vendor = productObj.vendorId;
                delete productObj.vendorId;
            }
            return productObj;
        });

        res.status(200).json({ success: true, count: formattedProducts.length, data: formattedProducts });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

export const deleteProductAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(`[Admin] Attempting forceful deletion of product ID: ${id}`);

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            console.log(`[Admin] Product deletion failed - Not found: ${id}`);
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log(`[Admin] Product successfully deleted: ${id}`);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
        console.error(`[Admin] Error deleting product:`, error);
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// ==========================================
// CUSTOMERS MANAGEMENT
// ==========================================
export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: customers.length, data: customers });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // e.g., 'admin', 'user', 'vendor'

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// ==========================================
// VENDORS MANAGEMENT
// ==========================================
export const getAllVendors = async (req: Request, res: Response) => {
    try {
        const vendors = await User.find({ role: 'vendor' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: vendors.length, data: vendors });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// ==========================================
// VENDOR REQUESTS
// ==========================================
export const getVendorRequests = async (req: Request, res: Response) => {
    try {
        const requests = await VendorRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

export const handleVendorRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { action, reason } = req.body; // 'approve' or 'reject', and optional reason

        const vendorRequest: any = await VendorRequest.findById(id);
        if (!vendorRequest) {
            return res.status(404).json({ success: false, message: "Vendor request not found" });
        }

        if (action === 'approve') {
            vendorRequest.status = 'approved';
            await vendorRequest.save();

            // Update user role to vendor
            await User.findByIdAndUpdate(vendorRequest.user, { role: 'vendor' });

            await Notification.create({
                user: vendorRequest.user,
                title: "Vendor Application Approved",
                message: "Congratulations! Your request to become a vendor has been approved. You can now access the vendor dashboard and manage your products.",
                type: "system"
            });

        } else if (action === 'reject') {
            vendorRequest.status = 'rejected';
            if (reason) {
                vendorRequest.rejectionReason = reason;
            }
            await vendorRequest.save();

            await Notification.create({
                user: vendorRequest.user,
                title: "Vendor Application Rejected",
                message: `We're sorry, but your vendor application has been rejected by the administrator. ${reason ? `Reason: ${reason}` : ''}`,
                type: "system"
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

        // ⭐ REAL-TIME UPDATE
        try {
            getIO().emit("admin_vendor_request_update");
            getIO().emit("admin_stats_update"); // Pending vendor count might have changed
            getIO().emit(`user_notification_${vendorRequest.user}`); // 🚀 Notify the specific user instantly!
        } catch (e) {
            console.error("Socket emit failed:", e);
        }

        res.status(200).json({ success: true, message: `Request ${action}d successfully`, data: vendorRequest });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// ==========================================
// REMOVE VENDOR 
// ==========================================
export const removeVendor = async (req: Request, res: Response) => {
    try {
        const vendorId = req.params.id; // it's user id of the vendor
        const { reason } = req.body;

        const vendor = await User.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }
        if (vendor.role !== 'vendor') {
            return res.status(400).json({ success: false, message: "User is not currently a vendor" });
        }

        // Downgrade back to normal user
        vendor.role = 'user';
        await vendor.save();

        // Document the reason inside the vendor's fresh new notification
        await Notification.create({
            user: vendorId,
            title: "Vendor Status Revoked",
            message: `Your vendor privileges have been removed by the administrator. Reason: ${reason || "Violation of policies"}`,
            type: "system"
        });

        // ⭐ REAL-TIME UPDATE
        try {
            getIO().emit("admin_stats_update");
            getIO().emit(`user_notification_${vendorId}`); // Tell the vendor's React App to query for new notifications instantly
        } catch (e) {
            console.error("Socket emit failed:", e);
        }

        res.status(200).json({ success: true, message: "Vendor successfully removed." });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || "Server Error" });
    }
};
