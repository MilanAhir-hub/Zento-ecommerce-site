import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useResetPassword from "../../hooks/auth/useResetPassword";

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
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[440px] w-full bg-white p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
                <div className="mb-10 text-center">
                    <h2 className="text-[28px] font-bold text-stone-900 tracking-tight">
                        New Password
                    </h2>
                    <p className="mt-3 text-[15px] font-medium text-stone-500">
                        Create a secure password for your account.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleResetPassword}>
                    {error && (
                        <div className="bg-red-50 text-red-600 text-center p-4 rounded-2xl text-sm font-semibold border border-red-100">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 text-center p-4 rounded-2xl text-sm font-semibold border border-green-100">
                            {success}
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* New Password */}
                        <div>
                            <label htmlFor="new-password" className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 pl-1">
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 pl-1">
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
                                    className="appearance-none block w-full px-5 py-3.5 pr-12 border border-stone-200 bg-stone-50/50 rounded-2xl text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:ring-0 focus:border-stone-900 focus:bg-white transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center justify-center py-4 px-4 border border-transparent text-[15px] font-bold rounded-full text-white bg-stone-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="text-sm font-bold text-stone-900 hover:text-stone-600 transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;