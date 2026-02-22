import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
                // Store the email in state or local storage if you want to prepopulate it on the reset password page
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you an OTP to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
                    {error && (
                        <div className="bg-red-50 text-red-500 text-center p-3 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 text-center p-3 rounded-md text-sm border border-green-200">
                            {success}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Back to login
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isPending ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                        >
                            {isPending ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;