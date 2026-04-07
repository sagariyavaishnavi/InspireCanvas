import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const LandingPage = () => {
    const [featuredArtworks, setFeaturedArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/artworks');
                // Get first 4 artworks for featured section
                setFeaturedArtworks(res.data.slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();

        if (window.location.hash === '#how-it-works') {
            setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, []);

    const categories = [
        { name: 'HandWork', icon: <Zap color="#6D5BFF" />, color: '#EBE8FF' },
        { name: 'Pencil Sketch', icon: <Users color="#FF7F66" />, color: '#FFF0ED' },
        { name: 'Canvas Painting', icon: <Shield color="#4ADE80" />, color: '#E9FAF0' },
        { name: 'Glass Painting', icon: <Zap color="#FFCF52" />, color: '#FFF9E6' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="landing-page"
        >
            {/* Hero Section */}
            <section style={{ padding: '80px 0', overflow: 'hidden' }}>
                <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '60px' }}>
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span style={{ background: 'var(--soft-purple-light)', color: 'var(--soft-purple)', padding: '6px 16px', borderRadius: 'full', fontSize: '13px', fontWeight: 600, display: 'inline-block', marginBottom: '24px' }}>
                            NEW COLLECTION LIVE
                        </span>
                        <h1 style={{ fontSize: '64px', lineHeight: 1.1, marginBottom: '24px' }}>
                            Discover the Best <br />
                            <span className="gradient-text">Draw Art</span>
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '40px', maxWidth: '500px' }}>
                            Experience a curated collection of breathtaking hand-drawn masterpieces from world-class creators. Buy, sell, and discover unique drawings.
                        </p>
                        <div className="hero-buttons" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Link to="/explore" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px' }}>
                                Explore Gallery <ArrowRight size={20} />
                            </Link>
                            <Link to="/register" className="btn-secondary" style={{ padding: '16px 32px' }}>
                                Start Creating
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        style={{ position: 'relative', height: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {/* 1. Underlying Oil Canvas (Vibrant Painting choice) */}
                        <motion.div
                            animate={{ rotate: [-2, 2, -2], y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: '5%',
                                left: '-5%',
                                width: '70%',
                                height: '80%',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 1,
                                border: '12px solid #fff',
                                transform: 'rotate(-5deg)'
                            }}
                        >
                            <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1000" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Vibrant Painting Layer 1" />
                        </motion.div>

                        {/* 2. Side-Stacked Oil Canvas (Unique Brushwork choice) */}
                        <motion.div
                            animate={{ rotate: [3, -3, 3], x: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                bottom: '5%',
                                right: '-5%',
                                width: '70%',
                                height: '80%',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 2,
                                border: '12px solid #fff',
                                transform: 'rotate(6deg)'
                            }}
                        >
                            <img src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1000" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Dynamic Painting Layer 2" />
                        </motion.div>

                        {/* 3. Main Featured Oil Masterpiece */}
                        <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10, rotate: 0 }}
                            style={{
                                width: '75%',
                                height: '85%',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-premium)',
                                zIndex: 5,
                                border: '14px solid #fff',
                                transform: 'rotate(-2deg)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1000"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                alt="Main Painting Piece"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Artworks */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Featured Artworks</h2>
                            <p style={{ color: 'var(--text-gray)' }}>Hand-picked selections from our editorial team</p>
                        </div>
                        <Link to="/explore" style={{ color: 'var(--soft-purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ padding: '60px 0', textAlign: 'center' }}>
                            <Loader2 className="animate-spin" size={40} color="var(--soft-purple)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                            <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' }} />
                        </div>
                    ) : (
                        <div className="grid-artwork">
                            {featuredArtworks.length > 0 ? featuredArtworks.map((art) => (
                                <motion.div
                                    key={art._id}
                                    whileHover={{ y: -10 }}
                                    className="glass"
                                    style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'var(--transition-smooth)' }}
                                >
                                    <div style={{ position: 'relative', height: '280px' }}>
                                        <img src={art.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700 }}>
                                            ₹{Math.floor(Number(art.price)).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{art.title}</h3>
                                        <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '20px' }}>by {art.artist?.name || 'Unknown'}</p>
                                        <Link to={`/artwork/${art._id}`} className="btn-primary" style={{ width: '100%', padding: '12px', background: 'var(--text-dark)', display: 'block', textAlign: 'center' }}>
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            )) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-gray)' }}>
                                    <p>No artworks available at the moment. Check back soon!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Browse by Category */}
            <section style={{ padding: '80px 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Browse by Category</h2>
                    <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="glass"
                                style={{ padding: '40px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                            >
                                <div style={{ width: '60px', height: '60px', background: cat.color, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    {cat.icon}
                                </div>
                                <h4 style={{ fontSize: '18px' }}>{cat.name}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="promo-section" style={{ padding: '80px 0', background: 'var(--text-dark)', color: 'white', overflow: 'hidden', position: 'relative' }}>
                <div className="container">
                    <div className="promo-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '60px', alignItems: 'center' }}>
                        <div>
                            <span style={{ color: 'var(--accent-yellow)', fontWeight: 700, textTransform: 'uppercase', fontSize: '14px', letterSpacing: '2px', display: 'block', marginBottom: '16px' }}>For Creators</span>
                            <h2 style={{ fontSize: '48px', color: 'white', marginBottom: '24px', lineHeight: 1.1 }}>Join the World's Elite <span style={{ color: 'var(--primary-coral)' }}>Hand-Work</span> Artists</h2>
                            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', lineHeight: 1.6 }}>
                                Showcase your masterpieces to a global audience of high-end collectors. We handle the logistics, you focus on the art.
                            </p>
                            <Link to="/register" className="btn-primary" style={{ padding: '18px 40px', fontSize: '16px', background: 'var(--primary-coral)', border: 'none', boxShadow: '0 10px 20px rgba(79, 56, 214, 0.4)' }}>
                                Become a Verified Artist
                            </Link>
                        </div>
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                            {/* Panel 1 */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                style={{ width: '100px', height: '400px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                            >
                                <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center' }} alt="Panel 1" />
                            </motion.div>
                            
                            {/* Panel 2 */}
                            <motion.div
                                animate={{ y: [0, -25, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                                style={{ width: '120px', height: '450px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', marginTop: '-25px' }}
                            >
                                <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} alt="Panel 2" />
                            </motion.div>

                            {/* Panel 3 */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
                                style={{ width: '100px', height: '400px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                            >
                                <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }} alt="Panel 3" />
                            </motion.div>
                            
                            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'var(--soft-purple)', filter: 'blur(100px)', opacity: 0.2, zIndex: -1 }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}

            <section id="how-it-works" style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '42px', marginBottom: '16px' }}>How it Works</h2>
                        <p style={{ color: 'var(--text-gray)', maxWidth: '600px', margin: '0 auto' }}>
                            Whether you are an artist or a collector, getting started is easy and secure.
                        </p>
                    </div>

                    <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                                <div style={{ background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', color: 'white', padding: '8px', borderRadius: '8px' }}><Users size={24} /></div>
                                <h3>For Artists</h3>
                            </div>
                            {[
                                { step: '01', title: 'Create & Upload', desc: 'Set up your profile and upload your hand-drawn masterpieces with ease.' },
                                { step: '02', title: 'Set Your Terms', desc: 'Decide between auctions or fixed prices and set your loyalty rates.' },
                                { step: '03', title: 'Grow Your Audience', desc: 'Engage with a global community of collectors and enthusiasts.' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                                    <span className="gradient-text" style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{item.step}</span>
                                    <div>
                                        <h4 style={{ marginBottom: '8px' }}>{item.title}</h4>
                                        <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                                <div style={{ background: 'linear-gradient(135deg, var(--primary-coral), var(--accent-yellow))', color: 'white', padding: '8px', borderRadius: '8px' }}><Shield size={24} /></div>
                                <h3>For Buyers</h3>
                            </div>
                            {[
                                { step: '01', title: 'Discover Unique Art', desc: 'Browse through thousands of exclusive drawings from around the world.' },
                                { step: '02', title: 'Secure Purchase', desc: 'Transaction safety guaranteed via blockchain-verified contracts.' },
                                { step: '03', title: 'Build Collection', desc: 'Showcase your acquired pieces in your personal virtual gallery.' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                                    <span className="gradient-text" style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{item.step}</span>
                                    <div>
                                        <h4 style={{ marginBottom: '8px' }}>{item.title}</h4>
                                        <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default LandingPage;
