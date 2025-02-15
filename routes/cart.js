const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add to cart
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { artworkId } = req.body;
        let cart = await Cart.findOne({ userId: req.user.userId });

        if (!cart) {
            cart = new Cart({ userId: req.user.userId, items: [{ artworkId }] });
        } else {
            cart.items.push({ artworkId });
        }

        await cart.save();
        res.json({ message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Error adding item to cart" });
    }
});

// Get user cart
router.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.artworkId");
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
    }
});

module.exports = router;
