import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "../../components/ui/Button";
import logo from '../../assets/Logo/fashion_logo.png';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { signup, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setError("");
                setIsLoading(true);
                await googleLogin(tokenResponse.access_token);
                navigate("/user/home");
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await signup({ name, email, password });
            navigate("/user/home");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] relative overflow-hidden font-sans selection:bg-[#0071e3] selection:text-white">

            {/* Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-[#0071e3]/5 rounded-full blur-[90px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-[#0071e3]/5 rounded-full blur-[90px]" />

            <div className="relative z-10 max-w-[420px] w-full mx-4">

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[36px] border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-[1.01]">

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <Link to="/" className="inline-block mb-6 transition-transform hover:scale-105 active:scale-95">
                            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full object-cover border border-white shadow-sm" />
                        </Link>

                        <h2 className="text-[30px] font-semibold text-[#1d1d1f] tracking-tight">
                            Create Account
                        </h2>

                        <p className="mt-3 text-[14px] text-[#86868b]">
                            Join us and start your journey
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSignup}>

                        {/* Error */}
                        {error && (
                            <div className="bg-[#fff2f2] text-[#ff3b30] text-center p-3 rounded-xl text-[13px] font-medium border border-[#ff3b30]/10">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[12px] text-[#86868b] font-medium pl-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Milan Ahir"
                                className="w-full px-5 py-4 rounded-full bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#86868b] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[12px] text-[#86868b] font-medium pl-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-5 py-4 rounded-full bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#86868b] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[12px] text-[#86868b] font-medium pl-1">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 pr-12 rounded-full bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#86868b] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f]"
                                >
                                    {showPassword ? (
                                        <HugeiconsIcon icon={ViewOffIcon} size={18} />
                                    ) : (
                                        <HugeiconsIcon icon={ViewIcon} size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-full bg-[#0071e3]! hover:bg-[#0077ed]! text-white text-[14px] font-semibold transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin mr-2" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </div>

                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center">
                        <div className="flex-grow border-t border-[#e5e5ea]" />
                        <span className="mx-4 text-[11px] text-[#86868b] uppercase tracking-wider">
                            or
                        </span>
                        <div className="flex-grow border-t border-[#e5e5ea]" />
                    </div>

                    {/* Google */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleGoogleAuth()}
                        className="w-full py-4 rounded-full border-[#e5e5ea] bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-[14px] font-medium transition-all active:scale-[0.98]"
                    >
                        <svg className="h-[18px] w-[18px] mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-[13px] text-[#86868b]">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#0071e3] font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signup;