import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    role: string;
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "moderator", "admin"],
    },
    skills: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    }
});

export default mongoose.model<IUser>("User", userSchema);