const Order = require('../models/Order');
const Artwork = require('../models/Artwork');

// Create Order (Simulate Checkout)
exports.createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const orderItems = items.map(item => ({
            artwork: item._id, // Assume id is passed
            price: item.price
        }));

        const order = await Order.create({
            buyer: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentStatus: 'completed' // In a real app we'd verify with Stripe etc.
        });

        // Update all artworks in the order to status 'sold'
        for (const item of orderItems) {
            await Artwork.findByIdAndUpdate(item.artwork, { status: 'sold' });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Create Order Error:', error);
        next(error);
    }
};

// Get My Orders (for Buyer)
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('items.artwork', 'title image price');
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Get Sales (for Artist)
exports.getSalesForArtist = async (req, res, next) => {
    try {
        // Find artworks by this artist
        const artistArtworks = await Artwork.find({ artist: req.user._id });
        const artworkIds = artistArtworks.map(a => a._id.toString());

        // Find orders containing these artworks
        const orders = await Order.find({
            'items.artwork': { $in: artworkIds }
        }).populate('buyer', 'name email').populate('items.artwork', 'title image price');

        // Filter order items to only those belonging to the artist
        const relevantSales = orders.map(order => {
            const artistItems = order.items.filter(item => 
                item.artwork && artworkIds.includes(item.artwork._id.toString())
            );
            return {
                orderId: order._id,
                buyer: order.buyer,
                items: artistItems,
                createdAt: order.createdAt,
                totalForArtist: artistItems.reduce((acc, item) => acc + (item.price || 0), 0)
            };
        });

        res.status(200).json(relevantSales);
    } catch (error) {
        next(error);
    }
};
