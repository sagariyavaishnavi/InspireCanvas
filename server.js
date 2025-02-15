require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (must be BEFORE routes!)
app.use(express.json());  // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Handles form data
app.use(cors());
app.use("/uploads", express.static("uploads"));




const path = require("path");

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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
