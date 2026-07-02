import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our tech newsletter!');
    e.target.reset();
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '60px 24px 20px',
      color: 'var(--text-secondary)',
      transition: 'var(--transition-theme)'
    }}>
      <div className="section-container" style={{
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Info Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Cpu size={28} className="gradient-text" style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>LUXURY TECH</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
            Your premium destination for custom gaming rigs, elite workstations, performance business notebooks, and expert component repair services.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" className="social-link"><Facebook size={20} /></a>
            <a href="#" className="social-link"><Twitter size={20} /></a>
            <a href="#" className="social-link"><Instagram size={20} /></a>
            <a href="#" className="social-link"><Youtube size={20} /></a>
          </div>
        </div>

        {/* Categories Links Column */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Shop Products</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li><Link to="/products?category=gaming-pcs" className="hover-link">Gaming PCs</Link></li>
            <li><Link to="/products?category=laptops" className="hover-link">Laptops</Link></li>
            <li><Link to="/products?category=graphics-cards" className="hover-link">Graphics Cards</Link></li>
            <li><Link to="/products?category=processors" className="hover-link">Processors</Link></li>
            <li><Link to="/products?category=monitors" className="hover-link">Monitors</Link></li>
          </ul>
        </div>

        {/* Services Links Column */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Our Services</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li><Link to="/services" className="hover-link">Custom PC Build</Link></li>
            <li><Link to="/services" className="hover-link">Computer Repair</Link></li>
            <li><Link to="/services" className="hover-link">Data Recovery</Link></li>
            <li><Link to="/services" className="hover-link">Network Setup</Link></li>
            <li><Link to="/services" className="hover-link">Annual Maintenance</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Newsletter</h4>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>Subscribe to get notifications about hot arrivals and exclusive coupon sales.</p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="email"
              required
              placeholder="Your email address"
              className="glass-input"
              style={{ fontSize: '14px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px 16px', justifyContent: 'center' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', marginBottom: '20px' }} />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        gap: '16px'
      }}>
        <span>&copy; {currentYear} Luxury Tech Co. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" className="hover-link">Privacy Policy</a>
          <a href="#" className="hover-link">Terms & Conditions</a>
          <a href="#" className="hover-link">Support center</a>
        </div>
      </div>

      <style>{`
        .social-link {
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }
        .social-link:hover {
          color: var(--accent-primary);
          transform: translateY(-2px);
        }
        .hover-link {
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }
        .hover-link:hover {
          color: var(--text-primary);
          padding-left: 4px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
