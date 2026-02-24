import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    picture?: string;
    role: "user" | "vendor" | "admin";
    storeName?: string;
    storeDescription?: string;
    logo?: string;
    address?: string;
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function (this: any) { return !this.googleId; } },
    googleId: { type: String, sparse: true, unique: true },
    picture: { type: String },
    role: {
        type: String,
        enum: ["user", "vendor", "admin"],
        default: "user",
    },
    storeName: { type: String },
    storeDescription: { type: String },
    logo: { type: String },
    address: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password || "");
};

export const User = mongoose.model<IUser>("User", UserSchema);