// dashboard.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

// Get dashboard data (total students, vaccinated students, upcoming drives)
router.get("/overview", async (req, res) => {
  try {
    // Total Students
    const totalStudentsResult = await pool.query("SELECT COUNT(*) AS total_students FROM students");
    const totalStudents = totalStudentsResult.rows[0].total_students;

    // Total Vaccinated Students
    const vaccinatedStudentsResult = await pool.query(
      "SELECT COUNT(*) AS vaccinated_students FROM students WHERE vaccinated = true"
    );
    const vaccinatedStudents = vaccinatedStudentsResult.rows[0].vaccinated_students;

    // Upcoming Vaccination Drives (within the next 30 days)
    const upcomingDrivesResult = await pool.query(
      "SELECT * FROM vaccination_drives WHERE drive_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'"
    );
    const upcomingDrives = upcomingDrivesResult.rows;

    // Calculate percentage of vaccinated students
    const vaccinationPercentage = ((vaccinatedStudents / totalStudents) * 100).toFixed(2);

    res.json({
      totalStudents,
      vaccinatedStudents,
      vaccinationPercentage,
      upcomingDrives,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
