import express from "express";
import { pool } from "../lib/db.js";

const router = express.Router();

// Get random featured products
router.get("/featured-products", async (req, res) => {
  try {
    // First, count how many non-dummy products exist
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM products p
      JOIN users u ON p.artisanId = u.artisanId
      WHERE p.is_listed = TRUE AND u.artisanId != 'DEMO001'
    `);
    
    const nonDummyCount = countResult[0].count;
    const minRealProductsRequired = 3;
    const sliderItemsNeeded = 5;
    
    let products = [];
    
    if (nonDummyCount >= minRealProductsRequired) {
      // Get only non-dummy products if we have enough
      [products] = await pool.query(`
        SELECT 
          p.id,
          p.productName,
          p.productPrice,
          p.image1,
          p.image2,
          p.image3,
          p.image4,
          p.image5,
          p.productDescription,
          u.username as artisanName,
          u.artisanId
        FROM products p
        JOIN users u ON p.artisanId = u.artisanId
        WHERE p.is_listed = TRUE AND u.artisanId != 'DEMO001'
        ORDER BY RAND()
        LIMIT ?
      `, [sliderItemsNeeded]);
    } else {
      // Get all available products including dummy ones
      [products] = await pool.query(`
        SELECT 
          p.id,
          p.productName,
          p.productPrice,
          p.image1,
          p.image2,
          p.image3,
          p.image4,
          p.image5,
          p.productDescription,
          u.username as artisanName,
          u.artisanId
        FROM products p
        JOIN users u ON p.artisanId = u.artisanId
        WHERE p.is_listed = TRUE
        ORDER BY RAND()
        LIMIT ?
      `, [sliderItemsNeeded]);
    }
    
    // If no products found, return empty array
    if (!products || products.length === 0) {
      return res.json({
        success: true,
        products: [],
        message: "No featured products available at the moment"
      });
    }
    
    // Format the response
    const formattedProducts = products.map(product => ({
      ...product,
      // Use the first available image
      mainImage: product.image1 || product.image2 || product.image3 || 
                product.image4 || product.image5 || '/default-product-image.jpg',
      // Ensure artisanName has a fallback
      artisanName: product.artisanName || 'Unknown Artisan'
    }));

    // If we don't have enough products for the slider, duplicate some
    if (formattedProducts.length < sliderItemsNeeded) {
      const needed = sliderItemsNeeded - formattedProducts.length;
      for (let i = 0; i < needed; i++) {
        // Cycle through available products when duplicating
        const productToDuplicate = formattedProducts[i % formattedProducts.length];
        formattedProducts.push({
          ...productToDuplicate,
          // Mark as duplicate to help frontend if needed
          isDuplicate: true
        });
      }
    }
    
    res.json({
      success: true,
      products: formattedProducts.slice(0, sliderItemsNeeded) // Ensure exactly 5 items
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching featured products" 
    });
  }
});

export default router;