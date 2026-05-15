import mongoose, { Document, Schema } from "mongoose";

export interface IProductImage {
    url: string;
    public_id: string;
}

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    images: IProductImage[];
    stock: number;
    vendorId: mongoose.Types.ObjectId | any;
    category: string;
    subcategory?: string;
    imageEmbedding?: number[];
}

const ProductSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: [true, "Please provide a product title"],
            trim: true,
        },

        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
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
        subcategory: {
            type: String,
            required: false,
        },

        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            min: [0, "Price cannot be negative"],
        },

        imageUrl: {
            type: String,
            default: "",
        },

        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                public_id: {
                    type: String,
                    required: true,
                },
            },
        ],

        stock: {
            type: Number,
            required: true,
            default: 1,
            min: [0, "Stock cannot be negative"],
        },
        imageEmbedding: {
            type: [Number],
            select: false, // Don't return this large array in normal queries
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);