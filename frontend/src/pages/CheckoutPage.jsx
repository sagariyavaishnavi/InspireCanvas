import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CheckoutPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [platformFee, setPlatformFee] = useState(0); // Removed platform fee
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutDetails, setCheckoutDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        paymentMethod: 'card'
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showMessage = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type });
        if (type === 'success') {
            // Success messages usually stay longer or redirect
        } else {
            setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
        }
    };

    useEffect(() => {
        const storedDetails = JSON.parse(localStorage.getItem('checkoutDetails'));
        if (storedDetails) {
            setCheckoutDetails((prev) => ({ ...prev, ...storedDetails, name: user?.name || storedDetails.name, email: user?.email || storedDetails.email }));
        }
    }, [user]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (storedCart.length === 0) {
            navigate('/cart');
            return;
        }

        setCartItems(storedCart);
        const calcSubtotal = storedCart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
        setSubtotal(calcSubtotal);
    }, [user, navigate]);

    const gstAmount = subtotal * 0.12;
    const total = subtotal + gstAmount;

    const handleCompletePurchase = async () => {
        // Validation
        const { name, email, phone, address, city, state, zip } = checkoutDetails;
        if (!name || !email || !phone || !address || !city || !state || !zip) {
            showMessage('Please fill in all shipping and billing details.', 'error');
            return;
        }

        setIsProcessing(true);
        try {
            // Fake delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Clear cart
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));

            // Save checkout details for future visits
            localStorage.setItem('checkoutDetails', JSON.stringify(checkoutDetails));

            showMessage('Payment Successful! Thank you for your order. We have sent a confirmation email with the delivery tracking details.', 'success');
            setTimeout(() => navigate('/'), 3000); 
        } catch (error) {
            console.error('Checkout error:', error);
            showMessage('Failed to process payment. Please try again.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container checkout-container"
            style={{ minHeight: '80vh' }}
        >
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', marginBottom: '32px', fontSize: '14px', fontWeight: 600 }}>
                <ArrowLeft size={16} /> Back to Cart
            </Link>

            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.7fr)', gap: '40px' }}>
                {/* Checkout Form */}
                <div>
                    <h1 style={{ fontSize: '36px', marginBottom: '40px' }}>Checkout</h1>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Shipping Information */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ background: 'var(--soft-purple-light)', color: 'var(--soft-purple)', padding: '8px', borderRadius: '8px' }}><Truck size={20} /></div>
                                <h3 style={{ fontSize: '20px' }}>Billing Information</h3>
                            </div>

                            <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>Full Name</label>
                                    <input type="text" value={checkoutDetails.name} onChange={(e) => setCheckoutDetails({ ...checkoutDetails, name: e.target.value })} placeholder="John Doe" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>Email Address</label>
                                    <input type="email" value={checkoutDetails.email} onChange={(e) => setCheckoutDetails({ ...checkoutDetails, email: e.target.value })} placeholder="john@example.com" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>Phone Number</label>
                                    <input type="tel" value={checkoutDetails.phone} onChange={(e) => setCheckoutDetails({ ...checkoutDetails, phone: e.target.value })} placeholder="+91 00000 00000" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} required />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>Shipping Address</label>
                                    <input type="text" value={checkoutDetails.address} onChange={(e) => setCheckoutDetails({ ...checkoutDetails, address: e.target.value })} placeholder="House No, Street, Landmark" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>City</label>
                                    <input type="text" value={checkoutDetails.city} onChange={(e) => setCheckoutDetails({ ...checkoutDetails, city: e.target.value })} placeholder="City" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>State</label>
                                    <input type="text" value={checkoutDetails.state} onChange={(e) => setCheckoutDetails({ ...checkoutDetails, state: e.target.value })} placeholder="State" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>Pincode</label>
                                    <input type="text" value={checkoutDetails.zip} onChange={(e) => setCheckoutDetails({ ...checkoutDetails, zip: e.target.value })} placeholder="000000" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} required />
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ background: 'var(--bg-cream)', color: 'var(--accent-yellow)', padding: '8px', borderRadius: '8px' }}><CreditCard size={20} /></div>
                                <h3 style={{ fontSize: '20px' }}>Payment Method</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div 
                                    onClick={() => setCheckoutDetails({ ...checkoutDetails, paymentMethod: 'card' })}
                                    className="glass" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: 'var(--radius-md)', border: checkoutDetails.paymentMethod === 'card' ? '2px solid var(--primary-coral)' : '1px solid #EEE', background: 'white', cursor: 'pointer' }}
                                >
                                    <CheckCircle size={20} color={checkoutDetails.paymentMethod === 'card' ? 'var(--primary-coral)' : '#DDD'} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700 }}>Credit or Debit Card</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Visa, Mastercard, RuPay</p>
                                    </div>
                                    <CreditCard size={24} color="#666" />
                                </div>

                                {checkoutDetails.paymentMethod === 'card' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '24px', background: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid #EEE', marginTop: '-8px' }}>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #DDD', outline: 'none' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Expiry Date</label>
                                            <input type="text" placeholder="MM / YY" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #DDD', outline: 'none' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>CVV</label>
                                            <input type="password" placeholder="123" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #DDD', outline: 'none' }} />
                                        </div>
                                    </div>
                                )}

                                <div 
                                    onClick={() => setCheckoutDetails({ ...checkoutDetails, paymentMethod: 'upi' })}
                                    className="glass" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: 'var(--radius-md)', border: checkoutDetails.paymentMethod === 'upi' ? '2px solid var(--primary-coral)' : '1px solid #EEE', background: 'white', cursor: 'pointer' }}
                                >
                                    <CheckCircle size={20} color={checkoutDetails.paymentMethod === 'upi' ? 'var(--primary-coral)' : '#DDD'} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700 }}>GPay / PhonePe / UPI</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Instant payment using your UPI ID</p>
                                    </div>
                                    <span style={{ fontWeight: 800, color: '#666' }}>UPI</span>
                                </div>

                                <div 
                                    onClick={() => setCheckoutDetails({ ...checkoutDetails, paymentMethod: 'cod' })}
                                    className="glass" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: 'var(--radius-md)', border: checkoutDetails.paymentMethod === 'cod' ? '2px solid var(--primary-coral)' : '1px solid #EEE', background: 'white', cursor: 'pointer' }}
                                >
                                    <CheckCircle size={20} color={checkoutDetails.paymentMethod === 'cod' ? 'var(--primary-coral)' : '#DDD'} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700 }}>Cash on Delivery (COD)</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Pay when you receive the artwork</p>
                                    </div>
                                    <Truck size={24} color="#666" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Floating Order Summary */}
                <div>
                    <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: 'white', position: 'sticky', top: '120px' }}>
                        <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>Review Selection</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px', maxHeight: '300px', overflowY: 'auto' }}>
                            {cartItems.map((item) => (
                                <div key={item._id} style={{ display: 'flex', gap: '12px' }}>
                                    <img src={item.image} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{item.title}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)' }}>₹{item.price?.toLocaleString()} × {item.quantity || 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-gray)' }}>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-gray)' }}>GST (12%)</span>
                                <span>₹{gstAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ height: '1px', background: '#EEE', margin: '4px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px' }}>
                                <span style={{ fontWeight: 800 }}>Total</span>
                                <span style={{ fontWeight: 800, color: 'var(--primary-coral)' }}>₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCompletePurchase}
                            disabled={isProcessing}
                            className="btn-primary"
                            style={{ width: '100%', padding: '20px', fontSize: '18px', marginBottom: '20px', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1 }}
                        >
                            {isProcessing ? 'Processing...' : 'Pay Now'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '12px' }}>
                            <ShieldCheck size={16} /> Secure SSL Encrypted Payment
                        </div>
                    </div>
                </div>
            </div>
            {/* Custom Notification Toast */}
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 20 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="notification-toast"
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10000,
                            background: notification.type === 'success' ? '#10B981' : '#EF4444',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: 600,
                            minWidth: '300px',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CheckoutPage;
