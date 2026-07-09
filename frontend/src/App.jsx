import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';

// Lazy loading components for instant initial page loading
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ArtistDashboard = lazy(() => import('./pages/ArtistDashboard'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));

const PageLoader = () => (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary-coral)" />
    </div>
);

function App() {
    const { user } = useAuth();
    const location = useLocation();

    // Show footer if the user is not logged in OR if they are on the homepage ('/')
    const showFooter = !user || location.pathname === '/';

    return (
        <div className="app">
            <ScrollToTop />
            <Navbar />
            <main style={{ minHeight: '70vh' }}>
                <AnimatePresence mode="wait">
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/explore" element={<ExplorePage />} />
                            <Route path="/artwork/:id" element={<ArtworkDetail />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/dashboard" element={<ArtistDashboard />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/my-orders" element={<MyOrdersPage />} />
                        </Routes>
                    </Suspense>
                </AnimatePresence>
            </main>
            {showFooter && <Footer />}
        </div>
    );
}

export default App;
