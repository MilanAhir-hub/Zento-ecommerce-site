import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import useResetPassword from "../../hooks/auth/useResetPassword";
import logo from "../../assets/Logo/fashion_logo.png";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { mutate: resetPasswordMutate, isPending } = useResetPassword();

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const otp = location.state?.otp;

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password");
        }
    }, [email, otp, navigate]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        resetPasswordMutate(
            { email, otp, password },
            {
                onSuccess: (response: any) => {
                    setSuccess(response.data?.message || "Password reset successful!");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                },
                onError: (err: any) => {
                    setError(err.response?.data?.message || "Failed to reset password.");
                }
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] relative overflow-hidden font-sans selection:bg-[#0071e3] selection:text-white">

            {/* Softer Background */}
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
                            New Password
                        </h2>
                        <p className="mt-3 text-[14px] text-[#86868b]">
                            Create a secure password for your account.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleResetPassword}>
                        {error && (
                            <div className="bg-[#fff2f2] text-[#ff3b30] text-center p-3 rounded-xl text-[13px] font-medium border border-[#ff3b30]/10">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-[#f2fff2] text-[#34c759] text-center p-3 rounded-xl text-[13px] font-medium border border-[#34c759]/10">
                                {success}
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label htmlFor="new-password" className="text-[12px] text-[#86868b] font-medium pl-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 py-4 pr-12 rounded-full bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#86868b] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <HugeiconsIcon icon={ViewOffIcon} size={18} /> : <HugeiconsIcon icon={ViewIcon} size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label htmlFor="confirm-password" className="text-[12px] text-[#86868b] font-medium pl-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-5 py-4 pr-12 rounded-full bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#86868b] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <HugeiconsIcon icon={ViewOffIcon} size={18} /> : <HugeiconsIcon icon={ViewIcon} size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 rounded-full bg-[#0071e3]! hover:bg-[#0077ed]! text-white text-[14px] font-semibold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isPending ? (
                                    <>
                                        <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin mr-2" />
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <Link to="/login" className="text-[13px] text-[#0071e3] font-medium hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;