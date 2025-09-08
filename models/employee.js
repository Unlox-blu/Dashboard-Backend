import mongoose from "mongoose";

import crypto from "crypto";

// Generate secure 7-character alphanumeric UID

function generateShortUUID() {
  const length = 7;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);
  let uid = "";
  for (let i = 0; i < length; i++) {
    uid += chars[bytes[i] % chars.length];
  }
  return uid;
}

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    UUID: {
      type: String,
      default: generateShortUUID,
      unique: true,
    },
    org_phone_number: { type: String, required: true }, // array of phone numbers // number recharge // recharge history
    personal_phone_number: { type: String, required: true },
    org_email: { type: String, required: true, unique: true },
    personal_email: { type: String, unique: true },
    password: { type: String, required: true },
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    deleteOTP: { type: String },
    deleteOTPExpires: { type: Date },
    waiting: { type: Boolean },
    refreshTokenHash: { type: String },
    my_phone_number: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "EmployeePhoneNumber",
      },
    ],
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
  },
  { timestamps: true }
);

export const User = mongoose.model("Employee", employeeSchema);
