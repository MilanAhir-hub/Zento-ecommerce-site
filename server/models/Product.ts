import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
    vendorId: string;
    category: string;
}

const ProductSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: [true, "Please provide a product title"],
            trim: true,
        },
        vendorId: {
            type: String,
            required: [true, "Please provide a vendor ID"],
        },
        description: {
            type: String,
            required: [true, "Please provide a product description"],
        },
        category: {
            type: String,
            required: [true, "Please provide a product category"],
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            min: [0, "Price cannot be negative"],
        },
        imageUrl: {
            type: String,
            default: "", // Will add image uploading later if needed
        },
        stock: {
            type: Number,
            required: true,
            default: 1,
            min: [0, "Stock cannot be negative"],
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
