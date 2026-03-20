const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/users", require("./routes/users"));

// Serve Frontend Files
const frontendPath = path.join(__dirname, "..");
app.use(express.static(frontendPath));

// Catch-all route to serve index.html for any non-API request
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message === "Only JPEG, PNG, and GIF images are allowed") {
    return res.status(400).json({ msg: err.message });
  }

  if (err.message.includes("File too large")) {
    return res.status(413).json({ msg: "File size exceeds 5MB limit" });
  }

  res.status(500).json({ msg: "Server Error" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blog_app")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
