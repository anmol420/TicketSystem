import { z, ZodObject } from "zod";

interface ISignUp extends z.ZodRawShape {
    email: z.ZodString;
    password: z.ZodString;
    skills: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
}

interface ILogin extends z.ZodRawShape {
    email: z.ZodString;
    password: z.ZodString;
}

interface IUpdateUser extends z.ZodRawShape {
    email: z.ZodString;
    role: z.ZodString;
    skills: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
}

class UserSchema {
    public signUp(): ZodObject<ISignUp> {
        return z.object({
            email: z.string().email("Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters long"),
            skills: z.array(z.string()).default([]).optional(),
        });
    }
    public login(): ZodObject<ILogin> {
        return z.object({
            email: z.string().email("Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters long"),
        });
    }
    public updateUser(): ZodObject<IUpdateUser> {
        return z.object({
            email: z.string().email("Invalid email address"),
            role: z.string().min(1, "Role is required"),
            skills: z.array(z.string()).default([]).optional(),
        });
    }
}

export default new UserSchema();