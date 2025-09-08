import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    course: { type: String, required: true },
    batch: { type: String, required: true },
  },
  { collection: "blu_users" }
);

export const User = mongoose.model("User", userSchema);
