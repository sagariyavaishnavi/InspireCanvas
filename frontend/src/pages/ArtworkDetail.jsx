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
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [shareNotification, setShareNotification] = useState(false);

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

    useEffect(() => {
        if (artwork) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            setIsWishlisted(wishlist.some(item => item._id === artwork._id));
        }
    }, [artwork]);

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

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        let newWishlist;
        if (isWishlisted) {
            newWishlist = wishlist.filter(item => item._id !== artwork._id);
        } else {
            newWishlist = [...wishlist, artwork];
        }
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setIsWishlisted(!isWishlisted);
        window.dispatchEvent(new Event('storage'));
    };

    const handleShare = async () => {
        const shareData = {
            title: artwork.title,
            text: `Check out this amazing artwork: ${artwork.title} by ${artwork.artist?.name}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShareNotification(true);
                setTimeout(() => setShareNotification(false), 3000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
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
            className="container page-container"
        >
            <div className="artwork-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.8fr)', gap: '40px', alignItems: 'start' }}>
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ background: '#EBE8FF', color: 'var(--soft-purple)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {artwork.category || 'HandWork'}
                            </span>
                            <span style={{ 
                                background: artwork.status === 'sold' ? '#F3F4F6' : '#E9FAF0', 
                                color: artwork.status === 'sold' ? '#6B7280' : '#10B981', 
                                padding: '6px 12px', 
                                borderRadius: 'var(--radius-full)', 
                                fontSize: '11px', 
                                fontWeight: 800, 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px' 
                            }}>
                                {artwork.status === 'sold' ? 'Not Available' : 'Available'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                            <button 
                                onClick={toggleWishlist}
                                style={{ padding: '8px', borderRadius: '50%', background: 'white', border: '1px solid #EEE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isWishlisted ? 'var(--primary-coral)' : '#666', transition: 'all 0.3s ease' }}
                            >
                                <Heart size={20} fill={isWishlisted ? 'var(--primary-coral)' : 'none'} />
                            </button>
                            <button onClick={handleShare} style={{ padding: '8px', borderRadius: '50%', background: 'white', border: '1px solid #EEE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={20} />
                            </button>
                            {shareNotification && (
                                <div style={{ position: 'absolute', top: '-40px', right: 0, background: 'var(--text-dark)', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                    Link copied!
                                </div>
                            )}
                        </div>
                    </div>

                    <h1 className="detail-title" style={{ fontSize: '48px', marginBottom: '8px', wordBreak: 'break-word' }}>{artwork.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', overflow: 'hidden' }}>
                            {artwork.artist?.avatar ? <img src={artwork.artist.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (artwork.artist?.name ? artwork.artist.name.charAt(0).toUpperCase() : 'U')}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                by <span style={{ color: 'var(--soft-purple)', fontWeight: 700 }}>{artwork.artist?.name || 'Unknown Artist'}</span>
                                {artwork.artist?.brandLogo && (
                                    <img src={artwork.artist.brandLogo} style={{ height: '24px', borderRadius: '4px', border: '1px solid #EEE' }} title="Artist Brand" />
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="glass detail-price-card" style={{ padding: '32px', borderRadius: 'var(--radius-md)', marginBottom: '32px', background: 'var(--bg-cream)' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '36px', fontWeight: 800 }}>₹{artwork.price ? Math.floor(Number(artwork.price)).toLocaleString() : '0'}</span>
                        </div>
                        <p style={{ color: 'var(--highlight-green)', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Free shipping across India
                        </p>
                    </div>

                    <p style={{ color: 'var(--text-gray)', lineHeight: 1.8, marginBottom: '40px', fontSize: '16px', whiteSpace: 'pre-line' }}>
                        {artwork.description || 'No description provided by the artist.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {artwork.status === 'sold' ? (
                            <button className="btn-secondary" style={{ width: '100%', padding: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#9CA3AF', color: 'white', border: 'none', cursor: 'not-allowed' }} disabled>
                                Sold / Out of Stock
                            </button>
                        ) : (
                            <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--soft-purple)', border: 'none', cursor: 'pointer' }}>
                                <ShoppingCart size={22} /> Add to Cart
                            </button>
                        )}
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
                            <p style={{ fontSize: '11px', fontWeight: 600 }}>Home Delivery</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ArtworkDetail;
