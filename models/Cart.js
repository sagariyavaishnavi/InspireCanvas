const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            artworkId: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork", required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", CartSchema);
