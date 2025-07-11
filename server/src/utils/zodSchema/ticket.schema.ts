import { z, ZodObject } from "zod";

interface ICreateTicket extends z.ZodRawShape {
    title: z.ZodString;
    description: z.ZodString;
}

class TicketSchema {
    createTicketSchema(): ZodObject<ICreateTicket> {
        return z.object({
            title: z.string().min(2).max(100),
            description: z.string().min(5).max(500),
        });
    }
}

export default new TicketSchema();