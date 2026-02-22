import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const data = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to,
            subject,
            text,
            html,
        });

        console.log(`Email sent successfully to ${to}`, data);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw new Error("Could not send email. Please try again later.");
    }
};
