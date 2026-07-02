import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X, Cpu, LogOut, LayoutDashboard, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, wishlistItems } = useCart();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Custom PC Builder', path: '/pc-builder' },
    { label: 'Services', path: '/services' },
    { label: 'Repairs', path: '/services#repairs' },
    { label: 'Brands', path: '/#brands' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="glass-navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'var(--transition-theme)'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Cpu size={32} className="gradient-text" style={{ color: 'var(--accent-primary)' }} />
        <span style={{
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>LUXURY TECH</span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="nav-links-desktop" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'var(--transition-smooth)',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Action Operations & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form-desktop" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search parts, laptops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{
              padding: '8px 12px 8px 36px',
              fontSize: '14px',
              width: '200px',
              borderRadius: '20px'
            }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        </form>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Wishlist */}
        <Link to="/wishlist" style={{ position: 'relative', color: 'var(--text-primary)', padding: '6px' }}>
          <Heart size={22} />
          {wishlistItems.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--accent-secondary)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" style={{ position: 'relative', color: 'var(--text-primary)', padding: '6px' }}>
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {/* Auth / Profile */}
        <div style={{ position: 'relative' }}>
          {user ? (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px'
                }}
              >
                <User size={22} />
                <span className="user-name-desktop" style={{ fontSize: '14px', fontWeight: 500 }}>{user.username}</span>
              </button>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  right: 0,
                  top: '40px',
                  width: '200px',
                  padding: '8px 0',
                  zIndex: 1010,
                  borderRadius: '12px'
                }}>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <History size={16} /> Order History
                  </Link>
                  <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: 'var(--accent-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary"
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'none' // Controlled in responsiveness CSS or simple conditional
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Menu */}
      {mobileMenuOpen && (
        <div className="glass-panel" style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 70px)',
          zIndex: 999,
          borderRadius: 0,
          border: 'none',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backdropFilter: 'blur(28px)',
          background: 'var(--bg-primary)'
        }}>
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '36px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
          </form>

          {/* Links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Responsive Inline CSS Injection */}
      <style>{`
        @media (max-width: 992px) {
          .nav-links-desktop { display: none !important; }
          .search-form-desktop { display: none !important; }
          .mobile-menu-toggle { display: block !important; }
          .user-name-desktop { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
