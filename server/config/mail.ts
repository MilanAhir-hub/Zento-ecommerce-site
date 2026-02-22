import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
    port: 465, // Hardcoded to 465 to enforce SSL and bypass Render's outbound 587 blocking
    secure: true, // MUST be true for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true, // Log information to console
    debug: true, // Include SMTP traffic in the logs
    connectionTimeout: 10000,
});

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
) => {
    try {
        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error);
        throw new Error("Could not send email. Please try again later.");
    }
};