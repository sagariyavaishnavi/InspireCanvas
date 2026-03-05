import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Palette } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: '#fff', borderTop: '1px solid #eee', padding: '80px 0 40px' }}>
            <div className="container">
                <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '20px' }}>
                            <Palette size={32} color="var(--primary-coral)" />
                            <span>Inspire<span style={{ color: 'var(--primary-coral)' }}>Canvas</span></span>
                        </div>
                        <p style={{ color: 'var(--text-gray)', maxWidth: '300px', fontSize: '15px' }}>
                            The world's leading community for digital artists and collectors to showcase and trade unique digital masterpieces.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                            <Instagram size={20} color="var(--text-gray)" />
                            <Twitter size={20} color="var(--text-gray)" />
                            <Facebook size={20} color="var(--text-gray)" />
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '24px' }}>Marketplace</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', color: 'var(--text-gray)' }}>
                            <li><Link to="/explore">All Artworks</Link></li>
                            <li><Link to="/explore">Top Artists</Link></li>
                            <li><Link to="/explore">Collectibles</Link></li>
                            <li><Link to="/explore">Photography</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '24px' }}>Community</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', color: 'var(--text-gray)' }}>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Artist Lounge</a></li>
                            <li><a href="#">Affiliates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '24px' }}>Stay Inspired</h4>
                        <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '16px' }}>Join our newsletter for weekly art drops and tips.</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                style={{ background: '#F3F4F6', border: 'none', padding: '12px 16px', borderRadius: 'var(--radius-sm)', flex: 1, outline: 'none' }}
                            />
                            <button className="btn-primary" style={{ padding: '12px', borderRadius: 'var(--radius-sm)' }}>Join</button>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: '13px' }}>
                    <p>© 2024 InspireCanvas Inc. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
