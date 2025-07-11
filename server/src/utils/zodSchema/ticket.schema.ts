import { z, ZodObject } from "zod";

interface ICreateTicket extends z.ZodRawShape {
    title: z.ZodString;
    description: z.ZodString;
}

interface IGetTicket extends z.ZodRawShape {
    ticketId: z.ZodString;
}

class TicketSchema {
    createTicketSchema(): ZodObject<ICreateTicket> {
        return z.object({
            title: z.string().min(2).max(100),
            description: z.string().min(5).max(500),
        });
    }
    getTicketSchema(): ZodObject<IGetTicket> {
        return z.object({
            ticketId: z.string().min(1, "Ticket ID is required"),
        });
    }
}

export default new TicketSchema();