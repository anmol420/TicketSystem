import { Context } from "hono";

import inngest from "../inngest/client";
import ApiResponse from "../utils/apiResponse";
import ticketModel from "../models/ticket.model";

class TicketController {
    async createTicket(c: Context) {
        const { title, description } = c.get("validatedBody");
        if (!title || !description) {
            return c.json({ error: "Title and description are required" }, 400);
        }
        const user = c.get("user");
        if (!user) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        try {
            const newTicket = await ticketModel.create({
                title,
                description,
                createdBy: user._id,
            }) as { _id: any;[key: string]: any };
            await inngest.send({
                name: "ticket/created",
                data: {
                    ticketId: newTicket._id.toString(),
                },
            });
            return c.json(new ApiResponse(201, true, newTicket, "Ticket created successfully"));
        } catch (error: any) {
            return c.json({ error: "Failed to create ticket" }, 500);
        }
    }
    async getTickets(c: Context) {
        const user = c.get("user");
        if (!user) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        try {
            if (!user.roles.includes("admin") || !user.roles.includes("moderator")) {
                const tickets = await ticketModel.find({}).sort({ createdAt: -1 });
                return c.json(new ApiResponse(200, true, tickets, "Tickets retrieved successfully"));
            }
            const tickets = await ticketModel.find({ createdBy: user._id }).sort({ createdAt: -1 });
            return c.json(new ApiResponse(200, true, tickets, "Tickets retrieved successfully"));
        } catch (error: any) {
            return c.json({ error: "Failed to retrieve tickets" }, 500);
        }
    }
    async getTicket(c: Context) {
        const { ticketId } = c.get("validatedBody");
        if (!ticketId) {
            return c.json({ error: "Ticket ID is required" }, 400);
        }
        const user = c.get("user");
        if (!user) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        try {
            let ticket;
            if (user.roles.includes("admin") || user.roles.includes("moderator")) {
                ticket = await ticketModel.findById(ticketId).populate("createdBy").populate("assignedTo");
            } else {
                ticket = await ticketModel.findOne({ _id: ticketId, createdBy: user._id }).populate("createdBy").populate("assignedTo");
            }
            if (!ticket) {
                return c.json({ error: "Ticket not found" }, 404);
            }
            return c.json(new ApiResponse(200, true, ticket, "Ticket retrieved successfully"));
        } catch (error: any) {
            return c.json({ error: "Failed to retrieve ticket" }, 500);
        }
    }
}

export default new TicketController();
