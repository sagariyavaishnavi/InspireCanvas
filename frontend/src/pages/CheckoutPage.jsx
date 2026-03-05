import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CheckoutPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [platformFee, setPlatformFee] = useState(50);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=cart');
            return;
        }

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (storedCart.length === 0) {
            navigate('/cart');
            return;
        }

        setCartItems(storedCart);
        const calcSubtotal = storedCart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
        setSubtotal(calcSubtotal);
    }, [user, navigate]);

    const total = subtotal + platformFee;

    const handleCompletePurchase = async () => {
        setIsProcessing(true);
        try {
            // Fake delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Clear cart
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));

            alert('Payment Successful! Thank you for supporting artists.');
            navigate('/dashboard'); // or orders page
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to process payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ padding: '60px 0', minHeight: '80vh' }}
        >
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', marginBottom: '32px', fontSize: '14px', fontWeight: 600 }}>
                <ArrowLeft size={16} /> Back to Cart
            </Link>

            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '60px' }}>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>Full Name</label>
                                    <input type="text" defaultValue={user?.name} placeholder="John Doe" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-gray)' }}>Email Address</label>
                                    <input type="email" defaultValue={user?.email} placeholder="john@example.com" style={{ width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', background: '#F9FAFB', outline: 'none' }} />
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
                                <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary-coral)', background: 'white' }}>
                                    <CheckCircle size={20} color="var(--primary-coral)" />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700 }}>Credit or Debit Card</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Visa, Mastercard, RuPay</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '24px', background: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid #EEE' }}>
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
                                        <input type="text" placeholder="123" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #DDD', outline: 'none' }} />
                                    </div>
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
                                <span style={{ color: 'var(--text-gray)' }}>Platform Fee</span>
                                <span>₹{platformFee.toLocaleString()}</span>
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
        </motion.div>
    );
};

export default CheckoutPage;
