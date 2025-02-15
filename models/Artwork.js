const mongoose = require("mongoose");

const ArtworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    artist: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Artwork", ArtworkSchema);
