//backend/routes/authRouter.js
import express from "express";
import { pool } from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
const uploadProfile = multer();
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "../lib/db.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Helper to upload profile image to Supabase
async function uploadProfileToSupabase(file) {
  if (!file) return null;
  const ext = file.originalname.split('.').pop();
  const filePath = `profile/${Date.now()}_${Math.round(Math.random() * 1e9)}.${ext}`;
  const { data, error } = await supabase.storage.from('magrahat').upload(filePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data: publicUrlData } = supabase.storage.from('magrahat').getPublicUrl(filePath);
  return publicUrlData.publicUrl;
}

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Signup Route
router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    adminPassKey,
    PhoneNumber,
    password,
    confirmPassword,
  } = req.body;
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Oops! The passwords don't match." });
  }
  try {
    // Verify Admin Pass Key
    const [adminRows] = await pool.query(
      "SELECT adminPassKey FROM admindata LIMIT 1"
    );
    if (!adminRows.length || adminRows[0].adminPassKey !== adminPassKey) {
      return res.status(403).json({ message: "Invalid Admin Pass Key." });
    }
    // Check if the Mobile Number already exists
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE PhoneNumber = ?",
      [PhoneNumber]
    );
    if (existing.length) {
      return res
        .status(409)
        .json({ message: "Phone number already registered." });
    }
    const username = `${firstName} ${lastName}`;
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, PhoneNumber, password) VALUES (?, ?, ?)",
      [username, PhoneNumber, hashed]
    );
    // Generate artisanId from insertId
    const generatedArtisanId = `ART${String(result.insertId).padStart(5, "0")}`;
    await pool.query("UPDATE users SET artisanId = ? WHERE id = ?", [
      generatedArtisanId,
      result.insertId,
    ]);

    const [[newUser]] = await pool.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);
    // Sign both id and artisanId into the token:
    const token = jwt.sign(
      { id: newUser.id, artisanId: newUser.artisanId },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    return res.status(201).json({
      message: "Welcome aboard!",
      token,
      username: newUser.username,
      artisanId: newUser.artisanId,
    });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { PhoneNumber, password } = req.body;
  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE PhoneNumber = ?",
      [PhoneNumber]
    );
    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No account with that phone number." });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    // Sign both id and artisanId here too:
    const token = jwt.sign(
      { id: user.id, artisanId: user.artisanId },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      message: "Login successful!",
      token,
      username: user.username,
      artisanId: user.artisanId,
      profileImage: user.profileImage || null,
    });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
});
// Add admin login route
router.post("/admin/login", async (req, res) => {
  // <-- Ensure this line is exactly like this
  const { adminId, adminPassword } = req.body;
  try {
    const [admins] = await pool.query(
      "SELECT * FROM admindata WHERE adminId = ?",
      [adminId]
    );

    if (!admins.length) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = admins[0];
    const match = await bcrypt.compare(adminPassword, admin.adminPassword);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, adminId: admin.adminId, role: "admin" },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      adminId: admin.adminId,
    });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// Ensure verifyToken middleware properly handles JWT errors
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ message: "No token provided." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message:
          err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }
    req.userId = decoded.id;
    if (decoded.role === "admin") {
      req.adminId = decoded.adminId;
      req.role = "admin";
    } else {
      req.artisanId = decoded.artisanId;
      req.role = "artisan";
    }
    next();
  });
};

