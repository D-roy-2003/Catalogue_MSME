// backend/routes/productRouter.js
import express from "express";
import { connectToDatabase } from "../lib/db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./authRouter.js"; // <-- same middleware
import { supabase } from "../lib/db.js";

const router = express.Router();

// ES module __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to upload a file buffer to Supabase Storage and return the public URL
async function uploadToSupabase(file, fieldName) {
  if (!file) return null;
  const ext = file.originalname.split('.').pop();
  const filePath = `products/${Date.now()}_${Math.round(Math.random() * 1e9)}_${fieldName}.${ext}`;
  const { data, error } = await supabase.storage.from('magrahat').upload(filePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  // Get public URL
  const { data: publicUrlData } = supabase.storage.from('magrahat').getPublicUrl(filePath);
  return publicUrlData.publicUrl;
}

const upload = multer();

// POST /products — one slot at a time, ≤3 per artisan
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
    { name: "image5" },
  ]),
  async (req, res) => {
    try {
      const artisanId = req.artisanId;
      const {
        productName,
        productPrice,
        material,
        height,
        width,
        weight,
        productDescription,
        certification,
        finish,
        category,
      } = req.body;
      if (!productName) {
        return res.status(400).json({ message: "productName is required." });
      }
      const db = await connectToDatabase();

      // Get existing product count
      const [[{ cnt }]] = await db.query(
        "SELECT COUNT(*) AS cnt FROM products WHERE artisanId = ?",
        [artisanId]
      );

      const productId = `${artisanId}${String.fromCharCode(65 + cnt)}`;

      if (cnt >= 3) {
        return res
          .status(400)
          .json({ message: "Maximum of 3 products allowed." });
      }

      // Upload images to Supabase
      const imageFields = ["image1", "image2", "image3", "image4", "image5"];
      const imageUrls = await Promise.all(
        imageFields.map(async (field) => {
          const file = req.files[field]?.[0];
          if (file) {
            return await uploadToSupabase(file, field);
          }
          return null;
        })
      );

      const [result] = await db.query(
        `INSERT INTO products (
           artisanId, productId, productName, productPrice, material,
           height, width, weight, certification, finish,
           image1, image2, image3, image4, image5,
           productDescription, category
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          artisanId,
          productId,
          productName,
          productPrice || null,
          material || null,
          height || null,
          width || null,
          weight || null,
          certification || null,
          finish || null,
          imageUrls[0],
          imageUrls[1],
          imageUrls[2],
          imageUrls[3],
          imageUrls[4],
          productDescription || null,
          category || null,
        ]
      );
      return res
        .status(201)
        .json({ message: "Product created", productId: result.insertId });
    } catch (err) {
      console.error("POST /products error:", err);
      return res.status(500).json({ message: err.message });
    }
  }
);

// UPDATE existing product
router.put(
  "/:productId",
  verifyToken,
  upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
    { name: "image5" },
  ]),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const artisanId = req.artisanId;
      const db = await connectToDatabase();
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Verify product exists and belongs to artisan
      const [[product]] = await db.query(
        "SELECT * FROM products WHERE id = ? AND artisanId = ?",
        [productId, artisanId]
      );
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      // Process updates
      const {
        productName,
        productPrice,
        material,
        height,
        width,
        weight,
        productDescription,
        certification,
        finish,
        category,
      } = req.body;

      // Upload new images if provided, else keep existing
      const imageFields = ["image1", "image2", "image3", "image4", "image5"];
      const imageUrls = await Promise.all(
        imageFields.map(async (field, idx) => {
          const file = req.files[field]?.[0];
          if (file) {
            return await uploadToSupabase(file, field);
          }
          return product[`image${idx + 1}`];
        })
      );

      await db.query(
        `UPDATE products SET 
          productName = ?, productPrice = ?, material = ?,
          height = ?, width = ?, weight = ?, certification = ?, finish = ?,
          image1 = ?, image2 = ?, image3 = ?,
          image4 = ?, image5 = ?, productDescription = ?,
          category = ?
         WHERE id = ?`,
        [
          productName || product.productName,
          productPrice || product.productPrice,
          material || product.material,
          height || product.height,
          width || product.width,
          weight || product.weight,
          certification || product.certification,
          finish || product.finish,
          imageUrls[0],
          imageUrls[1],
          imageUrls[2],
          imageUrls[3],
          imageUrls[4],
          productDescription || product.productDescription,
          category || product.category,
          productId,
        ]
      );

      return res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      console.error("PUT /products error:", err);
      return res.status(500).json({ message: err.message });
    }
  }
);

// DELETE /products/:productId — remove a single row
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const artisanId = req.artisanId;
    const productId = req.params.productId;
    const db = await connectToDatabase();
    await db.query("DELETE FROM products WHERE id = ? AND artisanId = ?", [
      productId,
      artisanId,
    ]);
    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error("DELETE /products/:productId error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// Add after DELETE endpoint
router.post("/unlist-product/:productId", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    await db.query(
      "UPDATE products SET is_listed = FALSE WHERE id = ? AND artisanId = ?",
      [req.params.productId, req.artisanId]
    );

    // Check remaining products
    const [[{ count }]] = await db.query(
      "SELECT COUNT(*) AS count FROM products WHERE artisanId = ? AND is_listed = TRUE",
      [req.artisanId]
    );

    if (count < 3) {
      await db.query("UPDATE users SET listed = FALSE WHERE artisanId = ?", [
        req.artisanId,
      ]);
    }

    res.json({ message: "Product unlisted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /products/:artisanId — list up to 3 products
router.get("/:artisanId", verifyToken, async (req, res) => {
  try {
    // ensure the token's artisanId matches the param
    if (req.params.artisanId !== req.artisanId) {
      return res.status(403).json({ message: "Forbidden." });
    }
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT * FROM products WHERE artisanId = ? ORDER BY id ASC LIMIT 3",
      [req.artisanId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("GET /products/:artisanId error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// Update the list-products endpoint
router.post("/list-products", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();

    // Get count of products
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM products 
       WHERE artisanId = ?`,
      [req.artisanId]
    );

    if (count === 0) {
      return res.status(400).json({
        message: "You must have at least 1 product to list",
      });
    }

    // Update database
    await db.query(
      `
      UPDATE products 
      SET is_listed = TRUE, listed_at = NOW() 
      WHERE artisanId = ?
    `,
      [req.artisanId]
    );

    await db.query(
      `
      UPDATE users 
      SET listed = TRUE 
      WHERE artisanId = ?
    `,
      [req.artisanId]
    );

    res.json({ message: "Products listed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
