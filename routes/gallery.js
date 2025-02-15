const express = require("express");
const Artwork = require("../models/Artwork");

const router = express.Router();

// Get all artworks
router.get("/", async (req, res) => {
    try {
        const artworks = await Artwork.find();
        res.json(artworks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching artworks" });
    }
});

module.exports = router;
