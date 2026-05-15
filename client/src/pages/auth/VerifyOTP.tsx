import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import useVerifyOTP from "../../hooks/auth/useVerifyOTP";
import logo from "../../assets/Logo/fashion_logo.png";

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
                            Verify OTP
                        </h2>
                        <p className="mt-3 text-[14px] text-[#86868b]">
                            We've sent a 6-digit code to <span className="font-semibold text-[#1d1d1f]">{email}</span>
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleVerify}>
                        {error && (
                            <div className="bg-[#fff2f2] text-[#ff3b30] text-center p-3 rounded-xl text-[13px] font-medium border border-[#ff3b30]/10">
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
                                    className="w-full aspect-square text-center text-xl font-semibold text-[#1d1d1f] border border-transparent bg-[#f5f5f7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all"
                                />
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-[13px] text-[#86868b]">
                                Didn't receive the code?{" "}
                                <Link
                                    to="/forgot-password"
                                    className={`text-[#0071e3] font-medium hover:underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
                                >
                                    Resend
                                </Link>
                            </p>
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
        </div>
    );
};

export default VerifyOTP;