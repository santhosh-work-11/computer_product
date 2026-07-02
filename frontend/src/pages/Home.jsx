import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Wrench, ShieldCheck, Database, Award, DollarSign, Clock, Zap, ArrowRight, Star, ChevronDown, Check } from 'lucide-react';

const Home = () => {
  // 1. Typing effect state
  const words = ['Custom Gaming Rigs', 'Extreme Workstations', 'Professional Repairs', 'Premium Components'];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const fullWord = words[currentWordIdx];
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        if (currentText === fullWord) {
          setIsDeleting(true);
          setTypingSpeed(1000); // Wait before delete
        } else {
          setTypingSpeed(100);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
          setTypingSpeed(300);
        } else {
          setTypingSpeed(50);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx]);

  // 2. FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: 'How does the Custom PC Builder check compatibility?', a: 'Our system analyzes components against socket parameters, motherboard form factor physical constraints, RAM types (DDR4 vs DDR5), and CPU cooler TDP requirements, warning you instantly of mismatches.' },
    { q: 'What is the standard warranty on prebuilt computers?', a: 'Every prebuilt rig comes with a 2-year parts and labor warranty, fully supported by our certified in-house service department.' },
    { q: 'Do you offer data recovery for failed hard drives?', a: 'Yes! We possess clean-room imaging tools capable of recovering data from corrupted SSD blocks, clicking HDDs, and accidental OS partition deletions.' },
    { q: 'Can I drop off my laptop for repair without booking?', a: 'Absolutely, you can visit our center anytime. However, booking online secures a priority spot on our diagnostics bench.' }
  ];

  // Mock Categories list
  const categories = [
    { name: 'Gaming PCs', slug: 'gaming-pcs', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=300' },
    { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=300' },
    { name: 'Graphics Cards', slug: 'graphics-cards', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300' },
    { name: 'Processors', slug: 'processors', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300' }
  ];

  // Testimonials list
  const testimonials = [
    { name: 'Marcus Vance', role: 'Competitive Esports Player', review: 'The ROG Apex Horizon Gaming PC runs CS2 at a locked 360 FPS in 1440p. Cable routing and thermals are pristine. Highly recommend!', rating: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' },
    { name: 'Sarah Jenkins', role: 'Architect & Designer', review: 'My workstation assembly is a powerhouse. AutoCAD render times decreased by 50% compared to my old workstation. Stellar expert support!', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }
  ];

  // Brand logos list
  const brands = ['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'Kingston', 'Samsung', 'Dell', 'HP', 'Lenovo'];

  return (
    <div style={{ position: 'relative' }}>
      
      {/* 1. Full Screen Hero Section */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.12) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(0,0,0,0) 100%)',
        padding: '60px 24px'
      }}>
        {/* Floating background graphical hardware shapes */}
        <div className="floating-obj" style={{ position: 'absolute', top: '15%', right: '15%', opacity: 0.35, color: 'var(--accent-primary)', zIndex: 0 }}>
          <Cpu size={120} />
        </div>
        <div className="floating-obj-slow" style={{ position: 'absolute', bottom: '20%', left: '10%', opacity: 0.25, color: 'var(--accent-secondary)', zIndex: 0 }}>
          <Wrench size={80} />
        </div>

        <div className="section-container" style={{ textAlign: 'center', zIndex: 5, padding: 0 }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            letterSpacing: '0.15em',
            display: 'block',
            marginBottom: '16px'
          }}>
            Welcome to the Next Generation of Hardware
          </span>
          <h1 style={{
            fontSize: 'calc(2.5rem + 2vw)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            lineHeight: '1.1',
            color: 'var(--text-primary)'
          }}>
            We Build & Fix <br />
            <span className="gradient-text" style={{ minHeight: '1.2em', display: 'inline-block' }}>
              {currentText}
            </span>
            <span style={{ borderRight: '3px solid var(--accent-secondary)', marginLeft: '4px', animation: 'blink 0.7s infinite' }}></span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Experience extreme gaming rigs, specialized workstations, fast parts delivery, and certified chip-level diagnostics under one premium digital roof.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn-primary">
              Shop Components <ArrowRight size={18} />
            </Link>
            <Link to="/pc-builder" className="btn-secondary">
              Build Your Custom PC
            </Link>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '80px',
            flexWrap: 'wrap',
            color: 'var(--text-secondary)',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} style={{ color: 'var(--accent-primary)' }} /> 100% Genuine Products</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign size={18} style={{ color: 'var(--accent-secondary)' }} /> Best Price Guarantee</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} style={{ color: 'var(--accent-primary)' }} /> 24/7 Expert Support</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} style={{ color: 'var(--accent-secondary)' }} /> Next-Day Express Shipping</div>
          </div>
        </div>
      </section>

      {/* 2. Shop Categories Section */}
      <section className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Browse Categories</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Explore high performance hardware components and systems</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((cat, index) => (
            <Link to={`/products?category=${cat.slug}`} key={index} className="premium-card" style={{ height: '300px' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                  className="cat-card-img"
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  zIndex: 5
                }}>
                  <h3 style={{ color: '#ffffff', fontSize: '20px' }}>{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Services Overview Section */}
      <section style={{ background: 'var(--bg-secondary)', transition: 'var(--transition-theme)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Our Services</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Certified hardware builds and technical support</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Cpu size={40} style={{ color: 'var(--accent-primary)' }} />
              <h3>Custom Rig Building</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                We assemble, perform neat cable management, flash the BIOS, run stress tests, and configure optimal fan curves.
              </p>
              <Link to="/services" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--accent-primary)', fontWeight: 600, marginTop: 'auto' }}>
                Learn More <ArrowRight size={16} />
              </Link>
            </div>

            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Wrench size={40} style={{ color: 'var(--accent-secondary)' }} />
              <h3>Computer & Laptop Repair</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Fast diagnostics, water damage mitigation, SSD upgrades, screen replacements, and hinge mechanics reconstruction.
              </p>
              <Link to="/services" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: 'auto' }}>
                Learn More <ArrowRight size={16} />
              </Link>
            </div>

            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Database size={40} style={{ color: 'var(--accent-primary)' }} />
              <h3>Data Recovery Solutions</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Retrieve deleted partitions or recover directories from clicking hard drives, formatted drives, and dead motherboard controllers.
              </p>
              <Link to="/services" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--accent-primary)', fontWeight: 600, marginTop: 'auto' }}>
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Why Choose Us</h2>
          <p style={{ color: 'var(--text-secondary)' }}>We establish the standard in performance and security</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {[
            { t: 'Genuine Products', d: 'Direct authorized retailer for major suppliers.' },
            { t: 'Best Price', d: 'Competitive pricing on components and labor.' },
            { t: 'Warranty Included', d: 'Two year backing on custom-built computers.' },
            { t: 'Certified Technicians', d: 'Experienced chip-level hardware repair diagnostics.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                background: 'rgba(6,182,212,0.1)',
                padding: '6px',
                borderRadius: '8px',
                color: 'var(--accent-primary)'
              }}>
                <Check size={20} />
              </div>
              <div>
                <h4 style={{ marginBottom: '8px' }}>{item.t}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Brand Infinite slider */}
      <section id="brands" style={{
        background: 'var(--bg-secondary)',
        padding: '40px 0',
        overflow: 'hidden',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="infinite-slider-track">
          {/* Double array to make infinite loop continuous */}
          {[...brands, ...brands].map((b, i) => (
            <div key={i} style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text-muted)',
              padding: '0 40px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials Slider */}
      <section className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>What Customer Says</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Hear from esports players, developers, and creators</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {testimonials.map((test, index) => (
            <div key={index} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                "{test.review}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                <img
                  src={test.avatar}
                  alt={test.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '15px' }}>{test.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ Accordion Section */}
      <section style={{ background: 'var(--bg-secondary)', transition: 'var(--transition-theme)' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Clear answers to standard questions</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="glass-panel" 
                style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  borderColor: activeFaq === index ? 'var(--accent-primary)' : 'var(--border-color)'
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '16px'
                  }}
                >
                  {faq.q}
                  <ChevronDown
                    size={20}
                    style={{
                      transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </button>
                {activeFaq === index && (
                  <div style={{
                    padding: '0 24px 20px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blink {
          50% { border-color: transparent; }
        }
        .premium-card:hover .cat-card-img {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};

export default Home;
