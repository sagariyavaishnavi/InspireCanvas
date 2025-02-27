const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");

const router = express.Router();

// Get user's cart
router.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("items.artworkId");
        res.json(cart || { userId: req.user.id, items: [] });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Add artwork to cart
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { artworkId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [{ artworkId, quantity }] });
        } else {
            const existingItem = cart.items.find(item => item.artworkId.toString() === artworkId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ artworkId, quantity });
            }
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Remove item from cart
router.delete("/remove/:artworkId", authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.artworkId.toString() !== req.params.artworkId);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
