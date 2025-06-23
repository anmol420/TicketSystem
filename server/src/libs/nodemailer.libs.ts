import * as nodemailer from "nodemailer";

import SMTPTransport = require("nodemailer/lib/smtp-transport");

const transporter = nodemailer.createTransport({
    host: Bun.env.MAILTRAP_SMTP_HOST,
    port: Number(Bun.env.MAILTRAP_SMTP_PORT),
    auth: {
        user: Bun.env.MAILTRAP_SMTP_USER,
        pass: Bun.env.MAILTRAP_SMTP_PASSWORD,
    },
} as SMTPTransport.Options);

const sendMail = async (to: string, subject: string, text: string) => {
    try {
        const info = await transporter.sendMail({
            to,
            from: "Inngest",
            subject,
            text,
        });
        return info;
    } catch (error: any) {
        console.error("Mail Error: ", error.message);
        throw new Error("Failed to send email");
    }
};

export default sendMail;