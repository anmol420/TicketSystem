import * as mongoose from "mongoose";

export interface IUsedToken {
    userId: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
}

const usedTokenSchema = new mongoose.Schema<IUsedToken>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "10d",
    },
});

export default mongoose.model<IUsedToken>("UsedToken", usedTokenSchema);