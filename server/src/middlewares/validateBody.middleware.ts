import { Context, MiddlewareHandler } from "hono";
import { ZodSchema } from "zod";

const validateBody = (schema: ZodSchema): MiddlewareHandler => {
    return async (c: Context, next) => {
        const text = await c.req.text();
        let body;
        try {
            body = JSON.parse(text);
        } catch (error) {
            return c.json({ error: "Invalid JSON body" }, 400);
        }
        const result = schema.safeParse(body);
        if (!result.success) {
            return c.json(
                {
                    error: "Invalid request body",
                    issues: result.error.issues,
                },
                400
            );
        }
        c.set("validatedBody", result.data);
        await next();
    };
};

export default validateBody;