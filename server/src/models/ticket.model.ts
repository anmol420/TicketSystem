import * as mongoose from "mongoose";

export interface ITicket extends mongoose.Document {
    title: string;
    description: string;
    status: string;
    createdBy: mongoose.Schema.Types.ObjectId;
    assignedTo?: mongoose.Schema.Types.ObjectId;
    priority?: string;
    deadline?: Date;
    helpfulNotes?: string;
    relatedSkills?: string[];
    createdAt: Date;
}

const ticketSchema = new mongoose.Schema<ITicket>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["TODO", "IN_PROGESS", "CLOSED"],
        default: "TODO",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    priority: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    helpfulNotes: {
        type: String,
    },
    relatedSkills: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ITicket>("Ticket", ticketSchema);