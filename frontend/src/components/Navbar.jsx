import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Palette, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    // Simplistic way to listen to cart changes for the badge
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartCount(cart.length);
        };
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '16px 0' }}>
            <div className="container navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit' }}>
                    <Palette size={32} color="var(--primary-coral)" />
                    <span>Inspire<span style={{ color: 'var(--primary-coral)' }}>Canvas</span></span>
                </Link>

                <div className="nav-menu" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <Link to="/explore" style={{ fontWeight: 500 }}>Gallery</Link>
                    <a href="/#how-it-works" onClick={(e) => {
                        if (window.location.pathname === '/') {
                            e.preventDefault();
                            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                            window.history.pushState({}, '', '/#how-it-works');
                        }
                    }} style={{ fontWeight: 500 }}>How it Works</a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="glass search-bar" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'white' }}>
                        <Search size={18} color="#9CA3AF" />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '14px' }}
                        />
                    </div>

                    <Link to="/cart" style={{ position: 'relative' }}>
                        <ShoppingCart size={24} />
                        {cartCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary-coral)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '50%' }}>{cartCount}</span>}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-dark)' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</span>
                            </Link>
                            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }} title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>Join as Artist</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
