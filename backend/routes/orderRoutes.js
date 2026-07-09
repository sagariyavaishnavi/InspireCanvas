const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getSalesForArtist, cancelOrder, returnOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/sales', protect, authorize('artist'), getSalesForArtist);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, returnOrder);

module.exports = router;
