import { User } from "../models/userSchema.js";

export const getPeople = async (req, res) => {
  try {
    const people = await User.find();
    res.json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user by ID
export const getPersonById = async (req, res) => {
  try {
    const person = await User.findById(req.params.id);
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// CREATE a new user
export const createPerson = async (req, res) => {
  try {
    const person = new User(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE user
export const updatePerson = async (req, res) => {
  try {
    const person = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE user
export const deletePerson = async (req, res) => {
  try {
    const person = await User.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
