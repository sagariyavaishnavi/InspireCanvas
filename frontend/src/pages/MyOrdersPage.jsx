import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyOrdersPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // Cancel/Return Modal States
    const [selectedOrderForAction, setSelectedOrderForAction] = useState(null);
    const [actionType, setActionType] = useState(''); // 'cancel' or 'return'
    const [feedbackReason, setFeedbackReason] = useState('Changed my mind');
    const [customFeedbackNotes, setCustomFeedbackNotes] = useState('');
    const [showActionModal, setShowActionModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showMessage = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyOrders();
    }, [user, navigate]);

    const fetchMyOrders = async () => {
        try {
            const res = await api.get('/orders/my-orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleActionSubmit = async () => {
        if (!selectedOrderForAction || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const endpoint = `/orders/${selectedOrderForAction._id}/${actionType}`;
            const fullReason = `${feedbackReason}${customFeedbackNotes ? ': ' + customFeedbackNotes : ''}`;
            
            await api.put(endpoint, { reason: fullReason });
            showMessage(`Order ${actionType === 'cancel' ? 'cancelled' : 'returned'} successfully!`, 'success');
            setShowActionModal(false);
            setSelectedOrderForAction(null);
            setCustomFeedbackNotes('');
            fetchMyOrders();
        } catch (err) {
            console.error(err);
            showMessage(`Failed to ${actionType} order.`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary-coral)" />
            </div>
        );
    }

    return (
        <div className="container-wide" style={{ padding: '60px 24px', minHeight: '80vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/" style={{ color: 'var(--text-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #EEE', background: 'white' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '32px', marginBottom: '4px', fontFamily: 'Outfit', fontWeight: 800 }}>Your Orders</h1>
                        <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>Track your purchased drawings, cancel active orders, or request returns.</p>
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {orders.filter(order => order.status !== 'cancelled' && order.status !== 'returned').length === 0 ? (
                        <div style={{ padding: '80px 24px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1px solid #EEE', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ width: '80px', height: '80px', background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--text-gray)' }}>
                                <ShoppingBag size={36} />
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Orders Found</h2>
                            <p style={{ color: 'var(--text-gray)', fontSize: '15px', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>You haven't ordered any artwork yet. Browse our premium galleries to find drawings you love.</p>
                            <Link to="/explore" className="btn-primary" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', border: 'none' }}>
                                Explore Gallery
                            </Link>
                        </div>
                    ) : (
                        orders
                            .filter(order => order.status !== 'cancelled' && order.status !== 'returned')
                            .map((order) => (
                            <div key={order._id} className="glass" style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #EEE', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #EEE', paddingBottom: '20px', marginBottom: '24px' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.5px' }}>ORDER ID</p>
                                        <p style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'monospace' }}>#{order._id}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.5px' }}>DATE PLACED</p>
                                        <p style={{ fontWeight: 700, fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.5px' }}>TOTAL AMOUNT</p>
                                        <p style={{ fontWeight: 800, fontSize: '16px', color: 'var(--primary-coral)' }}>₹{order.totalAmount ? Math.floor(order.totalAmount).toLocaleString() : '0'}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.5px' }}>STATUS</p>
                                        <span style={{
                                            background: order.status === 'cancelled' ? '#FEE2E2' : order.status === 'returned' ? '#FEF3C7' : '#E9FAF0',
                                            color: order.status === 'cancelled' ? '#EF4444' : order.status === 'returned' ? '#D97706' : '#10B981',
                                            padding: '6px 14px',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'inline-block'
                                        }}>
                                            {order.status || 'placed'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                            {item.artwork ? (
                                                <>
                                                    <img src={item.artwork.image} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #EEE' }} alt={item.artwork.title} />
                                                    <div style={{ flex: 1 }}>
                                                        <h4 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{item.artwork.title}</h4>
                                                        <p style={{ fontSize: '14px', color: 'var(--text-gray)' }}>Price: ₹{Math.floor(item.price).toLocaleString()}</p>
                                                    </div>
                                                    <Link to={`/artwork/${item.artwork._id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                                                        Buy Again
                                                    </Link>
                                                </>
                                            ) : (
                                                <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>Deleted Artwork</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Cancel / Return Actions */}
                                {order.status === 'placed' && (
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', borderTop: '1px solid #EEE', paddingTop: '24px' }}>
                                        <button 
                                            onClick={() => { setSelectedOrderForAction(order); setActionType('cancel'); setFeedbackReason('Changed my mind'); setShowActionModal(true); }}
                                            className="btn-secondary" 
                                            style={{ padding: '10px 20px', fontSize: '13px', border: '1px solid #EF4444', color: '#EF4444', cursor: 'pointer' }}
                                        >
                                            Cancel Order
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedOrderForAction(order); setActionType('return'); setFeedbackReason('Changed my mind'); setShowActionModal(true); }}
                                            className="btn-primary" 
                                            style={{ padding: '10px 20px', fontSize: '13px', background: 'var(--soft-purple)', border: 'none', cursor: 'pointer' }}
                                        >
                                            Return Order
                                        </button>
                                    </div>
                                )}

                                {order.status === 'cancelled' && (
                                    <div style={{ marginTop: '24px', padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #EEE', fontSize: '14px' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Cancellation Feedback:</span> {order.cancelReason}
                                    </div>
                                )}

                                {order.status === 'returned' && (
                                    <div style={{ marginTop: '24px', padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #EEE', fontSize: '14px' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Return Feedback:</span> {order.returnReason}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Cancel/Return Feedback Question Modal */}
            <AnimatePresence>
                {showActionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: 'white', padding: '32px', borderRadius: '24px', maxWidth: '480px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
                        >
                            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', fontFamily: 'Outfit' }}>
                                {actionType === 'cancel' ? 'Cancel Your Order' : 'Return Your Order'}
                            </h3>
                            <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                                Please let us know the reason for your {actionType === 'cancel' ? 'cancellation' : 'return'} request.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Why are you requesting this?</label>
                                    <select 
                                        value={feedbackReason} 
                                        onChange={(e) => setFeedbackReason(e.target.value)}
                                        style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #EEE', outline: 'none', background: '#F9FAFB', fontSize: '15px' }}
                                    >
                                        <option value="Ordered by mistake">Ordered by mistake</option>
                                        <option value="Changed my mind">Changed my mind</option>
                                        <option value="Damaged product">Damaged product</option>
                                        <option value="Delivery was delayed">Delivery was delayed</option>
                                        <option value="Found better alternative">Found better alternative</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Additional Notes (Optional)</label>
                                    <textarea 
                                        rows="3" 
                                        placeholder="Add any extra comments..."
                                        value={customFeedbackNotes}
                                        onChange={(e) => setCustomFeedbackNotes(e.target.value)}
                                        style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #EEE', outline: 'none', resize: 'vertical', fontSize: '15px' }}
                                    ></textarea>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => { setShowActionModal(false); setSelectedOrderForAction(null); }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #EEE', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                                <button disabled={isSubmitting} onClick={handleActionSubmit} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: isSubmitting ? '#9CA3AF' : 'var(--primary-coral)', color: 'white', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit Request'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Notification Toast */}
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        style={{
                            position: 'fixed',
                            bottom: '40px',
                            right: '40px',
                            zIndex: 10000,
                            background: notification.type === 'success' ? '#10B981' : '#EF4444',
                            color: 'white',
                            padding: '16px 24px',
                            borderRadius: '12px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: 600,
                            minWidth: '280px'
                        }}
                    >
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyOrdersPage;
