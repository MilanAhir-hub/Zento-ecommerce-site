import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-[#222222] font-sans selection:bg-[#000000] selection:text-white">
            
            {/* Left Column: Image (Desktop only) */}
            <div className="hidden lg:block relative h-full w-full bg-stone-100 overflow-hidden">
                <img
                    src="https://img.magnific.com/free-photo/fashionable-model-stylish-hat-red-coat-boots-posing-white-wall-studio_273443-4646.jpg"
                    alt="Novara Lifestyle"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Brand Logo Overlay */}
                <Link
                    to="/"
                    className="absolute top-10 left-10 z-10 text-[36px] font-semibold tracking-[0.2em] text-white uppercase select-none hover:opacity-90 transition-opacity"
                >
                    Novara
                </Link>
            </div>

            {/* Right Column: Form */}
            <div className="relative flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 h-full overflow-y-auto">
                {/* Need Help Link */}
                <div className="absolute top-8 right-8">
                    <a
                        href="mailto:support@novara.com"
                        className="text-[12px] font-medium text-[#767676] hover:text-black underline underline-offset-4 tracking-wider uppercase"
                    >
                        Need Help?
                    </a>
                </div>

                <div className="w-full max-w-[420px] pt-12 lg:pt-0">
                    {/* Header Tagline */}
                    <h2 className="text-[14px] font-medium text-[#222222] tracking-[0.02em] text-center mb-8">
                        Sign In or Create an Account to enjoy the benefits
                    </h2>

                    {/* Benefit Icons Bar */}
                    <div className="grid grid-cols-3 gap-4 text-center mb-8 border-b border-[#E5E5E5] pb-8">
                        <div className="flex flex-col items-center">
                            <div className="mb-2 text-[#222222]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 1 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                </svg>
                            </div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#222222]">Private</span>
                            <span className="text-[10px] text-[#767676] tracking-[0.02em]">Sales</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-2 text-[#222222]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                </svg>
                            </div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#222222]">Faster</span>
                            <span className="text-[10px] text-[#767676] tracking-[0.02em]">Checkout</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-2 text-[#222222]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                </svg>
                            </div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#222222]">List</span>
                            <span className="text-[10px] text-[#767676] tracking-[0.02em]">Curation</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Error */}
                        {error && (
                            <div className="bg-[#fff2f2] text-[#ff3b30] text-center p-3 text-[13px] font-medium border border-[#ff3b30]/10 rounded-none">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full px-4 py-3.5 bg-white border border-[#E5E5E5] text-[#222222] placeholder-[#767676] text-[14px] focus:outline-none focus:border-black rounded-none transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3.5 bg-white border border-[#E5E5E5] text-[#222222] placeholder-[#767676] text-[14px] focus:outline-none focus:border-black rounded-none transition-colors pr-14"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#767676] hover:text-black uppercase tracking-wider"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-black text-white text-[12px] font-semibold uppercase tracking-[0.12em] hover:bg-black/90 active:scale-[0.99] transition-all flex items-center justify-center rounded-none disabled:bg-stone-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Forgot Password & Signup Links */}
                    <div className="flex justify-between items-center mt-6 text-[12px]">
                        <Link
                            to="/forgot-password"
                            className="text-[#222222] hover:text-black underline underline-offset-4 font-medium"
                        >
                            Forgot Password?
                        </Link>
                        <Link
                            to="/signup"
                            className="text-[#222222] hover:text-black underline underline-offset-4 font-medium"
                        >
                            Create An Account
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="my-8 flex items-center">
                        <div className="flex-grow border-t border-[#E5E5E5]" />
                        <span className="mx-4 text-[10px] text-[#767676] uppercase tracking-widest">
                            or
                        </span>
                        <div className="flex-grow border-t border-[#E5E5E5]" />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={() => handleGoogleAuth()}
                        disabled={isLoading}
                        className="w-full h-12 border border-[#000000] bg-white text-[#000000] text-[12px] font-semibold uppercase tracking-[0.08em] hover:bg-black/5 active:scale-[0.99] transition-all flex items-center justify-center gap-3 rounded-none"
                    >
                        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
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
    );
};

export default Login;