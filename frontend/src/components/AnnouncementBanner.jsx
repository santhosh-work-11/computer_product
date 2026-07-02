import React, { useEffect, useState } from 'react';

const AnnouncementBanner = () => {
  const [bannerText, setBannerText] = useState(localStorage.getItem('admin_banner_text') || 'Futuristic Summer Drop: Code GAMER2026 for 10% off!');

  useEffect(() => {
    const handleStorage = () => {
      setBannerText(localStorage.getItem('admin_banner_text') || 'Futuristic Summer Drop: Code GAMER2026 for 10% off!');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!bannerText) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: 700,
      textAlign: 'center',
      padding: '8px 16px',
      position: 'relative',
      zIndex: 1005,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#ffffff', borderRadius: '50%', animation: 'ping 1.5s infinite' }} />
      <span>{bannerText}</span>
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          70%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBanner;
