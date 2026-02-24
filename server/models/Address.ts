import mongoose, { Document, Schema } from "mongoose";

export interface IAddress extends Document {
    user: mongoose.Types.ObjectId;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        street: { type: String, required: [true, "Please provide a street address"] },
        city: { type: String, required: [true, "Please provide a city"] },
        state: { type: String, required: [true, "Please provide a state"] },
        postalCode: { type: String, required: [true, "Please provide a postal code"] },
        country: { type: String, required: [true, "Please provide a country"] },
        isDefault: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const Address = mongoose.model<IAddress>("Address", AddressSchema);
