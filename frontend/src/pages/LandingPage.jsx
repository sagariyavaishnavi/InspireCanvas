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
        { name: 'Illustrations', icon: <Zap color="#6D5BFF" />, color: '#EBE8FF' },
        { name: 'Photography', icon: <Users color="#FF7F66" />, color: '#FFF0ED' },
        { name: '3D Art', icon: <Shield color="#4ADE80" />, color: '#E9FAF0' },
        { name: 'Digital Art', icon: <Zap color="#FFCF52" />, color: '#FFF9E6' },
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
                            <span className="gradient-text">Digital Art</span>
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '40px', maxWidth: '500px' }}>
                            Experience a curated collection of breathtaking digital masterpieces from world-class creators. Buy, sell, and discover unique digital assets.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'inherit', flexWrap: 'wrap' }}>
                            <Link to="/explore" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px' }}>
                                Explore Gallery <ArrowRight size={20} />
                            </Link>
                            <Link to="/register" className="btn-secondary" style={{ padding: '16px 32px' }}>
                                Start Creating
                            </Link>
                        </div>
                        <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex' }}>
                                {[1, 2, 3].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/40?img=${i + 10}`} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid white', marginLeft: i > 1 ? '-12px' : '0' }} />
                                ))}
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
                                Trusted by <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>2,500+</span> artists worldwide
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ position: 'relative' }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1000"
                            style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
                            alt="Featured Art"
                        />
                        <div className="glass" style={{ position: 'absolute', bottom: '24px', left: '-40px', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-premium)' }}>
                            <div style={{ background: 'var(--highlight-green)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                                <Zap color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Current Volume</p>
                                <p style={{ fontSize: '18px', fontWeight: 800 }}>$5.2B+</p>
                            </div>
                        </div>
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
                                            ₹{art.price}
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
                                { step: '01', title: 'Create & Upload', desc: 'Set up your profile and upload your digital masterpieces with ease.' },
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
                                { step: '01', title: 'Discover Unique Art', desc: 'Browse through thousands of exclusive digital assets from around the world.' },
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
