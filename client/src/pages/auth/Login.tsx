import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/authContext";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setError("");
                setIsLoading(true);
                // We send the access_token to our backend
                await googleLogin(tokenResponse.access_token);
                navigate("/");
            } catch (err: any) {
                setError(err.response?.data?.message || "Google Login failed");
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            setError("Google Login was unsuccessful. Please try again.");
        }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[440px] w-full bg-white p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
                <div className="mb-10 text-center">
                    <h2 className="text-[28px] font-bold text-stone-900 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-3 text-[15px] font-medium text-stone-500">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-stone-900 font-bold hover:text-stone-700 transition-colors">
                            Sign up now
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 text-red-600 text-center p-4 rounded-2xl text-sm font-semibold border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email-address" className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 pl-1">
                                Email Address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-5 py-3.5 border border-stone-200 bg-stone-50/50 rounded-2xl text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:ring-0 focus:border-stone-900 focus:bg-white transition-all text-sm"
                                placeholder="name@example.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <label htmlFor="password" className="block text-xs font-bold text-stone-400 uppercase tracking-widest">
                                    Password
                                </label>
                                <a onClick={() => navigate("/forgot-password")} className="text-xs font-bold text-stone-900 hover:text-stone-600 cursor-pointer transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-5 py-3.5 pr-12 border border-stone-200 bg-stone-50/50 rounded-2xl text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:ring-0 focus:border-stone-900 focus:bg-white transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-4 px-4 border border-transparent text-[15px] font-bold rounded-full text-white bg-stone-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Processing...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-xs font-bold text-stone-400 uppercase tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={() => handleGoogleAuth()}
                            className="w-full flex items-center justify-center px-4 py-3.5 border border-stone-200 shadow-sm text-[15px] font-bold rounded-full text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-200 transition-all active:scale-[0.98]"
                        >
                            <svg className="h-[22px] w-[22px] mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;