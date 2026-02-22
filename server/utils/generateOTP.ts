import crypto from "crypto";

export const generateOTP = (): { otp: string; hashedOTP: string } => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = hashOTP(otp);
    return { otp, hashedOTP };
};

export const hashOTP = (otp: string): string => {
    return crypto.createHash("sha256").update(otp).digest("hex");
};