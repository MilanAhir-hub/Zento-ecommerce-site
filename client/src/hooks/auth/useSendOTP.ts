import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "../../services/auth.api";

const useSendOTP = () => {
    return useMutation({
        mutationFn: (email: string) => sendOtp(email),
    });
};

export default useSendOTP;