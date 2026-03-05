import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Upload as UploadIcon,
    Settings as SettingsIcon,
    LogOut,
    Eye,
    TrendingUp,
    DollarSign,
    MoreVertical,
    FileImage,
    Image as ImageIcon,
    Trash2,
    Edit2,
    CheckCircle,
    Bell,
    Lock,
    UserCircle,
    HardDrive,
    Search,
    Filter,
    Loader2,
    Heart,
    Plus,
    X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const ArtistDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Upload Form State
    const [uploadData, setUploadData] = useState({ title: '', description: '', category: 'Digital Art', price: '' });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletableId, setDeletableId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'artist') {
            navigate('/');
            return;
        }
        fetchMyArtworks();
    }, [user, navigate]);

    const fetchMyArtworks = async () => {
        try {
            const res = await api.get('/artworks', { params: { artist: user.id } });
            setArtworks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const submitArtwork = async (status = 'active') => {
        setUploading(true);
        setUploadError('');
        setUploadSuccess('');
        try {
            const formData = new FormData();
            formData.append('title', uploadData.title);
            formData.append('description', uploadData.description);
            formData.append('category', uploadData.category);
            formData.append('price', uploadData.price);
            formData.append('status', status);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editingId) {
                await api.put(`/artworks/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/artworks', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setUploadSuccess(status === 'draft' ? 'Draft Saved Successfully!' : (editingId ? 'Artwork Updated!' : 'Artwork Uploaded Successfully!'));
            setTimeout(() => {
                setUploadSuccess('');
                setActiveTab('manage');
                fetchMyArtworks();
                setUploadData({ title: '', description: '', category: 'Digital Art', price: '' });
                setImageFile(null);
                setEditingId(null);
            }, 1000);
        } catch (error) {
            setUploadError(error.response?.data?.message || 'Upload Failed. Please try again or check photo size.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        submitArtwork('active');
    };

    const handleEdit = (art) => {
        setEditingId(art._id);
        setUploadData({
            title: art.title,
            description: art.description,
            category: art.category,
            price: art.price
        });
        // Note: For editing, we don't automatically download the file back to the input, 
        // we'll treat a null imageFile as "don't change the existing photo"
        setActiveTab('upload');
    };

    const handleSaveDraft = () => {
        if (!uploadData.title || !uploadData.description || !uploadData.price) {
            setUploadError('Please fill missing fields to save a Draft.');
            return;
        }
        submitArtwork('draft');
    };

    const initiateDelete = (id) => {
        setDeletableId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletableId) return;
        try {
            await api.delete(`/artworks/${deletableId}`);
            setArtworks(artworks.filter(art => art._id !== deletableId));
            setShowDeleteModal(false);
            setDeletableId(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete artwork.');
        }
    };

    const renderDashboard = () => {
        const stats = [
            { label: 'Total Pieces', value: artworks.length.toString(), icon: <TrendingUp />, trend: 'Active' },
            { label: 'Published Works', value: artworks.filter(a => a.status === 'active').length.toString(), icon: <CheckCircle size={18} />, trend: 'Live' },
            { label: 'Portfolio Value', value: '₹' + artworks.filter(a => a.status === 'active').reduce((acc, curr) => acc + (curr.price || 0), 0).toLocaleString(), icon: <DollarSign />, trend: 'Estimated' },
        ];

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Portfolio Overview</h1>
                        <p style={{ color: 'var(--text-gray)' }}>Welcome back, {user.name}! Here's a snapshot of your creative business.</p>
                    </div>
                    <button onClick={() => setActiveTab('upload')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', border: 'none' }}>
                        <UploadIcon size={20} /> New Artwork
                    </button>
                </header>

                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (stat.trend === 'Live' || stat.label === 'Published Works') setStatusFilter('active');
                                else if (stat.trend === 'Active' || stat.label === 'Total Pieces') setStatusFilter('All');
                                setActiveTab('manage');
                            }}
                            className="glass upload-guidelines"
                            style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: 'white', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '10px', borderRadius: '12px', backgroundClip: 'text', border: '1px solid #eee' }}>
                                    {stat.icon}
                                </div>
                                <span style={{ color: 'var(--highlight-green)', background: '#E9FAF0', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700 }}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>{stat.label}</p>
                            <h2 style={{ fontSize: '28px' }}>{stat.value}</h2>
                        </div>
                    ))}
                    {/* Explicit Draft Card for Clickability */}
                    <div
                        onClick={() => { setStatusFilter('draft'); setActiveTab('manage'); }}
                        className="glass upload-guidelines"
                        style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: 'white', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '10px', borderRadius: '12px', backgroundClip: 'text', border: '1px solid #eee' }}>
                                <Lock size={20} />
                            </div>
                            <span style={{ color: '#D97706', background: '#FEF3C7', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700 }}>
                                Hidden
                            </span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>Recent Drafts</p>
                        <h2 style={{ fontSize: '28px' }}>{artworks.filter(a => a.status === 'draft').length}</h2>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderManageArtworks = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="manage-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Manage Artworks</h1>
                    <p style={{ color: 'var(--text-gray)' }}>Organize and track your portfolio's performance</p>
                </div>
                <button onClick={() => setActiveTab('upload')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', border: 'none' }}>
                    <Plus size={20} /> Upload New Work
                </button>
            </header>

            <div className="stats-grid" style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div
                    onClick={() => setStatusFilter('All')}
                    style={{ flex: 1, padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid #EEE', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', borderBottom: statusFilter === 'All' ? '3px solid var(--primary-coral)' : '1px solid #EEE' }}
                >
                    <div style={{ background: 'var(--soft-purple-light)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--soft-purple)' }}>
                        <ImageIcon size={20} />
                    </div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginTop: '8px' }}>Total Pieces</p>
                    <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{artworks.length}</h3>
                </div>
                <div
                    onClick={() => setStatusFilter('active')}
                    style={{ flex: 1, padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid #EEE', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', borderBottom: statusFilter === 'active' ? '3px solid var(--primary-coral)' : '1px solid #EEE' }}
                >
                    <div style={{ background: '#E9FAF0', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                        <CheckCircle size={20} />
                    </div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginTop: '8px' }}>Active Listings</p>
                    <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{artworks.filter(a => a.status === 'active').length}</h3>
                </div>
                <div
                    onClick={() => setStatusFilter('draft')}
                    style={{ flex: 1, padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid #EEE', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', borderBottom: statusFilter === 'draft' ? '3px solid var(--primary-coral)' : '1px solid #EEE' }}
                >
                    <div style={{ background: '#FEF3C7', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                        <Lock size={20} />
                    </div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginTop: '8px' }}>Drafts</p>
                    <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{artworks.filter(a => a.status === 'draft').length}</h3>
                </div>
            </div>

            <div className="artwork-table-wrapper glass" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #EEE' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #EEE', padding: '8px 16px', borderRadius: 'var(--radius-sm)', width: '300px' }}>
                        <Search size={16} color="#999" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: '8px', width: '100%', fontSize: '14px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #EEE', outline: 'none' }}
                        >
                            <option value="All">Status: All</option>
                            <option value="active">Active</option>
                            <option value="draft">Drafts</option>
                        </select>
                        <button style={{ padding: '8px', background: 'white', border: '1px solid #EEE', borderRadius: 'var(--radius-sm)' }}><Filter size={18} /></button>
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #EEE' }}>
                            <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>ARTWORK</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>STATUS</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>PRICE</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>DATE ADDED</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artworks
                            .filter(art => {
                                const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
                                const matchesStatus = statusFilter === 'All' || art.status === statusFilter;
                                return matchesSearch && matchesStatus;
                            })
                            .map((art) => (
                                <tr key={art._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <img src={art.image} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '15px' }}>{art.title}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{art.category}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            background: art.status === 'draft' ? '#FEF3C7' : '#E9FAF0',
                                            color: art.status === 'draft' ? '#D97706' : '#10B981',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}>
                                            {art.status === 'draft' ? 'Draft' : 'Published'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontWeight: 700 }}>₹{art.price?.toLocaleString() || 0}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-gray)', fontSize: '14px' }}>{new Date(art.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                            <Link to={`/artwork/${art._id}`} style={{ color: 'var(--text-gray)' }} title="View Details"><Eye size={18} /></Link>
                                            <button onClick={() => handleEdit(art)} style={{ color: 'var(--text-gray)', background: 'none', border: 'none', cursor: 'pointer' }} title="Edit Artwork"><Edit2 size={18} /></button>
                                            <button onClick={() => initiateDelete(art._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }} title="Delete Artwork"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>


        </motion.div>
    );

    const renderUpload = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{editingId ? 'Edit Artwork' : 'Upload New Artwork'}</h1>
                    <p style={{ color: 'var(--text-gray)' }}>{editingId ? 'Update your masterpiece details.' : 'Share your latest masterpiece with the global art community.'}</p>
                </div>
                {editingId && (
                    <button onClick={() => { setEditingId(null); setUploadData({ title: '', description: '', category: 'Digital Art', price: '' }); setImageFile(null); }} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                        Cancel Edit
                    </button>
                )}
            </header>

            <form onSubmit={handleUpload} className="upload-form" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Drag n Drop area */}
                    <div style={{ position: 'relative', border: '2px dashed #DDD', borderRadius: '16px', padding: imageFile ? '0px' : '60px 20px', textAlign: 'center', background: 'var(--bg-cream)', transition: 'all 0.3s ease', overflow: 'hidden', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {imageFile ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex' }}>
                                <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: '100%', minHeight: '350px', objectFit: 'cover', display: 'block' }} />
                                <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={() => setImageFile(null)} style={{ padding: '10px 20px', background: '#EF4444', color: 'white', fontWeight: 600, borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <X size={16} /> Remove
                                    </button>
                                    <label htmlFor="fileUpload" style={{ padding: '10px 20px', background: 'white', color: 'var(--text-dark)', fontWeight: 600, borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'block' }}>
                                        Change Image
                                    </label>
                                </div>
                                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} id="fileUpload" />
                            </div>
                        ) : (
                            <>
                                <div style={{ width: '60px', height: '60px', background: 'var(--soft-purple-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <FileImage color="var(--soft-purple)" size={28} />
                                </div>
                                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Drag & drop files here</h3>
                                <p style={{ color: 'var(--text-gray)', fontSize: '13px', marginBottom: '24px' }}>Support for high-resolution images (JPG, PNG). Max file size 50MB.</p>
                                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} id="fileUpload" required />
                                <label htmlFor="fileUpload" className="btn-primary" style={{ display: 'inline-block', padding: '12px 32px', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', cursor: 'pointer', border: 'none' }}>
                                    Browse Files
                                </label>
                            </>
                        )}
                    </div>

                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #EEE' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Artwork Title</label>
                            <input value={uploadData.title} onChange={e => setUploadData({ ...uploadData, title: e.target.value })} required type="text" placeholder="Give your piece a name..." style={{ width: '100%', padding: '16px', borderRadius: '8px', border: 'none', background: '#F9FAFB', outline: 'none', fontSize: '15px' }} />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Description</label>
                            <textarea value={uploadData.description} onChange={e => setUploadData({ ...uploadData, description: e.target.value })} required rows="5" placeholder="Tell the story behind this artwork..." style={{ width: '100%', padding: '16px', borderRadius: '8px', border: 'none', background: '#F9FAFB', outline: 'none', fontSize: '15px', resize: 'vertical' }}></textarea>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Category</label>
                                <select value={uploadData.category} onChange={e => setUploadData({ ...uploadData, category: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: '8px', border: 'none', background: '#F9FAFB', outline: 'none', fontSize: '15px' }}>
                                    <option>Digital Art</option>
                                    <option>Paintings</option>
                                    <option>3D Art</option>
                                    <option>Photography</option>
                                    <option>Illustrations</option>
                                    <option>Abstract</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Price (INR)</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', borderRadius: '8px' }}>
                                    <span style={{ padding: '0 16px', color: 'var(--text-gray)', fontWeight: 600 }}>₹</span>
                                    <input value={uploadData.price} onChange={e => setUploadData({ ...uploadData, price: e.target.value })} required type="number" min="0" placeholder="0.00" style={{ width: '100%', padding: '16px 16px 16px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '15px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ background: 'var(--soft-purple-light)', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <CheckCircle color="var(--soft-purple)" size={20} />
                            <h4 style={{ fontWeight: 700 }}>Upload Guidelines</h4>
                        </div>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-gray)' }}>
                            <li style={{ display: 'flex', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--soft-purple)', marginTop: '6px' }} /> Minimum 2000px resolution</li>
                            <li style={{ display: 'flex', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--soft-purple)', marginTop: '6px' }} /> Clear copyright ownership</li>
                            <li style={{ display: 'flex', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--soft-purple)', marginTop: '6px' }} /> No explicit or hateful content</li>
                        </ul>
                    </div>

                    {uploadError && (
                        <div style={{ padding: '16px', borderRadius: '12px', background: '#FEE2E2', color: '#B91C1C', marginBottom: '24px', fontSize: '14px', textAlign: 'center', border: '1px solid #FECACA' }}>
                            <strong>Upload Error:</strong> {uploadError}
                        </div>
                    )}{uploadSuccess && <div style={{ padding: '12px', background: '#D1FAE5', color: '#047857', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>{uploadSuccess}</div>}

                    <button disabled={uploading} type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: 700, marginBottom: '16px', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
                        {uploading ? <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} /> : (editingId ? 'UPDATE ARTWORK' : 'PUBLISH ARTWORK')}
                    </button>
                    <button type="button" onClick={handleSaveDraft} disabled={uploading} style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: 600, background: 'white', border: '1px solid #EEE', cursor: uploading ? 'not-allowed' : 'pointer', borderRadius: 'var(--radius-md)', color: 'var(--text-dark)', transition: 'var(--transition-smooth)', display: 'block' }} onMouseOver={(e) => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#DDD' }} onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#EEE' }}>
                        {artworks.find(a => a._id === editingId)?.status === 'draft' || !editingId ? 'Save as Draft' : 'Switch to Draft'}
                    </button>
                </div>
            </form>
        </motion.div>
    );

    const renderSettings = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '800px' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Settings</h1>
                <p style={{ color: 'var(--text-gray)' }}>Manage your profile, account preferences, and notification settings.</p>
            </header>

            <section style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Profile</h3>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px', fontWeight: 'bold', marginBottom: '16px', margin: '0 auto', position: 'relative' }}>
                            {user.name.charAt(0)}
                            <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'white', padding: '6px', borderRadius: '50%', border: '2px solid #EEE', color: 'var(--text-gray)', cursor: 'pointer' }}>
                                <FileImage size={16} />
                            </div>
                        </div>
                        <span style={{ color: 'var(--primary-coral)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Change Avatar</span>
                        <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>JPG, GIF or PNG. Max size 800K</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Display Name</label>
                            <input type="text" defaultValue={user.name} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #EEE', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Bio</label>
                            <textarea rows="4" placeholder="Brief description for your profile. This is public." style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #EEE', outline: 'none', resize: 'vertical' }}></textarea>
                            <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px', fontStyle: 'italic' }}>Brief description for your profile. This is public.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Account</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Email Address</label>
                        <input type="email" defaultValue={user.email} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #EEE', outline: 'none', background: '#F9FAFB' }} readOnly />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Current Password</label>
                        <input type="password" defaultValue="••••••••••••" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #EEE', outline: 'none', background: '#F9FAFB' }} readOnly />
                    </div>
                </div>
                <div style={{ background: '#F9FAFB', border: '1px solid #EEE', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Change Password</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Regularly updating your password keeps your account secure.</p>
                    </div>
                    <button style={{ padding: '8px 24px', background: 'white', border: '1px solid #DDD', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Update</button>
                </div>
            </section>

            <section style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Notifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ padding: '8px', background: 'var(--soft-purple-light)', color: 'var(--soft-purple)', borderRadius: '8px' }}><Bell size={20} /></div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>New Comments</h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Notify me when someone comments on my projects.</p>
                        </div>
                        <div style={{ width: '40px', height: '24px', background: 'var(--primary-coral)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ padding: '8px', background: '#FFF0ED', color: 'var(--primary-coral)', borderRadius: '8px' }}><Heart size={20} /></div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Project Likes</h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Receive an alert when your artwork gets featured or liked.</p>
                        </div>
                        <div style={{ width: '40px', height: '24px', background: 'var(--primary-coral)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ border: '1px solid #FEE2E2', background: '#FEF2F2', padding: '24px', borderRadius: '12px', marginTop: '40px' }}>
                <h4 style={{ color: '#EF4444', fontWeight: 700, marginBottom: '8px', fontSize: '16px' }}>Danger Zone</h4>
                <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '20px', opacity: 0.8 }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button style={{ padding: '10px 24px', background: 'white', border: '1px solid #EF4444', color: '#EF4444', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}>Delete Account</button>
            </section>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px', borderTop: '1px solid #EEE', paddingTop: '24px' }}>
                <button style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--text-gray)', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button className="btn-primary" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, var(--primary-coral), var(--soft-purple))', border: 'none' }}>Save Changes</button>
            </div>
        </motion.div>
    );

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary-coral)" />
        </div>
    );

    return (
        <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
            {/* Sidebar */}
            <div className="dashboard-sidebar" style={{ width: '280px', background: 'white', borderRight: '1px solid #EEE', padding: '32px 0', display: 'flex', flexDirection: 'column' }}>
                <nav className="sidebar-nav" style={{ flex: 1 }}>
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
                        { id: 'manage', label: 'Manage Artworks', icon: <FileImage size={20} /> },
                        { id: 'upload', label: 'Upload Artwork', icon: <UploadIcon size={20} /> },
                        { id: 'divider', isDivider: true },
                        { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
                    ].map((item, index) => {
                        if (item.isDivider) {
                            return (
                                <div key={index} className="nav-divider" style={{ margin: '24px 32px 12px', fontSize: '11px', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '1px' }}>
                                    PREFERENCES
                                </div>
                            );
                        }
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={isActive ? 'active' : ''}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 32px',
                                    background: isActive ? 'var(--soft-purple-light)' : 'transparent',
                                    color: isActive ? 'var(--primary-coral)' : 'var(--text-gray)',
                                    border: 'none',
                                    textAlign: 'left',
                                    fontWeight: isActive ? 700 : 600,
                                    cursor: 'pointer',
                                    transition: 'var(--transition-smooth)',
                                    borderRight: isActive ? '4px solid var(--primary-coral)' : '4px solid transparent'
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="dashboard-content" style={{ flex: 1, padding: '48px 64px', overflowY: 'auto' }}>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'manage' && renderManageArtworks()}
                {activeTab === 'upload' && renderUpload()}
                {activeTab === 'settings' && renderSettings()}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
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
                            style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
                        >
                            <div style={{ width: '64px', height: '64px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#EF4444' }}>
                                <Trash2 size={32} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Confirm Deletion</h3>
                            <p style={{ color: 'var(--text-gray)', fontSize: '15px', marginBottom: '32px' }}>Are you sure you want to delete this artwork? This action cannot be undone.</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #EEE', background: 'white', fontWeight: 600 }}>Cancel</button>
                                <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 600 }}>Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}} />
        </div>
    );
};

export default ArtistDashboard;
