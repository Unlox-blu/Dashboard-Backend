import { Report } from "../models/reportSchema.js";

// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single report
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ id: req.params.id });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create report
export const createReport = async (req, res) => {
  try {
    const { name, status, email, report } = req.body;
    const newReport = new Report({
      id: `r${Date.now()}`,
      name,
      status,
      email,
      report
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update report
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ id: req.params.id });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
