import api from "./api";
import type { LoginCredentials, SignupData } from "../context/authContext";

export const authService = {
    login: async (credentials: LoginCredentials) => {
        return await api.post("/auth/login", credentials);
    },
    googleLogin: async (googleToken: string) => {
        return await api.post("/auth/google", { googleToken });
    },
    signup: async (userData: SignupData) => {
        return await api.post("/auth/signup", userData);
    },
    logout: async () => {
        return await api.post("/auth/logout");
    }
};

export const sendOtp = async (email: string) => {
    return await api.post("/auth/forgot-password", { email });
};

export const verifyOtp = async (email: string, otp: string) => {
    return await api.post("/auth/verify-otp", { email, otp });
};

export const resetPassword = async (email: string, otp: string, password: string) => {
    return await api.post("/auth/reset-password", { email, otp, password });
};
