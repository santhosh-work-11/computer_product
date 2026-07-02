import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null); // null means closed

  // Curated premium images list
  const galleryItems = [
    { id: 1, title: 'Clean Waterloop Build', tag: 'builds', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Triple Screen Desk Setup', tag: 'setups', url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Workshop GPU Repair', tag: 'repairs', url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Premium Store Main Display', tag: 'store', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'Hardline Liquid Distribution Tube', tag: 'builds', url: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Esports Gaming Station', tag: 'setups', url: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&q=80&w=800' },
    { id: 7, title: 'Customer Rig Handoff', tag: 'deliveries', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
    { id: 8, title: 'Chipset Level SMD Reflow', tag: 'repairs', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' }
  ];

  const tabs = [
    { label: 'All Photos', tag: 'all' },
    { label: 'Store Front', tag: 'store' },
    { label: 'Setups', tag: 'setups' },
    { label: 'PC Builds', tag: 'builds' },
    { label: 'Repairs Desk', tag: 'repairs' },
    { label: 'Customer Deliveries', tag: 'deliveries' }
  ];

  // Filtering calculation
  const filteredItems = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.tag === activeTab);

  // Lightbox operations
  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visual Portfolio</span>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginTop: '10px', marginBottom: '16px' }}>Store & Setup Gallery</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore inside our facility, customized gaming setups, and repair procedures.</p>
      </div>

      {/* Tabs list */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '20px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.tag}
            onClick={() => {
              setActiveTab(tab.tag);
              setLightboxIndex(null);
            }}
            className="btn-tab"
            style={{
              background: activeTab === tab.tag ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' : 'transparent',
              color: activeTab === tab.tag ? '#ffffff' : 'var(--text-secondary)',
              border: activeTab === tab.tag ? 'none' : '1px solid var(--border-color)',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry image grid */}
      <section style={{
        display: 'columns',
        columnWidth: '320px',
        columnGap: '24px',
        width: '100%'
      }} className="gallery-masonry-grid">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(index)}
            className="premium-card"
            style={{
              breakInside: 'avoid',
              marginBottom: '24px',
              cursor: 'pointer',
              display: 'block'
            }}
          >
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src={item.url}
                alt={item.title}
                style={{ width: '100%', display: 'block', height: 'auto', transition: 'var(--transition-smooth)' }}
                className="gallery-img"
              />
              {/* Overlay on hover */}
              <div className="gallery-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(11, 15, 25, 0.5)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0,
                transition: 'var(--transition-smooth)',
                color: '#ffffff',
                padding: '20px',
                textAlign: 'center'
              }}>
                <Eye size={32} style={{ marginBottom: '10px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{item.title}</h3>
                <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'capitalize', marginTop: '4px' }}>{item.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Full screen Lightbox overlay */}
      {lightboxIndex !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(11, 15, 25, 0.95)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3000,
          padding: '24px'
        }} onClick={() => setLightboxIndex(null)}>
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 0, color: '#fff', cursor: 'pointer' }}
          >
            <X size={32} />
          </button>

          {/* Left Navigation */}
          <button
            onClick={handlePrev}
            style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,0.05)', border: 0, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
          >
            <ArrowLeft size={24} />
          </button>

          {/* Image Container */}
          <div style={{ maxWidth: '80%', maxHeight: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredItems[lightboxIndex].url}
              alt=""
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <h3 style={{ color: '#fff', fontSize: '20px' }}>{filteredItems[lightboxIndex].title}</h3>
          </div>

          {/* Right Navigation */}
          <button
            onClick={handleNext}
            style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.05)', border: 0, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      )}

      <style>{`
        .premium-card:hover .gallery-img {
          transform: scale(1.06);
        }
        .premium-card:hover .gallery-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
