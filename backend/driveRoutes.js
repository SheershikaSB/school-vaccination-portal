// driveRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

// 1. Create a new vaccination drive
router.post("/", async (req, res) => {
  const { drive_name, vaccine_name, drive_date, available_doses, applicable_grades } = req.body;
  
  try {
    // Prevent scheduling of past dates or less than 15 days in advance
    const driveDate = new Date(drive_date);
    const today = new Date();
    const minimumDate = new Date();
    minimumDate.setDate(today.getDate() + 15);

    if (driveDate < minimumDate) {
      return res.status(400).json({ error: "Drive date must be at least 15 days in the future." });
    }

    // Insert new drive
    const result = await pool.query(
      `INSERT INTO vaccination_drives (drive_name, vaccine_name, drive_date, available_doses, applicable_grades)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [drive_name, vaccine_name, drive_date, available_doses, applicable_grades]
    );
    
    res.status(201).json({ driveId: result.rows[0].id, message: "Vaccination drive created successfully" });
  } catch (err) {
    if (err.code === '23505') { // Unique violation (date and grade overlap)
      return res.status(400).json({ error: "A drive for the same vaccine is already scheduled on this date for the same grades." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create vaccination drive" });
  }
});

// 2. Get all vaccination drives
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vaccination_drives ORDER BY drive_date ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vaccination drives" });
  }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query("SELECT * FROM vaccination_drives WHERE id = $1 ORDER BY drive_date ASC", [id]);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch vaccination drives" });
    }
});

// 3. Update a vaccination drive (before the drive date)
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { drive_name, vaccine_name, drive_date, available_doses, applicable_grades } = req.body;
    
    try {
      // Check if the drive is in the past
      const existingDrive = await pool.query("SELECT drive_date FROM vaccination_drives WHERE id = $1", [id]);
      if (existingDrive.rows.length === 0) {
        return res.status(404).json({ error: "Drive not found" });
      }
  
      const existingDate = new Date(existingDrive.rows[0].drive_date);
      const today = new Date();
      if (existingDate < today) {
        return res.status(400).json({ error: "Cannot edit past drives" });
      }
  
      // Update the drive
      await pool.query(
        `UPDATE vaccination_drives 
         SET drive_name = $1, vaccine_name = $2, drive_date = $3, available_doses = $4, applicable_grades = $5, updated_at = NOW()
         WHERE id = $6`,
        [drive_name, vaccine_name, drive_date, available_doses, applicable_grades, id]
      );
      
      res.status(200).json({ message: "Drive updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update drive" });
    }
  });

module.exports = router;
