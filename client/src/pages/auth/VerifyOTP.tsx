import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useVerifyOTP from "../../hooks/auth/useVerifyOTP";

const VerifyOTP = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { mutate: verifyOtpMutate, isPending } = useVerifyOTP();

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleChange = (index: number, value: string) => {
        if (value && isNaN(Number(value))) return;

        const newOtp = [...otp];

        if (value.length > 1) {
            const pastedData = value.slice(0, 6).split("");
            for (let i = 0; i < pastedData.length; i++) {
                if (index + i < 6) {
                    newOtp[index + i] = pastedData[i];
                }
            }
            setOtp(newOtp);
            const nextEmptyIndex = newOtp.findIndex(val => val === "");
            const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[440px] w-full bg-white p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
                <div className="mb-10 text-center">
                    <h2 className="text-[28px] font-bold text-stone-900 tracking-tight">
                        Verify OTP
                    </h2>
                    <p className="mt-3 text-[15px] font-medium text-stone-500">
                        We've sent a 6-digit code to <span className="font-bold text-stone-900">{email}</span>
                    </p>
                </div>

                <form className="space-y-8" onSubmit={handleVerify}>
                    {error && (
                        <div className="bg-red-50 text-red-600 text-center p-4 rounded-2xl text-sm font-semibold border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-full aspect-square text-center text-xl font-bold text-stone-900 border border-stone-200 bg-stone-50/50 rounded-xl focus:outline-none focus:ring-0 focus:border-stone-900 focus:bg-white transition-all"
                            />
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-[13px] font-semibold text-stone-500">
                            Didn't receive the code?{" "}
                            <Link
                                to="/forgot-password"
                                className={`text-stone-900 font-bold hover:text-stone-600 transition-colors ${isPending ? "pointer-events-none opacity-50" : ""}`}
                            >
                                Resend
                            </Link>
                        </p>
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
                                    Verifying...
                                </>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;