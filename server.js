require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (must be BEFORE routes!)
app.use(express.json());  // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Handles form data
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html as the default page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Import Routes
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const galleryRoutes = require("./routes/gallery");
const cartRoutes = require("./routes/cart");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/artworks", galleryRoutes);
app.use("/api/cart", cartRoutes);

// MongoDB Connection with Error Handling
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit process with failure
    });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
