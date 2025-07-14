import express from "express";
import { pool } from "../lib/db.js";

const router = express.Router();

// Get all artisans (public route)
router.get("/artisans", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username as name, artisanId, PhoneNumber as contact, specialization FROM users WHERE artisanId IS NOT NULL"
    );
    
    // Format the data to match the frontend expectations
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      specialization: user.specialization || 'Not specified',
      contact: user.contact,
      artisanId: user.artisanId,
      password: user.password // Include actual password
    }));

    res.json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error("Error fetching artisans:", error);
    res.status(500).json({ success: false, message: "Failed to fetch artisans" });
  }
});

// Delete artisan
router.delete("/artisans/:artisanId", async (req, res) => {
  try {
    const { artisanId } = req.params;
    await pool.query("DELETE FROM users WHERE artisanId = ?", [artisanId]);
    res.json({ success: true, message: "Artisan deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete artisan" });
  }
});

// Update artisan
router.put("/artisans/:artisanId", async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { name, contact, specialization, password } = req.body;
    
    await pool.query(
      `UPDATE users SET 
        username = ?,
        PhoneNumber = ?,
        specialization = ?,
        password = ?
       WHERE artisanId = ?`,
      [name, contact, specialization, password, artisanId]
    );

    res.json({ success: true, message: "Artisan updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Failed to update artisan" });
  }
});

export default router;
