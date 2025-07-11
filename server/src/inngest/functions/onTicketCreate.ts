import { NonRetriableError } from "inngest";
import mongoose from "mongoose";

import ticketModel from "../../models/ticket.model";
import inngest from "../client";
import sendMail from "../../libs/nodemailer.libs";
import analyzeTicket from "../../libs/aiAgent.libs";
import userModel from "../../models/user.model";


export const onTicketCreate = inngest.createFunction(
    { id: "on-ticket-created", retries: 2 },
    { event: "ticket/created" },
    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;
            // pipeline 1
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await ticketModel.findById(ticketId);
                if (!ticketObject) {
                    throw new NonRetriableError(
                        `Ticket with ID ${ticketId} not found`,
                    );
                }
                return ticketObject;
            }) as { _id: mongoose.ObjectId; title: string; description: string };
            // pipeline 2
            await step.run("update-ticket-status", async () => {
                await ticketModel.findByIdAndUpdate(ticketId, {
                    status: "TODO",
                })
            });
            const aiResponse = await analyzeTicket(ticket);
            // pipeline 3
            const relatedSkills = await step.run("ai-processing", async () => {
                let skills = [];
                if (aiResponse) {
                    await ticketModel.findByIdAndUpdate(ticket._id, {
                        priority: !["LOW", "MEDIUM", "HIGH"].includes(aiResponse.priority) ? "MEDIUM" : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: "IN_PROGRESS",
                        relatedSkills: aiResponse.relatedSkills,
                    });
                    skills = aiResponse.relatedSkills;
                }
                return skills;
            }) as string[];
            // pipeline 4
            const moderator = await step.run("assign-moderator", async () => {
                let user = await userModel.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i",
                        }
                    }
                });
                if (!user) {
                    user = await userModel.findOne({
                        role: "admin",
                    });
                }
                await ticketModel.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null,
                });
                return user;
            }) as { _id: mongoose.ObjectId; email: string };
            // pipeline 5
            await step.run("send-notification", async () => {
                if (moderator && moderator.email) {
                    await sendMail(
                        moderator.email,
                        "New Ticket Assigned",
                        `You have been assigned a new ticket: ${ticket.title}`
                    );
                }
            });
            return { success: true };
        } catch (error: any) {
            console.error("Error processing ticket creation:", error.message);
            return { success: false };
        }
    },
);
