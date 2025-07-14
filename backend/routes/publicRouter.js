import express from "express";
import { pool } from "../lib/db.js";
import { verifyToken } from "./authRouter.js";

const router = express.Router();

// Get all listed artisans
router.get("/artisans", async (req, res) => {
  try {
    const [artisans] = await pool.query(`
      SELECT u.username, u.artisanId, u.profileImage
      FROM users u
      WHERE u.listed = true
      ORDER BY 
        SUBSTRING_INDEX(u.username, ' ', 1) ASC,
        u.username ASC
    `);
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add proper artisan products route
router.get("/artisans/:artisanId/products", async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT * FROM products 
       WHERE artisanId = ? AND is_listed = true`,
      [req.params.artisanId]
    );

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get artisan by ID
router.get("/artisans/:artisanId", async (req, res) => {
  try {
    const [artisans] = await pool.query(
      "SELECT * FROM users WHERE artisanId = ?",
      [req.params.artisanId]
    );

    if (artisans.length === 0)
      return res.status(404).json({ message: "Artisan not found" });

    res.json({
      ...artisans[0],
      profileImageUrl: artisans[0].profileImage || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    // First, get artisanId to verify ownership if needed
    const [product] = await pool.query(
      "SELECT artisanId FROM products WHERE id = ?",
      [req.params.productId]
    );

    // Optional: Add admin check or ownership verification here

    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      req.params.productId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
