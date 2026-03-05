import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ExplorePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(50000); // Changed to INR range
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const res = await api.get('/artworks');
                setArtworks(res.data);
            } catch (error) {
                console.error('Error fetching artworks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    const categories = ['All', 'Paintings', 'Photography', '3D Art', 'Illustrations', 'Digital Art'];

    // Filter artworks based on state
    const filteredArtworks = artworks.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (art.artist?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
        const matchesPrice = (art.price || 0) <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ padding: '40px 0', minHeight: '80vh' }}
        >
            <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Explore the <span className="gradient-text">Gallery</span></h1>
                <p style={{ color: 'var(--text-gray)' }}>Discover the next big thing in the digital art world</p>
            </div>

            {/* Filters Section */}
            <div className="glass filter-container" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                <div className="search-filter" style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', background: '#F3F4F6', padding: '12px 20px', borderRadius: 'var(--radius-md)' }}>
                    <Search size={20} color="#999" />
                    <input
                        type="text"
                        placeholder="Search by title, artist or tags..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '15px' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid #EEE' }}>
                        <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Max Price: ₹{priceRange}</span>
                        <input
                            type="range"
                            min="100"
                            max="100000"
                            step="100"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            style={{ width: '100px', accentColor: 'var(--primary-coral)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Category Chips */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '10px 24px',
                            borderRadius: 'var(--radius-full)',
                            background: selectedCategory === cat ? 'var(--primary-coral)' : 'white',
                            color: selectedCategory === cat ? 'white' : 'var(--text-gray)',
                            border: '1px solid',
                            borderColor: selectedCategory === cat ? 'var(--primary-coral)' : '#EEE',
                            whiteSpace: 'nowrap',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Artwork Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--primary-coral)" />
                </div>
            ) : filteredArtworks.length > 0 ? (
                <div className="grid-artwork">
                    {filteredArtworks.map((art) => (
                        <motion.div
                            key={art._id}
                            whileHover={{ y: -10 }}
                            className="glass"
                            style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}
                        >
                            <Link to={`/artwork/${art._id}`}>
                                <div style={{ position: 'relative', height: '320px' }}>
                                    <img src={art.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={art.title} />
                                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.95)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)' }}>
                                        ₹{art.price}
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '11px', color: 'white', fontWeight: 600 }}>
                                        {art.category}
                                    </div>
                                </div>
                            </Link>
                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '20px' }}>{art.title}</h3>
                                        <button style={{ color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}><Search size={18} /></button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary-coral)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                            {art.artist?.name ? art.artist.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span style={{ fontSize: '14px', color: 'var(--text-gray)' }}>by <strong>@{art.artist?.name || 'Unknown'}</strong></span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                    <Link to={`/artwork/${art._id}`} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '14px', textAlign: 'center' }}>View Details</Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-gray)' }}>
                    <p>No artworks found matching your criteria.</p>
                </div>
            )}
        </motion.div>
    );
};

export default ExplorePage;
