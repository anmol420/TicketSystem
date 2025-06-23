import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({
    credentials: true,
    origin: Bun.env.APP_URL as string,
}));

app.get('/', (c) => {
    return c.text('Hello Hono!')
});

import userRoutes from "./routes/user.routes";

app.route('/api/v1/users', userRoutes);

export default app;