const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const sendEmail = require('../utils/sendEmail');

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

        // Fetch populated order for email notifications
        const populatedOrder = await Order.findById(order._id)
            .populate('buyer', 'name email')
            .populate({
                path: 'items.artwork',
                populate: { path: 'artist', select: 'name email' }
            });

        // Construct items list for buyer email
        let itemsListText = '';
        let itemsListHtml = '';
        const artistSales = {};

        for (const item of populatedOrder.items) {
            const art = item.artwork;
            const title = art ? art.title : 'Digital Masterpiece';
            const artistName = (art && art.artist) ? art.artist.name : 'Unknown Artist';
            
            itemsListText += `- ${title} by ${artistName}: ₹${item.price.toLocaleString()}\n`;
            itemsListHtml += `<tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${title} <br/><span style="font-size: 12px; color: #777;">by ${artistName}</span></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
            </tr>`;

            // Group by artist for sales email
            if (art && art.artist && art.artist.email) {
                const artistId = art.artist._id.toString();
                if (!artistSales[artistId]) {
                    artistSales[artistId] = {
                        name: art.artist.name,
                        email: art.artist.email,
                        items: []
                    };
                }
                artistSales[artistId].items.push({
                    title: art.title,
                    price: item.price
                });
            }
        }

        // 1. Send Order Confirmation Email to Buyer
        try {
            sendEmail({
                email: req.user.email,
                subject: 'Your InspireCanvas Order Confirmation! 🛒✨',
                message: `Hi ${req.user.name},\n\nThank you for your purchase! We've received your order.\n\nOrder Details:\nOrder ID: ${order._id}\nItems:\n${itemsListText}\nTotal Amount: ₹${totalAmount.toLocaleString()}\n\nShipping Address:\n${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zip}\n\nWe will update you once your digital masterpieces are ready.\n\nBest regards,\nThe InspireCanvas Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #FF5A5F; text-align: center;">Order Confirmed! 🛒✨</h2>
                        <p>Hi <strong>${req.user.name}</strong>,</p>
                        <p>Thank you for your order! We are preparing your digital masterpieces for delivery.</p>
                        <h3 style="border-bottom: 2px solid #FF5A5F; padding-bottom: 5px;">Order Summary</h3>
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <thead>
                                <tr style="background-color: #f9f9f9;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                                    <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsListHtml}
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-top: 2px solid #ddd;">Total</td>
                                    <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #ddd; color: #FF5A5F; font-size: 18px;">₹${totalAmount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 style="border-bottom: 2px solid #FF5A5F; padding-bottom: 5px;">Shipping Address</h3>
                        <p>
                            ${shippingAddress.address}<br/>
                            ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zip}<br/>
                            <strong>Phone:</strong> ${shippingAddress.phone}
                        </p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (err) {
            console.error('Buyer order email error:', err.message);
        }

        // 2. Send Sales Notification Emails to Artists
        for (const artistId in artistSales) {
            const sale = artistSales[artistId];
            let saleItemsText = '';
            let saleItemsHtml = '';
            let artistEarnings = 0;

            for (const item of sale.items) {
                saleItemsText += `- ${item.title}: ₹${item.price.toLocaleString()}\n`;
                saleItemsHtml += `<tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
                </tr>`;
                artistEarnings += item.price;
            }
            const netEarnings = artistEarnings * 0.90; // 10% platform fee

            try {
                sendEmail({
                    email: sale.email,
                    subject: 'Congratulations! Your Artwork has been Sold! 🎉🎨',
                    message: `Hi ${sale.name},\n\nGreat news! Your artwork has been purchased on InspireCanvas.\n\nSold Items:\n${saleItemsText}\nTotal Sale Value: ₹${artistEarnings.toLocaleString()}\nNet Earnings (after 10% platform fee): ₹${netEarnings.toLocaleString()}\n\nBuyer Details:\nName: ${req.user.name}\nEmail: ${req.user.email}\nShipping Address:\n${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zip}\n\nPlease check your Dashboard for details.\n\nBest regards,\nThe InspireCanvas Team`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                            <h2 style="color: #10B981; text-align: center;">Masterpiece Sold! 🎉🎨</h2>
                            <p>Hi <strong>${sale.name}</strong>,</p>
                            <p>Congratulations! A buyer has purchased your artwork on InspireCanvas.</p>
                            <h3 style="border-bottom: 2px solid #10B981; padding-bottom: 5px;">Sales Details</h3>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <thead>
                                    <tr style="background-color: #f9f9f9;">
                                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Artwork Title</th>
                                        <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${saleItemsHtml}
                                    <tr>
                                        <td style="padding: 10px; font-weight: bold; border-top: 2px solid #ddd;">Total Sale Value</td>
                                        <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #ddd; color: #10B981;">₹${artistEarnings.toLocaleString()}</td>
                                    </tr>
                                    <tr style="background-color: #F0FDF4;">
                                        <td style="padding: 10px; font-weight: bold; border-top: 1px solid #ddd;">Your Net Earnings (90%)</td>
                                        <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 1px solid #ddd; color: #10B981; font-size: 16px;">₹${netEarnings.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h3 style="border-bottom: 2px solid #10B981; padding-bottom: 5px;">Shipping & Delivery Details</h3>
                            <p>
                                Please prepare the shipment for the following address:<br/>
                                <strong>Name:</strong> ${req.user.name}<br/>
                                <strong>Address:</strong> ${shippingAddress.address}<br/>
                                <strong>City/State/Zip:</strong> ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zip}<br/>
                                <strong>Phone:</strong> ${shippingAddress.phone}
                            </p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #999; text-align: center;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                        </div>
                    `
                });
            } catch (err) {
                console.error('Artist sale notification email error:', err.message);
            }
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

