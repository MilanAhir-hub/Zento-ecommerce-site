import mongoose from "mongoose";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import Interaction from "../models/Interaction";
import { OrderStatus } from "../constants/orderStatus";

interface CartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

interface OrderInput {
    userId: mongoose.Types.ObjectId;
    items: CartItem[];
}

interface CreatedOrder {
    _id: mongoose.Types.ObjectId;
    vendorId: string;
    totalAmount: number;
    items: { product: mongoose.Types.ObjectId; quantity: number; price: number }[];
}

interface OrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export const createOrdersFromCart = async ({
    userId,
    items,
}: OrderInput): Promise<CreatedOrder[]> => {
    if (!items.length) {
        throw new Error("Cannot create order with empty cart");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productIds = items.map((item) => item.product);
        const products = await Product.find({ _id: { $in: productIds } }).session(session);

        const productMap = new Map(
            products.map((p) => [p._id.toString(), p])
        );

        for (const item of items) {
            const product = productMap.get(item.product.toString());
            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
        }

        const vendorItemsMap = new Map<string, OrderItem[]>();

        for (const item of items) {
            const product = productMap.get(item.product.toString())!;
            const vendorId = product.vendorId.toString();

            if (!vendorItemsMap.has(vendorId)) {
                vendorItemsMap.set(vendorId, []);
            }
            vendorItemsMap.get(vendorId)!.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price,
            });
        }

        const createdOrders: CreatedOrder[] = [];

        for (const [vendorId, vendorItems] of vendorItemsMap.entries()) {
            const totalAmount = vendorItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const order = await Order.create([{
                user: userId,
                vendorId,
                items: vendorItems,
                totalAmount,
                status: OrderStatus.PENDING,
            }], { session });

            for (const item of vendorItems) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            createdOrders.push({
                _id: order[0]._id,
                vendorId,
                totalAmount,
                items: vendorItems,
            });
        }

        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        for (const order of createdOrders) {
            for (const item of order.items) {
                await Interaction.create({
                    userId,
                    productId: item.product,
                    action: 'purchase',
                    quantity: item.quantity,
                    price: item.price,
                });
            }
        }

        return createdOrders;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};