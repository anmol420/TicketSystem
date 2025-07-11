import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "inngest/hono";

import inngest from "./inngest/client";
import { onSignUp } from "./inngest/functions/onSignUp";
import { onTicketCreate } from "./inngest/functions/onTicketCreate";

const app = new Hono();

app.use(cors({
    credentials: true,
    origin: Bun.env.APP_URL as string,
}));

app.get('/', (c) => {
    return c.text('Hello Hono!')
});

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [onSignUp, onTicketCreate],
    })
);

import userRoutes from "./routes/user.routes";
import ticketRoutes from "./routes/ticket.routes";

app.route('/api/v1/users', userRoutes);
app.route('/api/v1/tickets', ticketRoutes);

export default app;