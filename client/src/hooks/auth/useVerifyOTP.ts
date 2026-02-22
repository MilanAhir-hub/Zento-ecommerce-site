import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../../services/auth.api";

const useVerifyOTP = () => {
    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) => verifyOtp(email, otp),
    });
};

export default useVerifyOTP;