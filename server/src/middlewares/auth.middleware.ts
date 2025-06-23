import { Context, MiddlewareHandler } from "hono";

import { verify } from "jsonwebtoken";
import usedTokenModel from "../models/usedToken.model";
import userModel from "../models/user.model";

const authMiddleware = async (c: Context, next: MiddlewareHandler) => {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return c.json({ error: "Authorization header is missing" }, 401);
    }
    const isTokenUsed = await usedTokenModel.findOne({
        token,
    });
    if (isTokenUsed) {
        return c.json({ error: "Token has already been used" }, 401);
    }
    const decoded = verify(token, Bun.env.JWT_SECRET as string);
    if (!decoded) {
        return c.json({ error: "Invalid token" }, 401);
    }
    const user = await userModel.findById((decoded as any)._id);
    if (!user) {
        return c.json({ error: "User not found" }, 404);
    }
    try {
        c.set("user", user);
        c.set("token", token);
        return next;
    } catch (error: any) {
        console.error("Authentication error:", error.message);
        return c.json({ error: "Invalid token" }, 401);
    }
};

export default authMiddleware;