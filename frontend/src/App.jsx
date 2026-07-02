import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import AnnouncementBanner from './components/AnnouncementBanner';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import PCBuilder from './pages/PCBuilder';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-primary)' }}>Loading authentication...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-primary)' }}>Loading verification...</div>;
  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* Mouse cursor ambient glow */}
          <CursorGlow />
          
          {/* Announcement Bar */}
          <AnnouncementBanner />
          
          {/* Main App Layout */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            
            <main style={{ flexGrow: 1 }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/pc-builder" element={<PCBuilder />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/login" element={<Login />} />
                
                {/* About & Contact mock pages */}
                <Route path="/about" element={
                  <div className="section-container" style={{ minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem' }}>About Luxury Tech</h1>
                    <p style={{ maxWidth: '600px', color: 'var(--text-secondary)' }}>
                      We are a premier global provider of custom computers and authorized system repairs. Established in 2026, we specialize in high-fidelity computer designs, Liquid Cooling, and Annual Corporate IT maintenance.
                    </p>
                  </div>
                } />
                
                <Route path="/contact" element={
                  <div className="section-container" style={{ minHeight: '60vh' }}>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>Contact Us</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Send a Message</h3>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); e.target.reset(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <input type="text" placeholder="Name" required className="glass-input" />
                          <input type="email" placeholder="Email" required className="glass-input" />
                          <textarea placeholder="Message" required rows="4" className="glass-input" style={{ resize: 'none' }}></textarea>
                          <button type="submit" className="btn-primary">Submit Inquiry</button>
                        </form>
                      </div>
                      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3>Contact Info</h3>
                        <p>📍 Address: 100 Tech Blvd, Silicon Suite, San Jose, CA</p>
                        <p>📞 Phone: +1 (555) 890-7654</p>
                        <p>✉ Email: support@luxurytech.com</p>
                        <p>💬 WhatsApp Support: <a href="https://wa.me/15558907654" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Message Now</a></p>
                        <p>🕒 Business Hours: Mon - Sat: 9:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                } />

                {/* Customer protected routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                } />

                {/* Admin route */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />

                {/* Redirect any unmatched path to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
