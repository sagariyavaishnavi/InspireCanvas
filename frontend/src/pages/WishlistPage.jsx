import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const loadWishlist = () => {
            const items = JSON.parse(localStorage.getItem('wishlist')) || [];
            setWishlist(items);
        };
        loadWishlist();
        window.addEventListener('storage', loadWishlist);
        return () => window.removeEventListener('storage', loadWishlist);
    }, []);

    const removeFromWishlist = (id) => {
        const updated = wishlist.filter(item => item._id !== id);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setWishlist(updated);
        window.dispatchEvent(new Event('storage'));
    };

    if (wishlist.length === 0) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <Heart size={64} color="#DDD" style={{ marginBottom: '24px' }} />
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Your Wishlist is Empty</h2>
                <p style={{ color: 'var(--text-gray)', marginBottom: '40px' }}>Save your favorite masterpieces to view them later.</p>
                <Link to="/explore" className="btn-primary" style={{ padding: '16px 40px' }}>Explore Gallery</Link>
            </div>
        );
    }

    return (
        <div className="container page-container">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>My Wishlist</h1>
                <p style={{ color: 'var(--text-gray)' }}>Items you've liked and want to keep an eye on.</p>
            </div>

            <div className="grid-artwork wishlist-grid">
                {wishlist.map((art) => (
                    <motion.div
                        key={art._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass"
                        style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}
                    >
                        <button 
                            onClick={() => removeFromWishlist(art._id)}
                            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(255,255,255,0.95)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'var(--primary-coral)', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            title="Unlike"
                        >
                            <Heart size={18} fill="var(--primary-coral)" />
                        </button>
                        <div style={{ height: '220px', position: 'relative' }}>
                            <img src={art.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={art.title} />
                            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700 }}>
                                ₹{Math.floor(Number(art.price)).toLocaleString()}
                            </div>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{art.title}</h3>
                            <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '24px' }}>by {art.artist?.name || 'Artist'}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                                <Link to={`/artwork/${art._id}`} className="btn-primary" style={{ textAlign: 'center', background: 'var(--text-dark)', padding: '12px' }}>
                                    View Details
                                </Link>
                                <button style={{ padding: '12px', background: 'var(--soft-purple-light)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--soft-purple)', cursor: 'pointer' }}>
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
