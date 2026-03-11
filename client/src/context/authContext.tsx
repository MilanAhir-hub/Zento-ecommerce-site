import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";
import { authService } from "../services/auth.api";
export interface VendorRequestData {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "vendor" | "admin";
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    vendorRequest: VendorRequestData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    googleLogin: (googleToken: string) => Promise<void>;
    signup: (userData: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [vendorRequest, setVendorRequest] = useState<VendorRequestData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/user/me"); // important
            setUser(response.data.user);
            setVendorRequest(response.data.vendorRequest || null);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setVendorRequest(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const response = await authService.login(credentials);
        setUser(response.data.user);

        // After login, we must re-check auth to get the vendorRequest and other sensitive info 
        // since the old authService.login might only return minimal user data
        await checkAuth();
        setIsAuthenticated(true);
    };

    const googleLogin = async (googleToken: string) => {
        const response = await authService.googleLogin(googleToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
    };

    const signup = async (userData: SignupData) => {
        const response = await authService.signup(userData);
        setUser(response.data.user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setVendorRequest(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, vendorRequest, isAuthenticated, isLoading, login, googleLogin, signup, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};