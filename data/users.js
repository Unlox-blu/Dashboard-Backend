import { v4 as uuidv4 } from 'uuid';

export let people = [
  { id: uuidv4(), name: "John Doe", email: "john@example.com", phone: "9876543210", dob: "1995-06-12" },
  { id: uuidv4(), name: "Jane Smith", email: "jane@example.com", phone: "9123456780", dob: "1990-03-22" },
  { id: uuidv4(), name: "Alex Johnson", email: "alex@example.com", phone: "9988776655", dob: "2000-12-05" },
  { id: uuidv4(), name: "Emily Brown", email: "emily@example.com", phone: "8899776655", dob: "1998-08-19" },
  { id: uuidv4(), name: "Michael Green", email: "michael@example.com", phone: "7766554433", dob: "1985-01-30" }
];

