import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Palette, X, Mail } from 'lucide-react';

const Footer = () => {
    const [modalType, setModalType] = useState(null); // 'privacy' | 'terms' | 'cookies' | null
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) {
            setNewsletterSuccess(true);
            setNewsletterEmail('');
            setTimeout(() => setNewsletterSuccess(false), 4000);
        }
    };

    return (
        <footer style={{ background: '#fff', borderTop: '1px solid #f3f4f6', padding: '80px 0 40px' }}>
            <div className="container-wide">
                <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '60px', marginBottom: '60px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '24px' }}>
                            <Palette size={36} color="var(--primary-coral)" />
                            <span>Inspire<span style={{ color: 'var(--primary-coral)' }}>Canvas</span></span>
                        </div>
                        <p style={{ color: 'var(--text-gray)', maxWidth: '340px', fontSize: '15px', lineHeight: 1.6, marginBottom: 0 }}>
                            The world's leading community for digital artists and collectors to showcase and trade unique digital masterpieces.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', padding: 0 }}>
                            <li><Link to="/explore" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = 'var(--text-gray)'}>Gallery</Link></li>
                            <li><Link to="/wishlist" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = 'var(--text-gray)'}>Wishlist</Link></li>
                            <li><Link to="/cart" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = 'var(--text-gray)'}>Shopping Cart</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Account</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', padding: 0 }}>
                            <li><Link to="/dashboard" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = 'var(--text-gray)'}>Artist Dashboard</Link></li>
                            <li><Link to="/login" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = 'var(--text-gray)'}>Login</Link></li>
                            <li><Link to="/register" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = 'var(--text-gray)'}>Register</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</h4>
                        <p style={{ color: 'var(--text-gray)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                            Have any questions or need help with a transaction? Reach out directly to our support team.
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FCFAFF', border: '1px solid #F3E8FF', padding: '16px 20px', borderRadius: '12px' }}>
                            <Mail size={22} color="var(--primary-coral)" style={{ flexShrink: 0 }} />
                            <div style={{ fontSize: '14px', color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span style={{ color: 'var(--text-gray)', display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Contact Support</span>
                                <a href="mailto:inspire.canvas.app7@gmail.com" style={{ color: 'var(--primary-coral)', textDecoration: 'none', fontWeight: 700 }}>inspire.canvas.app7@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom" style={{ borderTop: '1px solid #eee', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#999', fontSize: '13px', flexWrap: 'wrap', gap: '20px' }}>
                    <p style={{ margin: 0 }}>© 2026 InspireCanvas Inc. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button onClick={() => setModalType('privacy')} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '13px', padding: 0, fontWeight: 500, transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = '#999'}>Privacy Policy</button>
                        <button onClick={() => setModalType('terms')} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '13px', padding: 0, fontWeight: 500, transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = '#999'}>Terms of Service</button>
                        <button onClick={() => setModalType('cookies')} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '13px', padding: 0, fontWeight: 500, transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--primary-coral)'} onMouseOut={e => e.target.style.color = '#999'}>Cookies</button>
                    </div>
                </div>
            </div>

            {/* Modal Render */}
            {modalType && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass" style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%', position: 'relative', boxShadow: 'var(--shadow-lg)', color: 'var(--text-dark)' }}>
                        <button onClick={() => setModalType(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                            <X size={20} />
                        </button>
                        
                        {modalType === 'privacy' && (
                            <div>
                                <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary-coral)', fontWeight: 800 }}>Privacy Policy</h3>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6, marginBottom: '16px' }}>
                                    Your privacy is extremely important to us. We collect your profile details (name, email, avatar) to provide personalized services.
                                </p>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6, marginBottom: '16px' }}>
                                    We use SMTP emails via <strong>inspire.canvas.app7@gmail.com</strong> to send secure verification OTPs, password recovery notices, and purchase confirmations.
                                </p>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6 }}>
                                    Your passwords are cryptographically hashed and cannot be read by anyone. We do not share your private data with third parties.
                                </p>
                            </div>
                        )}

                        {modalType === 'terms' && (
                            <div>
                                <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary-coral)', fontWeight: 800 }}>Terms of Service</h3>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6, marginBottom: '12px' }}>
                                    By using InspireCanvas, you agree to comply with the following terms:
                                </p>
                                <ul style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li>You must list only genuine creative works that you own the rights to sell.</li>
                                    <li>Platform fees of 10% are applied to every artwork sold by artists.</li>
                                    <li>Buyers will receive instant email invoices upon successful checkout.</li>
                                    <li>No fraudulent activity or copyright violations are permitted.</li>
                                </ul>
                            </div>
                        )}

                        {modalType === 'cookies' && (
                            <div>
                                <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary-coral)', fontWeight: 800 }}>Cookie Policy</h3>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6, marginBottom: '16px' }}>
                                    InspireCanvas uses cookies and local browser storage to provide core application features.
                                </p>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6 }}>
                                    Specifically, we store authentication tokens to keep you logged in and track items added to your shopping cart or wishlist. No advertising or tracking cookies are used.
                                </p>
                            </div>
                        )}

                        <button onClick={() => setModalType(null)} className="btn-primary" style={{ width: '100%', marginTop: '28px', padding: '14px', border: 'none', cursor: 'pointer' }}>
                            Understood
                        </button>
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{ __html: '.social-icon-btn:hover { background-color: var(--soft-purple-light) !important; color: var(--primary-coral) !important; transform: translateY(-2px); border-color: var(--primary-coral) !important; }' }} />
        </footer>
    );
};

export default Footer;
