import express from "express";
import { pool } from "../lib/db.js";

const router = express.Router();

// Get single product details
router.get("/:productId", async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT 
        p.*, 
        u.username,
        u.specialization,
        u.PhoneNumber,
        u.profileImage
       FROM products p
       JOIN users u ON p.artisanId = u.artisanId
       WHERE p.id = ?`,
      [req.params.productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = {
      ...products[0],
      images: [
        products[0].image1,
        products[0].image2,
        products[0].image3,
        products[0].image4,
        products[0].image5,
      ].filter(img => img !== null),
      profileImageUrl: products[0].profileImage || null
    };

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get related products with all image fields
router.get("/:productId/related", async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT 
        id,
        artisanId,
        productName,
        productPrice,
        image1,
        image2,
        image3,
        image4,
        image5
       FROM products
       WHERE artisanId = (
         SELECT artisanId FROM products WHERE id = ?
       )
       AND id != ?
       AND is_listed = TRUE
       LIMIT 4`,
      [req.params.productId, req.params.productId]
    );

    const processedProducts = products.map(product => ({
      id: product.id,
      artisanId: product.artisanId,
      productName: product.productName,
      productPrice: product.productPrice,
      images: [
        product.image1,
        product.image2,
        product.image3,
        product.image4,
        product.image5,
      ].filter(img => img !== null),
      primaryImage: product.image1 || null
    }));

    res.json(processedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;