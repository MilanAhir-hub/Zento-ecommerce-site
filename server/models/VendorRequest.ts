import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorRequest extends Document {
    user: mongoose.Types.ObjectId;
    storeName: string;
    businessType: string;
    gstNumber?: string;
    phoneNumber: string;
    storeAddress: string;
    bankAccountNumber: string;
    ifscCode: string;
    storeLogo?: string;
    status: 'pending' | 'approved' | 'rejected';
}

const VendorRequestSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true // One user can only have one active request
        },
        storeName: {
            type: String,
            required: [true, 'Store name is required'],
            trim: true
        },
        businessType: {
            type: String,
            required: [true, 'Business type is required'],
        },
        gstNumber: {
            type: String,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        storeAddress: {
            type: String,
            required: [true, 'Store address is required'],
        },
        bankAccountNumber: {
            type: String,
            required: [true, 'Bank account number is required'],
        },
        ifscCode: {
            type: String,
            required: [true, 'IFSC code is required'],
        },
        storeLogo: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

export const VendorRequest = mongoose.model<IVendorRequest>('VendorRequest', VendorRequestSchema);
