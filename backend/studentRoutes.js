const express = require("express");
const router = express.Router();
const pool = require("./db");
const multer = require("multer");
const path = require("path");
const csv = require("csv-parse");
const fs = require("fs");

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// 1. Add a new student
router.post("/", async (req, res) => {
  const { name, grade, dob, vaccinated, vaccine_name, drive_name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (name, grade, dob, vaccinated, vaccine_name, drive_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [name, grade, dob, vaccinated, vaccine_name, drive_name]
    );
    res.status(201).json({ studentId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add student" });
  }
});

// 2. Update student details
router.put("/:id", async (req, res) => {
  const { name, grade, dob, vaccinated, vaccine_name, drive_name } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE students SET name = $1, grade = $2, dob = $3, vaccinated = $4, vaccine_name = $5, drive_name = $6 WHERE id = $7",
      [name, grade, dob, vaccinated, vaccine_name, drive_name, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update student" });
  }
});

// 3. Mark student as vaccinated
router.post("/:id/vaccination", async (req, res) => {
  const { vaccine_name, vaccination_date, drive_name } = req.body;
  const { id } = req.params;
  try {
    // Ensure a student cannot be vaccinated twice with the same vaccine
    const checkVaccination = await pool.query(
      "SELECT * FROM vaccination_records WHERE student_id = $1 AND vaccine_name = $2",
      [id, vaccine_name]
    );
    
    if (checkVaccination.rowCount > 0) {
      return res.status(400).json({ error: "Student already vaccinated with this vaccine" });
    }

    // Insert vaccination record
    const result = await pool.query(
      "INSERT INTO vaccination_records (student_id, vaccine_name, drive_name) VALUES ($1, $2, $3, $4)",
      [id, vaccine_name, drive_name, drive_name]
    );

    res.status(201).json({ message: "Vaccination status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update vaccination status" });
  }
});

// 4. Fetch student details by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const studentResult = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    const vaccinationResult = await pool.query("SELECT * FROM vaccination_records WHERE student_id = $1", [id]);

    if (studentResult.rowCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      student: studentResult.rows[0],
      vaccinations: vaccinationResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});

// 5. Bulk Import Students via CSV
router.post("/bulk-upload", upload.single("file"), (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.file.filename);
  const results = [];
  const parser = csv.parse({ columns: true, delimiter: "," }, async (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to parse CSV" });
    }

    // Insert each student record into the database
    for (let row of data) {
      const { name, grade, dob, vaccinated, vaccine_name, drive_name } = row;
      try {
        await pool.query(
          "INSERT INTO students (name, grade, dob, vaccinated, vaccine_name, drive_name) VALUES ($1, $2, $3, $4, $5, $6)",
          [name, grade, dob, vaccinated, vaccine_name, drive_name]
        );
      } catch (err) {
        console.error(err);
      }
    }

    res.status(200).json({ message: "Bulk import successful" });
  });

  fs.createReadStream(filePath).pipe(parser);
});

// 6. Fetch students with search functionality
router.get("/", async (req, res) => {
  const searchTerm = req.query.search || "";
  try {
    // Fetch students with optional search parameters (name, grade, ID, vaccination status)
    const result = await pool.query(
      `SELECT s.id, s.name, (s.dob)::date as dob, s.grade, 
      CASE WHEN S.VACCINATED THEN 'Vaccinated' ELSE 'Not Vaccinated' END AS vaccination_status
      FROM students s
      LEFT JOIN vaccination_records v ON s.id = v.student_id
      WHERE s.name ILIKE $1 OR s.grade ILIKE $1 OR s.id::TEXT LIKE $1
      ORDER BY s.name`,
      [`%${searchTerm}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

module.exports = router;
