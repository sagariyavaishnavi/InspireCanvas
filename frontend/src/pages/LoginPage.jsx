import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Palette, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [role, setRole] = useState('artist');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user } = useAuth();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || (role === 'artist' ? '/dashboard' : '/explore');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            // Note: Our AuthContext handles its own redirection right now.
            // But we will allow it to process and then fall back if needed.
            await login(email, password, redirectUrl);
            // The actual navigate logic inside AuthContext should handle redirection.
            // If we want exact redirect URL passthrough, AuthContext needs an update.
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Check your credentials.');
        } finally {
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
                    <button
                        style={{ flex: 1, padding: '20px', background: 'white', color: 'var(--primary-coral)', borderBottom: '2px solid var(--primary-coral)' }}
                    >
                        Login
                    </button>
                    <Link to="/register" style={{ flex: 1, padding: '20px', background: 'transparent', color: '#999', textAlign: 'center', textDecoration: 'none' }}>
                        Register
                    </Link>
                </div>

                <div className="auth-card" style={{ padding: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-gray)' }}>Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600 }}>Password</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                <Lock size={18} color="#9CA3AF" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Login'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
                            Don't have an account yet? <Link to="/register" style={{ color: 'var(--highlight-green)', fontWeight: 700 }}>Sign up for free</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }' }} />
        </motion.div>
    );
};

export default LoginPage;
