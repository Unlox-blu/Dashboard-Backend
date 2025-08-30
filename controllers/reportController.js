import {reports} from "../data/reports.js"

// Get all reports
export const getReports = (req, res) => {
  res.json(reports)
}

// Get single report
export const getReportById = (req, res) => {
  const report = reports.find(r => r.id === req.params.id)
  if (!report) return res.status(404).json({ message: "Report not found" })
  res.json(report)
}

// Create report
export const createReport = (req, res) => {
  const newReport = { id: `r${Date.now()}`, ...req.body }
  reports.push(newReport)
  res.status(201).json(newReport)
}

// Update report
export const updateReport = (req, res) => {
  const index = reports.findIndex(r => r.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: "Report not found" })
  reports[index] = { ...reports[index], ...req.body }
  res.json(reports[index])
}

// Delete report
export const deleteReport = (req, res) => {
  const index = reports.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Report not found" });

  const deleted = reports.splice(index, 1);
  res.json(deleted[0]);
};

