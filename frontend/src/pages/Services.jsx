import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Database, Wrench, ShieldAlert, Award, Calendar, Check, Send } from 'lucide-react';
import { isStaticDemo, mockAPI } from '../utils/apiFallback';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    notes: '',
    date: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      if (isStaticDemo) {
        setServices(mockAPI.getServices());
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/products/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBookService = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        notes: '',
        date: ''
      });
    }, 4000);
  };

  // Helper to map dynamic icon names
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu size={32} />;
      case 'Database': return <Database size={32} />;
      case 'ShieldCheck': return <ShieldCheck size={32} />;
      default: return <Wrench size={32} />;
    }
  };

  return (
    <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Technical Solutions</span>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginTop: '10px', marginBottom: '16px' }}>Services & Repairs</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Certified component diagnostics, clean-room physical recovery, and tailor-made desktop integration pipelines.
        </p>
      </div>

      {/* Services Grid cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))',
        gap: '24px'
      }}>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel skeleton" style={{ height: '240px' }} />
          ))
        ) : (
          services.map((serv) => (
            <div key={serv.id} className="glass-panel" style={{
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '1px solid var(--border-color)',
              transition: 'var(--transition-bounce)'
            }}>
              <div style={{ color: 'var(--accent-primary)', background: 'var(--bg-tertiary)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getIcon(serv.icon_name)}
              </div>
              <h3 style={{ fontSize: '20px' }}>{serv.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{serv.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Estimated Rate</span>
                <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--text-primary)' }}>${serv.price}</span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Booking Scheduler Form Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        background: 'var(--bg-secondary)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        transition: 'var(--transition-theme)'
      }} className="booking-panel-container">
        
        {/* Quality Assurances */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
          <h2>Schedule Service & Repair</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Submit your diagnostic request online. Our technicians will analyze details and reserve a testing station bench.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Award size={18} style={{ color: 'var(--accent-primary)' }} /> 100% ESD-Protected Diagnostics Bench</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><ShieldCheck size={18} style={{ color: 'var(--accent-secondary)' }} /> OEM Authorized Spare Components</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Calendar size={18} style={{ color: 'var(--accent-primary)' }} /> No-Fee Rescheduling Support</div>
          </div>
        </div>

        {/* Dynamic Booking form */}
        <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-primary)' }}>
          {bookingSuccess ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '16px',
              color: '#10b981',
              animation: 'fadeIn 0.5s ease'
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={32} />
              </div>
              <h3>Appointment Scheduled!</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px' }}>We have logged your service ticket. A technician will message you shortly to confirm the drop-off time.</p>
            </div>
          ) : (
            <form onSubmit={handleBookService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="glass-input"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="glass-input"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="glass-input"
                />
              </div>

              <select
                name="serviceType"
                required
                value={formData.serviceType}
                onChange={handleChange}
                className="glass-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="">Choose Service Category</option>
                {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
              </select>

              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="glass-input"
                style={{ cursor: 'pointer' }}
              />

              <textarea
                name="notes"
                placeholder="Briefly explain the issue (e.g. Blue screens, water damage details)"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="glass-input"
                style={{ resize: 'none' }}
              />

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                Book Testing Bench <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CSS Anim references */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 576px) {
          .booking-panel-container {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
