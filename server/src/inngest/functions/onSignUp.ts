import { NonRetriableError } from "inngest";

import userModel from "../../models/user.model";
import inngest from "../client";
import sendMail from "../../libs/nodemailer.libs";

export const onSignUp = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({event, step}) => {
        try {
            const { email } = event.data;
            // pipeline 1
            const user = await step.run("get-user-email", async () => {
                const userObject = await userModel.findOne({ email });
                if (!userObject) {
                    throw new NonRetriableError(
                        `User with email ${email} not found`,
                    );
                }
                return userObject;
            }) as { email: string };
            // pipeline 2
            await step.run("send-welcome-email", async () => {
                const subject = "Welcome to Our Service!";
                const text = `Hello,\n\nThank you for signing up! We're excited to have you on board.\n\nBest regards,\nThe Team`;
                await sendMail(user.email, subject, text);
            });
            return { success: true };
        } catch (error: any) {
            console.error("Error in onSignUp function:", error.message);
            return { success: false };
        }
    },
);