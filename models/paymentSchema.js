import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true },
    course_name: { type: String, required: true },
    course_type: { type: String, required: true },   // edge, etc.
    pay_option: { type: String, required: true },    // pre / full
    batch: { type: String, required: true },
    counselor_id: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    address: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },
    amount: { type: Number, required: true },
    order_id: { type: String, required: true },
    payment_id: { type: String, required: true },
    receipt: { type: String },
    payment_status: { type: String, required: true }, // success, failed, pending
    timestamp: { type: String, required: true }
  },
  { collection: "web_payments" }
);

export const Payment = mongoose.model("Payment", paymentSchema);
