const express = require("express");
const multer = require("multer");
const Artwork = require("../models/Artwork"); // Import Artwork Model
const router = express.Router();

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Upload Artwork Route
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, price, artist } = req.body;
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const newArtwork = new Artwork({
            title,
            price,
            artist,
            imageUrl: `/uploads/${req.file.filename}`
        });

        await newArtwork.save();
        res.status(201).json({ message: "Artwork uploaded successfully", artwork: newArtwork });
    } catch (error) {
        res.status(500).json({ message: "Error uploading artwork", error });
    }
});

module.exports = router;
