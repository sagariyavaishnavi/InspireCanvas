const express = require("express");
const multer = require("multer");
const path = require("path");
const Artwork = require("../models/Artwork");

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload artwork
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, price, artist } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        const newArtwork = new Artwork({ title, price, artist, imageUrl });
        await newArtwork.save();

        res.status(201).json({ message: "Artwork uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error uploading artwork" });
    }
});

module.exports = router;
