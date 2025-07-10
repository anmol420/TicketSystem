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
            }) as { _id: any; [key: string]: any };
            await inngest.send({
                name: "ticket/created",
                data: {
                    ticketId: newTicket._id.toString(),
                },
            });
            return c.json(new ApiResponse(201, true, newTicket, "Ticket created successfully"));
        } catch (error) {
            return c.json({ error: "Failed to create ticket" }, 500);
        }
    }
}

export default new TicketController();
