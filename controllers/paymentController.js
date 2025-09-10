import { User } from "../models/employee.js";
import { Payment } from "../models/paymentSchema.js";

// GET all Payments
export const getPeople = async (req, res) => {
  try {
    const people = await Payment.find();
    res.json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Payment by ID
export const getPersonById = async (req, res) => {
  try {
    const person = await Payment.findById(req.params.id);
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// CREATE a new Payment
export const createPerson = async (req, res) => {
  try {
    const person = new Payment(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Payment
export const updatePerson = async (req, res) => {
  try {
    const person = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE Payment
export const deletePerson = async (req, res) => {
  try {
    const person = await Payment.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all payments for logged-in employee's counselor_id
export const getPaymentsByCounselor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.counselor_id) {
      return res.status(400).json({ message: "Counselor ID not found for this user" });
    }

    const payments = await Payment.find({ counselor_id: user.counselor_id }).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


