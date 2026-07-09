import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Palette, Search, LogOut, Heart, Menu, X, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navbarRef = useRef(null);

    // Listen to scroll events to apply capsule styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Listen to clicks outside the navbar to close the mobile menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Listen to cart changes for the badge and list
    useEffect(() => {
        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(cart);
            setCartCount(cart.length);
        };
        updateCart();
        window.addEventListener('storage', updateCart);
        return () => window.removeEventListener('storage', updateCart);
    }, []);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMobileMenuOpen(false);
        }
    };

    const navbarStyle = isScrolled ? {
        position: 'sticky',
        top: '16px',
        margin: '0 auto',
        width: 'calc(100% - 48px)',
        maxWidth: '1400px',
        borderRadius: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        padding: '12px 24px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
    } : {
        position: 'sticky',
        top: 0,
        margin: 0,
        width: '100%',
        borderRadius: 0,
        borderBottom: '1px solid #eee',
        padding: '16px 0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
    };

    return (
        <nav ref={navbarRef} style={navbarStyle}>
            <div className="container-wide navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit' }}>
                    <Palette size={32} color="var(--primary-coral)" />
                    <span>Inspire<span style={{ color: 'var(--primary-coral)' }}>Canvas</span></span>
                </Link>

                {/* Desktop menu */}
                <div className="nav-menu desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
                    <Link to="/explore" style={{ fontWeight: 500 }}>Gallery</Link>
                    <a href="/#how-it-works" onClick={(e) => {
                        if (window.location.pathname === '/') {
                            e.preventDefault();
                            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState({}, '', '/#how-it-works');
                        }
                    }} style={{ fontWeight: 500 }}>How it Works</a>
                </div>

                {/* Desktop Actions */}
                <div className="nav-actions desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="glass search-bar" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'white', border: '1px solid #E5E7EB' }}>
                        <Search size={18} color="#9CA3AF" />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '14px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link to="/wishlist" style={{ color: 'var(--text-dark)' }}>
                            <Heart size={24} />
                        </Link>
                        <Link 
                            to="/cart"
                            style={{ position: 'relative', color: 'var(--text-dark)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }} 
                            title="Shopping Cart"
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary-coral)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '50%' }}>{cartCount}</span>}
                        </Link>
                        {user && user.role === 'buyer' && (
                            <Link to="/my-orders" style={{ color: 'var(--text-dark)' }} title="My Orders">
                                <ShoppingBag size={24} />
                            </Link>
                        )}
                    </div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link to="/dashboard" className="nav-user-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-dark)' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', overflow: 'hidden', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                    {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
                                </div>
                                <span className="nav-user-name" style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</span>
                            </Link>
                            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }} title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="nav-auth-buttons" style={{ display: 'flex', gap: '8px' }}>
                            <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>Join</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Header Elements: Profile Avatar (only if logged in) + Hamburger Button */}
                <div className="mobile-only" style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
                    {user && (
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-dark)' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', overflow: 'hidden', border: '2px solid white' }}>
                                {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '14px' }} className="nav-user-name">{user.name.split(' ')[0]}</span>
                        </Link>
                    )}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)' }}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel (Slide down dropdown) */}
            {isMobileMenuOpen && (
                <div className="mobile-only mobile-menu-panel" style={{ display: 'none', background: 'white', borderTop: '1px solid #EEE', padding: '20px 24px', position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', flexDirection: 'column', gap: '16px' }}>
                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <Search size={18} color="#9CA3AF" />
                        <input
                            type="text"
                            placeholder="Search artworks..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '14px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontWeight: 600, fontSize: '16px', borderBottom: '1px solid #EEE', paddingBottom: '16px' }}>
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>Home</Link>
                        <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>Gallery</Link>
                        <a href="/#how-it-works" onClick={(e) => {
                            setIsMobileMenuOpen(false);
                            if (window.location.pathname === '/') {
                                e.preventDefault();
                                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }} style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>How it Works</a>
                        {user && user.role === 'buyer' && (
                            <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--primary-coral)', textDecoration: 'none', fontWeight: 700 }}>
                                My Orders
                            </Link>
                        )}
                        <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Heart size={20} /> Wishlist
                        </Link>
                        <Link 
                            to="/cart"
                            onClick={() => setIsMobileMenuOpen(false)} 
                            style={{ color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', fontWeight: 600, fontSize: '16px', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                            <ShoppingCart size={20} /> Cart ({cartCount})
                        </Link>
                    </div>

                    {/* Auth Actions */}
                    {user ? (
                        <button 
                            onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #EF4444', color: '#EF4444', background: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary" style={{ width: '100%', textAlign: 'center', padding: '14px' }}>Login</Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '14px' }}>Join</Link>
                        </div>
                    )}
                </div>
            )}

        </nav>
    );
};

export default Navbar;
