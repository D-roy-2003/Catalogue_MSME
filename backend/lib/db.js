// Remove all demo-related code completely
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Create a MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const connectToDatabase = async () => {
  try {
    // Connect without database first to ensure DB exists
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await tempConnection.end();

    // Use pool to create tables
    await createTables();
    console.log("Database initialized with empty tables");
    return pool;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

async function createTables() {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      artisanId VARCHAR(50) UNIQUE,
      PhoneNumber VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      specialization VARCHAR(255) DEFAULT NULL,
      profileImage VARCHAR(255) DEFAULT NULL,
      listed BOOLEAN DEFAULT FALSE,
      forgetpassword BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_artisanId (artisanId),
      INDEX idx_listed (listed)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      artisanId VARCHAR(50) NOT NULL,
      productId VARCHAR(50) NOT NULL,
      productName VARCHAR(255) NOT NULL,
      productPrice DECIMAL(10,2),
      material VARCHAR(255),
      height VARCHAR(50),
      width VARCHAR(50),
      weight VARCHAR(50),
      certification VARCHAR(255) DEFAULT NULL,
      finish VARCHAR(255) DEFAULT NULL,
      closureType VARCHAR(255) DEFAULT NULL,
      image1 VARCHAR(255),
      image2 VARCHAR(255),
      image3 VARCHAR(255),
      image4 VARCHAR(255),
      image5 VARCHAR(255),
      productDescription TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      category VARCHAR(255) DEFAULT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      is_listed BOOLEAN NOT NULL DEFAULT FALSE,
      listed_at DATETIME DEFAULT NULL,
      FOREIGN KEY (artisanId) REFERENCES users(artisanId) ON DELETE CASCADE,
      INDEX idx_artisanId (artisanId),
      INDEX idx_is_listed (is_listed),
      FULLTEXT INDEX ft_product_search (productName, productDescription, material)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Feedback table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(255) DEFAULT NULL,
      artisanName VARCHAR(255) DEFAULT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_read BOOLEAN DEFAULT FALSE,
      artisanId VARCHAR(50) DEFAULT NULL,
      FOREIGN KEY (artisanId) REFERENCES users(artisanId) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Admin table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admindata (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) DEFAULT NULL,
      adminId VARCHAR(50) NOT NULL UNIQUE,
      adminPassword VARCHAR(255) NOT NULL,
      adminPassKey VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(20) DEFAULT NULL,
      email VARCHAR(255) DEFAULT NULL,
      address VARCHAR(255) DEFAULT NULL,
      profileimage VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Only create admin account if doesn't exist
  await addDefaultAdmin();
}

async function addDefaultAdmin() {
  const [admins] = await pool.query(
    "SELECT COUNT(*) as count FROM admindata"
  );
  if (admins[0].count === 0) {
    const hashedPassword = await bcrypt.hash("admin2003", 10);
    await pool.query(
      `INSERT INTO admindata (adminId, adminPassword, adminPassKey)
       VALUES ('admin123', ?, ?)`,
      [hashedPassword, process.env.ADMIN_PASS_KEY || "ADMIN123"]
    );
    console.log("Default admin created (only required account)");
  }
}

// Initialize Supabase client
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

process.on("unhandledRejection", (err) => {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("Database connection was closed. Pool will handle reconnection.");
  } else {
    console.error("Unhandled database error:", err);
  }
});