router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Add profileImage to the SELECT query
    const [[profile]] = await pool.query(
      "SELECT username AS name, specialization, PhoneNumber AS contact, artisanId, profileImage FROM users WHERE artisanId = ?",
      [req.artisanId]
    );

    res.status(200).json({
      profile: {
        ...profile,
        specialization: profile.specialization || "Not Specified",
        contact: profile.contact || "No contact provided",
        profileImage: profile.profileImage || null, // Add profileImage to response
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

router.put(
  "/profile",
  verifyToken,
  uploadProfile.single("profileImage"),
  async (req, res) => {
    try {
      // Upload to Supabase if file provided
      let profileImage = null;
      if (req.file) {
        profileImage = await uploadProfileToSupabase(req.file);
      }
      // Update query with profile image (only update if new image provided)
      await pool.query(
        "UPDATE users SET specialization = ?, PhoneNumber = ?, profileImage = COALESCE(?, profileImage) WHERE artisanId = ?",
        [
          req.body.specialization,
          req.body.PhoneNumber,
          profileImage,
          req.artisanId,
        ]
      );
      // Get updated profile
      const [[updatedProfile]] = await pool.query(
        "SELECT username, specialization, PhoneNumber, artisanId, profileImage FROM users WHERE artisanId = ?",
        [req.artisanId]
      );
      res.status(200).json({
        message: "Profile updated successfully",
        profile: {
          name: updatedProfile.username,
          specialization: updatedProfile.specialization,
          contact: updatedProfile.PhoneNumber,
          artisanId: updatedProfile.artisanId,
          profileImage: updatedProfile.profileImage,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        message: "Database update failed",
        error: error.message,
      });
    }
  }
);

// Artisan Forgot Password
router.post("/forgot-password/artisan", async (req, res) => {
  const { artisanId, phoneNumber } = req.body;
  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE artisanId = ? AND PhoneNumber = ?",
      [artisanId, phoneNumber]
    );

    if (!users.length)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await pool.query("UPDATE users SET forgetpassword = TRUE WHERE id = ?", [
      users[0].id,
    ]);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add this function above the admin forgot password route
const generateRandomPassword = () => {
  const length = 12;
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  // Ensure at least one character from each category
  password += charset[Math.floor(Math.random() * 26)]; // Uppercase
  password += charset[26 + Math.floor(Math.random() * 26)]; // Lowercase
  password += charset[52 + Math.floor(Math.random() * 10)]; // Number
  password += charset[62 + Math.floor(Math.random() * 8)]; // Special character

  // Fill remaining characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password to mix the required characters
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

// Updated retry handler for SMTP
const sendWithRetry = async (mailOptions, retries = 3) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return sendWithRetry(mailOptions, retries - 1);
    }
    throw err;
  }
};

// Admin Forgot Password route (updated with better error handling)
router.post("/forgot-password/admin", async (req, res) => {
  const { adminId, email } = req.body;
  try {
    const [admins] = await pool.query(
      "SELECT * FROM admindata WHERE adminId = ?",
      [adminId]
    );

    if (!admins.length) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin = admins[0];

    // 2. Validate email match
    if (admin.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Email does not match registered account",
      });
    }

    // 3. Generate and log password (temporarily for debugging)
    const newPassword = generateRandomPassword();
    console.log("Generated Password:", newPassword); // Remove in production

    // 4. Send email with the ACTUAL password
    await sendPasswordEmail(email, newPassword);

    // 5. Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE admindata SET adminPassword = ? WHERE adminId = ?", [
      hashedPassword,
      adminId,
    ]);

    // 6. Verify update
    const [updatedAdmin] = await pool.query(
      "SELECT adminId FROM admindata WHERE adminId = ?",
      [adminId]
    );

    if (!updatedAdmin.length) {
      throw new Error("Password update verification failed");
    }

    return res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (err) {
    console.error("Password Reset Error:", {
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message:
        "Password reset failed. Contact support with reference ID: " +
        Date.now(),
    });
  }
});

// Updated sendPasswordEmail function
async function sendPasswordEmail(to, password) {
  try {
    const mailOptions = {
      from: {
        name: "CraftHub Support",
        address: process.env.EMAIL_FROM,
      },
      to,
      subject: "Your New Password",
      text: `Your new temporary password is: ${password}\n\nPlease login and change it immediately.`,
      html: `<p>Your new temporary password is: <strong>${password}</strong></p>
             <p>Please login and change it immediately.</p>`,
    };

    console.log("Sending email with password:", password); // Debug log
    const info = await sendWithRetry(mailOptions);
    console.log("Email delivery confirmed:", info.response);
    return true;
  } catch (err) {
    console.error("Email Send Failure:", {
      error: err.response || err.message,
      emailDetails: mailOptions, // Shows actual password in logs
    });
    throw new Error("Failed to deliver password email");
  }
}

export default router;
