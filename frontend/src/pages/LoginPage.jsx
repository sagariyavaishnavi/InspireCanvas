import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
    const [authMode, setAuthMode] = useState('login'); // login, forgot, otp
    const [role, setRole] = useState('artist');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || (role === 'artist' ? '/dashboard' : '/explore');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);
        try {
            await login(email, password, redirectUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setSuccessMessage(res.data.message || 'OTP verification code sent successfully to your email.');
            setAuthMode('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP code. Please check the email address.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/auth/reset-password', { email, otp, newPassword });
            setSuccessMessage(res.data.message || 'Password reset successfully. You can now login.');
            setAuthMode('login');
            setPassword('');
            setOtp('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please verify the OTP code.');
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
            <div className="glass" style={{ width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'white' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                    <button
                        onClick={() => { setAuthMode('login'); setError(''); setSuccessMessage(''); }}
                        style={{
                            flex: 1,
                            padding: '20px',
                            background: 'white',
                            color: authMode === 'login' ? 'var(--primary-coral)' : '#999',
                            borderBottom: authMode === 'login' ? '2px solid var(--primary-coral)' : '2px solid transparent',
                            fontWeight: authMode === 'login' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            border: 'none'
                        }}
                    >
                        Login
                    </button>
                    <Link to="/register" style={{ flex: 1, padding: '20px', background: 'transparent', color: '#999', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Register
                    </Link>
                </div>

                <div className="auth-card" style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>
                            {authMode === 'login' && 'Welcome Back'}
                            {authMode === 'forgot' && 'Forgot Password?'}
                            {authMode === 'otp' && 'Verify Email'}
                        </h2>
                        <p style={{ color: 'var(--text-gray)' }}>
                            {authMode === 'login' && 'Enter your credentials to access your account'}
                            {authMode === 'forgot' && "Enter your email and we'll send a 6-digit OTP code"}
                            {authMode === 'otp' && `Enter the 6-digit code sent to ${email}`}
                        </p>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div style={{ padding: '12px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>
                            {successMessage}
                        </div>
                    )}

                    {authMode === 'login' && (
                        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <button type="button" onClick={() => { setAuthMode('forgot'); setError(''); setSuccessMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--soft-purple)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>

                            <button disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Login'} <ArrowRight size={20} />
                            </button>
                        </form>
                    )}

                    {authMode === 'forgot' && (
                        <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                            <button disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset OTP'} <ArrowRight size={20} />
                            </button>
                            <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                <button type="button" onClick={() => { setAuthMode('login'); setError(''); setSuccessMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {authMode === 'otp' && (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Verification OTP</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                    <KeyRound size={18} color="#9CA3AF" />
                                    <input
                                        type="text"
                                        placeholder="123456"
                                        style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%' }}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength="6"
                                        pattern="\d{6}"
                                        title="Enter the 6-digit verification code sent to your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>New Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                    <Lock size={18} color="#9CA3AF" />
                                    <input
                                        type="password"
                                        placeholder="New Password (8-16 chars)"
                                        style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%' }}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength="8"
                                        maxLength="16"
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$"
                                        title="Password must be 8-16 characters and include one uppercase letter, one lowercase letter, one digit, and one special character."
                                    />
                                </div>
                            </div>

                            <button disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'} <ArrowRight size={20} />
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                                <button type="button" onClick={() => { setAuthMode('forgot'); setError(''); setSuccessMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                    Resend OTP
                                </button>
                                <button type="button" onClick={() => { setAuthMode('login'); setError(''); setSuccessMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

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
