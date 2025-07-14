import express from "express";
import { pool } from "../lib/db.js";

const router = express.Router();

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const [feedbacks] = await pool.query(`
      SELECT 
        f.*,
        CASE 
          WHEN f.artisanId IS NOT NULL THEN u.username 
          ELSE f.artisanName 
        END as artisanName,
        f.created_at
      FROM feedback f
      LEFT JOIN users u ON f.artisanId = u.artisanId
      ORDER BY f.created_at DESC
    `);
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// Get feedback by artisanId
router.get("/:artisanId", async (req, res) => {
  try {
    const [feedbacks] = await pool.query(
      `
      SELECT 
        f.*,
        CASE 
          WHEN f.artisanId IS NOT NULL THEN u.username 
          ELSE f.artisanName 
        END as artisanName,
        f.created_at
      FROM feedback f
      LEFT JOIN users u ON f.artisanId = u.artisanId
      WHERE f.artisanId = ? 
      ORDER BY f.created_at DESC
    `,
      [req.params.artisanId]
    );
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// Submit new feedback
router.post("/", async (req, res) => {
  const { name, phonenumber, artisanName, feedback } = req.body;
  if (!name || !feedback) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await pool.query(
      "INSERT INTO feedback (name, phonenumber, artisanName, message) VALUES (?, ?, ?, ?)",
      [name, phonenumber, artisanName || null, feedback]
    );
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

export default router;
