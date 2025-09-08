const mongoose = require("mongoose");

const crypto = require("crypto");

// Generate secure 7-character alphanumeric UID



const employeePhoneNumberSchema = new mongoose.Schema(
  {
    org_phone_number: { type: String, required: true }, // array 
    owner_employee_id: { type: String },
    number_status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String },
    recharge_history: [
      {
        amount: { type: Number },  
        date: { type: Date, default: Date.now },
      }
    ],
    number_cost: { type: Number }, // cost of the number

  },
  { timestamps: true }
);

export const EmployeePhoneNumberSchema = mongoose.model("EmployeePhoneNumber", employeePhoneNumberSchema);
