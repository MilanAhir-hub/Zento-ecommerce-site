import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password?: string;
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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