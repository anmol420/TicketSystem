import { Hono } from "hono";

import ticketController from "../controllers/ticket.controller";

import authMiddleware from "../middlewares/auth.middleware";
import validateBody from "../middlewares/validateBody.middleware";

import ticketSchema from "../utils/zodSchema/ticket.schema";

const ticketRoutes = new Hono();

ticketRoutes.post(
    "/createTicket",
    authMiddleware,
    validateBody(ticketSchema.createTicketSchema()),
    ticketController.createTicket
);
ticketRoutes.get("/getTickets", authMiddleware, ticketController.getTickets);
ticketRoutes.get(
    "/getTicket",
    authMiddleware,
    validateBody(ticketSchema.getTicketSchema()),
    ticketController.getTicket
);

export default ticketRoutes;