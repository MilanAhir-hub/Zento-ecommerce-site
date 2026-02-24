import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useSendOTP from "../../hooks/auth/useSendOTP";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const { mutate: sendOtpMutate, isPending } = useSendOTP();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        sendOtpMutate(email, {
            onSuccess: (response: any) => {
                setSuccess(response.data?.message || "OTP sent to your email.");
                setTimeout(() => {
                    navigate("/verify-otp", { state: { email } });
                }, 2000);
            },
            onError: (err: any) => {
                setError(err.response?.data?.message || "Failed to send OTP.");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[440px] w-full bg-white p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
                <div className="mb-10 text-center">
                    <h2 className="text-[28px] font-bold text-stone-900 tracking-tight">
                        Forgot Password
                    </h2>
                    <p className="mt-3 text-[15px] font-medium text-stone-500">
                        Enter your email to receive a 6-digit verification code.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSendOTP}>
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

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center justify-center py-4 px-4 border border-transparent text-[15px] font-bold rounded-full text-white bg-stone-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Processing...
                                </>
                            ) : (
                                "Send OTP"
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

export default ForgotPassword;