import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useVerifyOTP from "../../hooks/auth/useVerifyOTP";

const VerifyOTP = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { mutate: verifyOtpMutate, isPending } = useVerifyOTP();

    // Redirect to forgot-password if no email is provided in state
    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && isNaN(Number(value))) return;

        const newOtp = [...otp];

        // Handle pasting of full OTP
        if (value.length > 1) {
            const pastedData = value.slice(0, 6).split("");
            for (let i = 0; i < pastedData.length; i++) {
                if (index + i < 6) {
                    newOtp[index + i] = pastedData[i];
                }
            }
            setOtp(newOtp);
            // Focus on the next empty input or the last one
            const nextEmptyIndex = newOtp.findIndex(val => val === "");
            const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is typed
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }

        verifyOtpMutate(
            { email, otp: otpValue },
            {
                onSuccess: () => {
                    navigate("/reset-password", { state: { email, otp: otpValue } });
                },
                onError: (err: any) => {
                    setError(err.response?.data?.message || "Invalid or expired OTP");
                }
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>. Enter it below to confirm your email.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                    {error && (
                        <div className="bg-red-50 text-red-500 text-center p-3 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between w-full space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={6} // allow pasting 6 digits
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="text-sm">
                            <span className="text-gray-600">Didn't receive the code? </span>
                            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Resend
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all ${isPending ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                        >
                            {isPending ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;