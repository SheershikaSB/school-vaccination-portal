// reportRoutes.js
const express = require("express");
const pool = require("./db");
const { Parser } = require("json2csv");
const router = express.Router();

// Fetch vaccination records with optional vaccine filter
router.get("/", async (req, res) => {
  const { vaccine_name, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    // Fetch filtered records
    let query = `
      SELECT 
        s.id AS student_id, 
        s.name AS student_name, 
        s.grade AS student_class, 
        s.vaccine_name as vaccine_name, 
        s.vaccination_date, 
        s.vaccinated 
      FROM students s 
    `;
    const params = [];

    if (vaccine_name) {
      query += " WHERE s.vaccine_name = $1";
      params.push(vaccine_name);
    }

    query += ` ORDER BY s.name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    // Get total count for pagination
    const countResult = await pool.query("SELECT COUNT(*) FROM vaccination_records");
    const totalRecords = parseInt(countResult.rows[0].count);

    res.status(200).json({
      data: result.rows,
      totalRecords,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vaccination records" });
  }
});

// Export to CSV
router.get("/export", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id AS student_id, 
        s.name AS student_name, 
        s.grade AS student_class, 
        s.vaccine_name, 
        s.vaccination_date, 
        s.vaccinated 
      FROM students s 
      ORDER BY s.name ASC
    `);

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(result.rows);

    res.header("Content-Type", "text/csv");
    res.attachment("vaccination_report.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

module.exports = router;
