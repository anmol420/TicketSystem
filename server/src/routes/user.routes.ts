import { Hono } from "hono";

import userController from "../controllers/user.controller";

import authMiddleware from "../middlewares/auth.middleware";
import validateBody from "../middlewares/validateBody.middleware";

import userSchema from "../utils/zodSchema/user.schema";

const userRoutes = new Hono();

userRoutes.post("/signup", validateBody(userSchema.signUp()), userController.signUp);
userRoutes.post("/login", validateBody(userSchema.login()), userController.login);

userRoutes.post("/logout", authMiddleware, userController.logout);
userRoutes.post("/updateUser", authMiddleware, validateBody(userSchema.updateUser()), userController.updateUser);
userRoutes.get("/getUsers", authMiddleware, userController.getUsers);

export default userRoutes;