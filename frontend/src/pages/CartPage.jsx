import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const updateQuantity = (id, delta) => {
        const newCart = cartItems.map(item => {
            if (item._id === id) {
                const newQuantity = (item.quantity || 1) + delta;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        });
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
    };

    const removeItem = (id) => {
        const newCart = cartItems.filter(item => item._id !== id);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
    };

    const handleCheckout = () => {
        if (!user) {
            alert("Please login first to proceed to checkout!");
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const subtotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
    const platformFee = cartItems.length > 0 ? 50.00 : 0; // ₹50 flat platform fee
    const total = subtotal + platformFee;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ padding: '60px 0', minHeight: '80vh' }}
        >
            <h1 style={{ fontSize: '42px', marginBottom: '40px' }}>Your <span className="gradient-text">Art Cart</span></h1>

            <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '40px' }}>
                {/* Cart Items List */}
                <div>
                    {cartItems.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {cartItems.map((item) => (
                                <div key={item._id} className="glass cart-item" style={{ display: 'flex', gap: '24px', padding: '24px', borderRadius: 'var(--radius-md)', background: 'white' }}>
                                    <img src={item.image} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <h3 style={{ fontSize: '20px' }}>{item.title}</h3>
                                                <button onClick={() => removeItem(item._id)} style={{ color: '#EF4444', background: 'none' }}><Trash2 size={18} /></button>
                                            </div>
                                            <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '16px' }}>by {item.artist?.name || 'Unknown'}</p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F9FAFB', padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
                                                <button onClick={() => updateQuantity(item._id, -1)} style={{ background: 'none' }}><Minus size={16} /></button>
                                                <span style={{ fontWeight: 700 }}>{item.quantity || 1}</span>
                                                <button onClick={() => updateQuantity(item._id, 1)} style={{ background: 'none' }}><Plus size={16} /></button>
                                            </div>
                                            <p style={{ fontSize: '18px', fontWeight: 800 }}>₹{item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ background: 'var(--bg-cream)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <ShoppingBag size={40} color="var(--primary-coral)" />
                            </div>
                            <h3>Your cart is empty</h3>
                            <p style={{ color: 'var(--text-gray)', marginBottom: '32px' }}>Looks like you haven't added any masterpieces yet.</p>
                            <Link to="/explore" className="btn-primary">Explore Gallery</Link>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div>
                    <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: 'white', position: 'sticky', top: '120px' }}>
                        <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>Order Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-gray)' }}>Subtotal</span>
                                <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-gray)' }}>Platform Fee</span>
                                <span style={{ fontWeight: 700 }}>₹{platformFee.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-gray)' }}>Estimated Taxes</span>
                                <span style={{ fontWeight: 700 }}>FREE</span>
                            </div>
                            <div style={{ height: '1px', background: '#EEE', margin: '8px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px' }}>
                                <span style={{ fontWeight: 800 }}>Total</span>
                                <span style={{ fontWeight: 800, color: 'var(--primary-coral)' }}>₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {cartItems.length > 0 && (
                            <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', border: 'none' }}>
                                Proceed to Checkout <ArrowRight size={20} />
                            </button>
                        )}

                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                                By proceeding to checkout, you agree to our <a href="#" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Refund Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;
