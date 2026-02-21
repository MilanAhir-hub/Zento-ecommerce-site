import api from "./api";
import type { LoginCredentials, SignupData } from "../context/authContext";

export const authService = {
    login: async (credentials: LoginCredentials) => {
        return await api.post("/auth/login", credentials);
    },
    signup: async (userData: SignupData) => {
        return await api.post("/auth/signup", userData);
    },
    logout: async () => {
        return await api.post("/auth/logout");
    }
};
