const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "89898989", // Your MySQL password
  database: "jeyy", // The database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to the MySQL database!");
});

// API Route: Add an Employee
app.post("/addEmployee", (req, res) => {
  const {
    employee_id,
    name,
    email,
    phone_number,
    department,
    date_of_joining,
    role,
  } = req.body;

  // Validate input
  if (
    !employee_id ||
    !name ||
    !email ||
    !phone_number ||
    !department ||
    !date_of_joining ||
    !role
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    INSERT INTO employee
    (employee_id, name, email, phone_number, department, date_of_joining, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [employee_id, name, email, phone_number, department, date_of_joining, role],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err.message);
        return res.status(500).json({ message: `Database error: ${err.message}` }); // Corrected template literal
      }
      return res.status(200).json({ message: "Employee added successfully!" });
    }
  );
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
