const express = require("express");
const Artwork = require("../models/Artwork");
const router = express.Router();

// Fetch all artworks
router.get("/", async (req, res) => {
    try {
        const artworks = await Artwork.find();
        res.status(200).json(artworks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching artworks", error });
    }
});

module.exports = router;
