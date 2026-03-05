import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Palette, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [role, setRole] = useState('artist');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);
        try {
            const res = await register(name, email, password, role);
            setSuccess(res.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}
        >
            <div className="glass" style={{ width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                    <Link to="/login" style={{ flex: 1, padding: '20px', background: 'transparent', color: '#999', textAlign: 'center', textDecoration: 'none' }}>
                        Login
                    </Link>
                    <button
                        style={{ flex: 1, padding: '20px', background: 'white', color: 'var(--primary-coral)', borderBottom: '2px solid var(--primary-coral)' }}
                    >
                        Register
                    </button>
                </div>

                <div className="auth-card" style={{ padding: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-gray)' }}>Join our community of digital creators</p>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: '12px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                            {success}
                        </div>
                    )}

                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>I want to join as a...</p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                type="button"
                                onClick={() => setRole('artist')}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: role === 'artist' ? '2px solid var(--primary-coral)' : '1px solid #eee',
                                    background: role === 'artist' ? 'var(--bg-cream)' : 'white'
                                }}
                            >
                                <Palette size={24} color={role === 'artist' ? 'var(--primary-coral)' : '#666'} />
                                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>ARTIST</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('buyer')}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: role === 'buyer' ? '2px solid var(--primary-coral)' : '1px solid #eee',
                                    background: role === 'buyer' ? 'var(--bg-cream)' : 'white'
                                }}
                            >
                                <ShoppingBag size={24} color={role === 'buyer' ? 'var(--primary-coral)' : '#666'} />
                                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>BUYER</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                <User size={18} color="#9CA3AF" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%' }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                <Mail size={18} color="#9CA3AF" />
                                <input
                                    type="email"
                                    placeholder="artist@inspirecanvas.com"
                                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Password</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                <Lock size={18} color="#9CA3AF" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <button disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary-coral)', fontWeight: 700 }}>Login here</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }' }} />
        </motion.div>
    );
};

export default RegisterPage;
