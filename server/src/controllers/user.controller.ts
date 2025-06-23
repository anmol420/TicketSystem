import { Context } from "hono";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

import userModel from "../models/user.model";
import usedTokenModel from "../models/usedToken.model";
import inngest from "../inngest/client";
import ApiResponse from "../utils/apiResponse";

class UserController {
    async signUp(c: Context) {
        const { email, password, skills = [] } = c.get("validatedBody");
        if (!email || !password) {
            return c.json({ error: "Email and password are required" }, 400);
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return c.json({ error: "User already exists" }, 400);
        }
        try {
            const hashedPassword = await hash(password, 10);
            const newUser = await userModel.create({
                email,
                password: hashedPassword,
                skills,
            });
            await inngest.send({
                name: "user/signup",
                data: {
                    email: newUser.email,
                }
            });
            const token = sign(
                { _id: newUser._id, role: newUser.role },
                Bun.env.JWT_SECRET as string,
                { expiresIn: "7d" },
            );
            return c.json(
                new ApiResponse(201, true, { token: token }, "User created successfully"),
                201
            );
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    };
    async login(c: Context) {
        const { email, password } = c.get("validatedBody");
        if (!email || !password) {
            return c.json({ error: "Email and password are required" }, 400);
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return c.json({ error: "Invalid password" }, 401);
        }
        try {
            const token = sign(
                { _id: user._id, role: user.role },
                Bun.env.JWT_SECRET as string,
                { expiresIn: "7d" },
            );
            return c.json(
                new ApiResponse(200, true, { token: token }, "Login successful"),
                200
            );
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    };
    async logout(c: Context) {
        const user = c.get("user");
        const token = c.get("token");
        if (!token) {
            return c.json({ error: "Token is required" }, 400);
        }
        if (!user) {
            return c.json({ error: "User not authenticated" }, 401);
        }
        try {
            await usedTokenModel.create({
                userId: user._id,
                token: token,
            });
            return c.json(
                new ApiResponse(200, true, {}, "Logout successful"),
                200
            );
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }
    async updateUser(c: Context) {
        const { email, role, skills } = c.get("validatedBody");
        const user = c.get("user");
        if (!user) {
            return c.json({ error: "User not authenticated" }, 401);
        }
        if (!email || !skills || !role) {
            return c.json({ error: "At least one field is required to update" }, 400);
        }
        if (user.role !== "admin") {
            return c.json({ error: "Only admins can update user roles" }, 403);
        }
        const emailExists = await userModel.findOne({ email });
        if (emailExists) {
            return c.json({ error: "Email already exists" }, 400);
        }
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                user._id,
                { email, skills, role },
                { new: true }
            );
            return c.json(
                new ApiResponse(200, true, updatedUser, "User updated successfully"),
                200
            );
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }
    async getUsers(c: Context) {
        const user = c.get("user");
        if (!user) {
            return c.json({ error: "User not authenticated" }, 401);
        }
        if (user.role !== "admin") {
            return c.json({ error: "Only admins can retrieve users" }, 403);
        }
        try {
            const users = await userModel.find().select("-password");
            return c.json(
                new ApiResponse(200, true, users, "Users retrieved successfully"),
                200
            );
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }
}

export default new UserController();