import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        status: { type: String, enum: ["resolved", "pending"], required: true },
        email: { type: String, required: true },
        report: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    },
    { collection: "reports" }
);

export const Report = mongoose.model("Report", reportSchema);