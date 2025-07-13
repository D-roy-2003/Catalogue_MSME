import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import individualProductRouter from "./routes/individualProductRouter.js";
import publicRouter from "./routes/publicRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import { verifyToken } from "./routes/authRouter.js";
import featuredProductsRouter from "./routes/featuredProductsRouter.js";
import userRouter from "./routes/userRouter.js";
import { connectToDatabase } from "./lib/db.js";
import adminProfileRouter from "./routes/adminProfileRouter.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// For ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remove all fs and /uploads logic. Do not create or serve /uploads directory.

// Initialize database connection
connectToDatabase().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use("/auth", authRouter);
app.use("/products", verifyToken, productRouter);
app.use("/api/public/products", individualProductRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/public", publicRouter);
app.use("/api/featured", featuredProductsRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminProfileRouter);
app.use("/api/public", publicRouter);
app.use("/api/products", verifyToken, productRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Default route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Artisan Backend</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
          .routes {
            margin-top: 20px;
          }
          .route {
            padding: 10px;
            margin-bottom: 10px;
            background: #f0f0f0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Artisan Backend Server</h1>
          <p>Server is running successfully!</p>
          <div class="routes">
            <h2>Available Routes:</h2>
            <div class="route">
              <strong>GET /api/users/artisans</strong> - Get all artisans data (public)
            </div>
            <div class="route">
              <strong>POST /auth/login</strong> - User login
            </div>
            <div class="route">
              <strong>POST /auth/signup</strong> - User signup
            </div>
            <div class="route">
              <strong>GET /products</strong> - Get all products (protected)
            </div>
            <div class="route">
              <strong>POST /api/feedback</strong> - Submit feedback
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;