// Cancel Order
exports.cancelOrder = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id })
            .populate('buyer', 'name email')
            .populate({
                path: 'items.artwork',
                populate: { path: 'artist', select: 'name email' }
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'placed') {
            return res.status(400).json({ message: `Cannot cancel an order with status: ${order.status}` });
        }

        order.status = 'cancelled';
        order.cancelReason = reason || 'No reason provided';
        await order.save();

        // Release artworks back to 'active' and send email alerts to artists
        for (const item of order.items) {
            if (item.artwork && item.artwork._id) {
                await Artwork.findByIdAndUpdate(item.artwork._id, { status: 'active' });

                if (item.artwork.artist && item.artwork.artist.email) {
                    try {
                        await sendEmail({
                            email: item.artwork.artist.email,
                            subject: `InspireCanvas Order Cancellation Alert: ${item.artwork.title} 🔴`,
                            message: `Hi ${item.artwork.artist.name},\n\nWe wanted to let you know that the order for your artwork "${item.artwork.title}" has been cancelled by the buyer.\n\nCancellation Reason: ${reason || 'No reason provided'}\n\nYour artwork status has been reset to "Available" for other collectors.\n\nBest regards,\nThe InspireCanvas Team`,
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                                    <h2 style="color: #EF4444; text-align: center;">Order Cancelled 🔴</h2>
                                    <p>Hi <strong>${item.artwork.artist.name}</strong>,</p>
                                    <p>We wanted to let you know that the order for your artwork "<strong>${item.artwork.title}</strong>" has been cancelled by the buyer.</p>
                                    <div style="background-color: #FEE2E2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <p style="margin: 0; color: #991B1B;"><strong>Cancellation Reason:</strong> ${reason || 'No reason provided'}</p>
                                    </div>
                                    <p>Your artwork status has been reset to "Available" for other collectors.</p>
                                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                                    <p style="font-size: 12px; color: #999; text-align: center;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                                </div>
                            `
                        });
                    } catch (err) {
                        console.error('Email notify artist error:', err);
                    }
                }
            }
        }

        // Notify Buyer
        try {
            await sendEmail({
                email: order.buyer.email,
                subject: `InspireCanvas Order Cancelled Successfully: #${order._id} 🛑`,
                message: `Hi ${order.buyer.name},\n\nYour order #${order._id} has been cancelled successfully.\n\nCancellation Feedback: ${reason || 'No reason provided'}\n\nAny payments made will be processed back to your original payment method within 5-7 business days.\n\nBest regards,\nThe InspireCanvas Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #EF4444; text-align: center;">Order Cancelled Successfully 🛑</h2>
                        <p>Hi <strong>${order.buyer.name}</strong>,</p>
                        <p>Your order <strong>#${order._id}</strong> has been cancelled successfully.</p>
                        <div style="background-color: #FEE2E2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #991B1B;"><strong>Cancellation Feedback:</strong> ${reason || 'No reason provided'}</p>
                        </div>
                        <p>Any payments made will be processed back to your original payment method within 5-7 business days.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (err) {
            console.error('Email notify buyer error:', err);
        }

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        next(error);
    }
};

// Return Order
exports.returnOrder = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id })
            .populate('buyer', 'name email')
            .populate({
                path: 'items.artwork',
                populate: { path: 'artist', select: 'name email' }
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'placed') {
            return res.status(400).json({ message: `Cannot return an order with status: ${order.status}` });
        }

        order.status = 'returned';
        order.returnReason = reason || 'No reason provided';
        await order.save();

        // Release artworks back to 'active' and send email alerts to artists
        for (const item of order.items) {
            if (item.artwork && item.artwork._id) {
                await Artwork.findByIdAndUpdate(item.artwork._id, { status: 'active' });

                if (item.artwork.artist && item.artwork.artist.email) {
                    try {
                        await sendEmail({
                            email: item.artwork.artist.email,
                            subject: `InspireCanvas Order Return Request Alert: ${item.artwork.title} ⚠️`,
                            message: `Hi ${item.artwork.artist.name},\n\nWe wanted to let you know that the buyer has requested a return for your artwork "${item.artwork.title}".\n\nReturn Reason: ${reason || 'No reason provided'}\n\nYour artwork status has been reset to "Available" for other collectors.\n\nBest regards,\nThe InspireCanvas Team`,
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                                    <h2 style="color: #D97706; text-align: center;">Order Return Requested ⚠️</h2>
                                    <p>Hi <strong>${item.artwork.artist.name}</strong>,</p>
                                    <p>We wanted to let you know that the buyer has requested a return for your artwork "<strong>${item.artwork.title}</strong>".</p>
                                    <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <p style="margin: 0; color: #92400E;"><strong>Return Reason:</strong> ${reason || 'No reason provided'}</p>
                                    </div>
                                    <p>Your artwork status has been reset to "Available" for other collectors.</p>
                                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                                    <p style="font-size: 12px; color: #999; text-align: center;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                                </div>
                            `
                        });
                    } catch (err) {
                        console.error('Email notify artist error:', err);
                    }
                }
            }
        }

        // Notify Buyer
        try {
            await sendEmail({
                email: order.buyer.email,
                subject: `InspireCanvas Order Return Initiated: #${order._id} ↩️`,
                message: `Hi ${order.buyer.name},\n\nYour return request for order #${order._id} has been initiated successfully.\n\nReturn Feedback: ${reason || 'No reason provided'}\n\nOur logistics partner will get in touch with you shortly to inspect and collect the artwork. Any refunds will be processed once collected.\n\nBest regards,\nThe InspireCanvas Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #D97706; text-align: center;">Order Return Initiated ↩️</h2>
                        <p>Hi <strong>${order.buyer.name}</strong>,</p>
                        <p>Your return request for order <strong>#${order._id}</strong> has been initiated successfully.</p>
                        <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #92400E;"><strong>Return Feedback:</strong> ${reason || 'No reason provided'}</p>
                        </div>
                        <p>Our logistics partner will get in touch with you shortly to inspect and collect the artwork. Any refunds will be processed once collected.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (err) {
            console.error('Email notify buyer error:', err);
        }

        res.status(200).json({ message: 'Order returned successfully', order });
    } catch (error) {
        next(error);
    }
};
