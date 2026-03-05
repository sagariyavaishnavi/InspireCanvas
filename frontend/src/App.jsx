import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import ArtworkDetail from './pages/ArtworkDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ArtistDashboard from './pages/ArtistDashboard';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    return (
        <div className="app">
            <Navbar />
            <main>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/artwork/:id" element={<ArtworkDetail />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/dashboard" element={<ArtistDashboard />} />
                    </Routes>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}

export default App;
