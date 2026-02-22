import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../services/auth.api";

const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ email, otp, password }: { email: string; otp: string; password: string }) => resetPassword(email, otp, password),
    });
};

export default useResetPassword;