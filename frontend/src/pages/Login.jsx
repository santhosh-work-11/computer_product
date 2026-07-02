import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ShieldAlert, Cpu } from 'lucide-react';

const Login = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after login
  const from = location.state?.from?.pathname || '/';

  // Toggle register vs login
  const [isRegister, setIsRegister] = useState(false);

  // Form inputs state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation status
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!username.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all registration fields.');
        }
        await register(username.trim(), email.trim(), password.trim());
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter email and password.');
        }
        await login(email.trim(), password.trim());
      }
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container" style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.08) 0%, rgba(0,0,0,0) 60%)'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Brand Logo Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Cpu size={40} className="gradient-text" style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {isRegister ? 'Register to save custom builds and orders' : 'Log into your premium technology account'}
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            padding: '10px 14px',
            borderRadius: '10px',
            color: '#ef4444',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <User size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
            </div>
          )}

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '40px' }}
            />
            <Mail size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '40px' }}
            />
            <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ justifyContent: 'center', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Toggler register vs login link */}
        <div style={{ textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage('');
            }}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--accent-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </div>

        {/* Default Seed Info Banner */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          textAlign: 'center'
        }}>
          <span>Default Demo Accounts:</span>
          <span>Admin: <b>admin@store.com</b> (pass: <b>admin123</b>)</span>
          <span>User: <b>john@gmail.com</b> (pass: <b>password123</b>)</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
