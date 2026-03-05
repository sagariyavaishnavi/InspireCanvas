import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingCart, ShieldCheck, RefreshCw, Eye, Loader2 } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ArtworkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                const res = await api.get(`/artworks/${id}`);
                setArtwork(res.data);
            } catch (error) {
                console.error('Error fetching artwork:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtwork();
    }, [id]);

    const handleAddToCart = () => {
        if (!artwork) return;

        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = currentCart.findIndex(item => item._id === artwork._id);

        if (existingItemIndex > -1) {
            currentCart[existingItemIndex].quantity = (currentCart[existingItemIndex].quantity || 1) + 1;
        } else {
            currentCart.push({ ...artwork, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('storage'));
        navigate('/cart');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary-coral)" />
            </div>
        );
    }

    if (!artwork) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0', minHeight: '80vh' }}>
                <h2>Artwork not found</h2>
                <Link to="/explore" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Gallery</Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ padding: '60px 0' }}
        >
            <div className="artwork-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '60px', alignItems: 'start' }}>
                {/* Left: Image Section */}
                <div>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: '24px', background: '#f5f5f5', display: 'flex', justifyContent: 'center' }}
                    >
                        <img src={artwork.image} style={{ width: '100%', maxHeight: '700px', objectFit: 'contain', display: 'block' }} alt={artwork.title} />
                    </motion.div>
                </div>

                {/* Right: Details Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ background: '#E9FAF0', color: '#10B981', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                            {artwork.category || 'Digital Art'}
                        </span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ padding: '8px', borderRadius: '50%', background: 'white', border: '1px solid #EEE', cursor: 'pointer' }}><Heart size={20} color="var(--primary-coral)" /></button>
                            <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={{ padding: '8px', borderRadius: '50%', background: 'white', border: '1px solid #EEE', cursor: 'pointer' }}><Share2 size={20} /></button>
                        </div>
                    </div>

                    <h1 style={{ fontSize: '48px', marginBottom: '8px', wordBreak: 'break-word' }}>{artwork.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-coral)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                            {artwork.artist?.name ? artwork.artist.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <p style={{ fontSize: '18px' }}>by <span style={{ color: 'var(--soft-purple)', fontWeight: 700 }}>{artwork.artist?.name || 'Unknown Artist'}</span></p>
                    </div>

                    <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-md)', marginBottom: '32px', background: 'var(--bg-cream)' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '36px', fontWeight: 800 }}>₹{artwork.price?.toLocaleString()}</span>
                        </div>
                        <p style={{ color: 'var(--highlight-green)', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Free digital delivery
                        </p>
                    </div>

                    <p style={{ color: 'var(--text-gray)', lineHeight: 1.8, marginBottom: '40px', fontSize: '16px', whiteSpace: 'pre-line' }}>
                        {artwork.description || 'No description provided by the artist.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--soft-purple)', border: 'none', cursor: 'pointer' }}>
                            <ShoppingCart size={22} /> Add to Cart
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: '12px', marginTop: '40px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <ShieldCheck size={20} color="var(--highlight-green)" style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '11px', fontWeight: 600 }}>Secure Checkout</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Eye size={20} color="var(--primary-coral)" style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '11px', fontWeight: 600 }}>{artwork.views || 0} Views</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <RefreshCw size={20} color="var(--soft-purple)" style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '11px', fontWeight: 600 }}>Instant Access</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ArtworkDetail;
