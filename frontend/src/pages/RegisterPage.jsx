import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Palette, ShoppingBag, ArrowRight, Loader2, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RegisterPage = () => {
    const [verifyMode, setVerifyMode] = useState(false);
    const [role, setRole] = useState('artist');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!agreedToTerms) {
            setError('Please check this to agree to Terms & Conditions');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await register(name, email, password, role);
            setSuccess(res.message);
            // Switch to verification code entry mode
            setVerifyMode(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/auth/verify-email', { email, otp });
            setSuccess(res.data.message || 'Email verified successfully! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify email. Please check your verification OTP.');
            setIsSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        try {
            const res = await api.post('/auth/resend-verification', { email });
            setSuccess(res.data.message || 'Verification OTP resent successfully.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification OTP.');
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
                    <Link to="/login" style={{ flex: 1, padding: '20px', background: 'transparent', color: '#999', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Login
                    </Link>
                    <button
                        onClick={() => { setVerifyMode(false); setError(''); setSuccess(''); }}
                        style={{
                            flex: 1,
                            padding: '20px',
                            background: 'white',
                            color: 'var(--primary-coral)',
                            borderBottom: '2px solid var(--primary-coral)',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Register
                    </button>
                </div>

                <div className="auth-card" style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>
                            {verifyMode ? 'Verify Email' : 'Create Account'}
                        </h2>
                        <p style={{ color: 'var(--text-gray)' }}>
                            {verifyMode ? `Enter the 6-digit OTP code sent to ${email}` : 'Join our community of digital creators'}
                        </p>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: '12px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>
                            {success}
                        </div>
                    )}

                    {!verifyMode ? (
                        <>
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
                                            background: role === 'artist' ? 'var(--bg-cream)' : 'white',
                                            cursor: 'pointer'
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
                                            background: role === 'buyer' ? 'var(--bg-cream)' : 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <ShoppingBag size={24} color={role === 'buyer' ? 'var(--primary-coral)' : '#666'} />
                                        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>BUYER</span>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                                            minLength="8"
                                            maxLength="16"
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$"
                                            title="Password must be 8-16 characters and include one uppercase letter, one lowercase letter, one digit, and one special character."
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '8px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="termsCheckbox" 
                                        checked={agreedToTerms} 
                                        onChange={(e) => setAgreedToTerms(e.target.checked)} 
                                        style={{ marginTop: '3px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="termsCheckbox" style={{ fontSize: '13px', color: 'var(--text-gray)', cursor: 'pointer', lineHeight: '1.4' }}>
                                        I agree to the <span onClick={() => setShowTermsModal(true)} style={{ color: 'var(--primary-coral)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Terms & Conditions</span> and privacy policy.
                                    </label>
                                </div>

                                <button disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'} <ArrowRight size={20} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Verification Code (OTP)</label>
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
                                        title="Enter the 6-digit verification code sent to your email address"
                                    />
                                </div>
                            </div>

                            <button disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Verify Account'} <ArrowRight size={20} />
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                                <button type="button" onClick={handleResendOTP} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                    Resend Verification
                                </button>
                                <button type="button" onClick={() => { setVerifyMode(false); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                    Edit Registration
                                </button>
                            </div>
                        </form>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary-coral)', fontWeight: 700 }}>Login here</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions Modal */}
            <AnimatePresence>
                {showTermsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-lg)' }}
                        >
                            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', fontFamily: 'Outfit' }}>Terms & Conditions</h3>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px', fontSize: '14px', color: 'var(--text-gray)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <p><strong>1. Introduction</strong><br/>Welcome to InspireCanvas. By registering, you agree to comply with our code of conduct, artist terms, and buyer agreements.</p>
                                <p><strong>2. 24-Hour Online Refund Policy</strong><br/>If the payment is made online (Credit/Debit Card, Netbanking, UPI) and you cancel your order or request a return, <strong>your full order value will be refunded and credited back to you within 24 hours</strong>.</p>
                                <p><strong>3. Artwork Authenticity</strong><br/>Artists must guarantee the authenticity and availability of the drawings uploaded to the platform.</p>
                                <p><strong>4. Account Safety</strong><br/>You are responsible for keeping your login credentials secure. Unverified users will not be allowed to trade.</p>
                            </div>
                            <button 
                                onClick={() => { setShowTermsModal(false); setAgreedToTerms(true); }} 
                                className="btn-primary" 
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--soft-purple)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Agree and Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }' }} />
        </motion.div>
    );
};

export default RegisterPage;
