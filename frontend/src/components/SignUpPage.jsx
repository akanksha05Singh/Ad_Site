import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

/* ─────────────────────────────────────────────────────────────────
   SignUpPage — Full-page registration form matching sign-up reference.
   5 stacked pill inputs: Name*, Email*, Password*, ReType Password*, Role*
   Domain guard: 'Site Administrator' role → must use @freeads.no email.
───────────────────────────────────────────────────────────────────*/
export default function SignUpPage({ onAuthSuccess, onGoSignIn, onGoHome }) {
  const [view, setView] = useState('signup'); // 'signup' | 'verify'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    retypePassword: '',
    role: 'user',
  });
  const [verifyCode, setVerifyCode] = useState('');
  const [pendingUserId, setPendingUserId] = useState(null);
  const [mockToken, setMockToken] = useState(null); // MVP only: surface token in UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Name is required.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.retypePassword) return 'Passwords do not match.';
    if (!formData.role) return 'Role is required.';
    // Client-side domain pre-check for admin
    const domain = formData.email.split('@')[1];
    if (domain === 'freeads.no' && formData.email !== 'admin@freeads.no') {
      return 'Not all @freeads.no emails are accepted. Only admin@freeads.no is allowed.';
    }
    if (formData.role === 'admin') {
      if (formData.email !== 'admin@freeads.no') {
        return 'Administrator accounts can only be registered using admin@freeads.no.';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      if (data.message === 'Verification required') {
        setPendingUserId(data.userId);
        setMockToken(data.verificationToken);
        setView('verify');
        setSuccess('Check your email for the verification code.');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Account created! Signing you in…');
        setTimeout(() => {
          onAuthSuccess(data.user, data.token);
        }, 800);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!verifyCode) return setError('Verification code is required.');

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: pendingUserId, code: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('Email verified! Signing you in…');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'Regular User' },
    { value: 'admin', label: 'Site Administrator' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Minimal Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}>
        <button onClick={onGoHome} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <LogoMark />
        </button>
      </nav>

      {/* Centered Form Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}>

          {/* Error / Success Banner */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.8125rem',
              fontWeight: 400,
              marginBottom: '0.25rem',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              color: '#16a34a',
              fontSize: '0.8125rem',
              fontWeight: 400,
              marginBottom: '0.25rem',
            }}>
              {success}
            </div>
          )}

          {view === 'signup' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* Name* */}
            <div>
              <label style={labelStyle}>Name<RedAsterisk /></label>
              <input
                id="signup-name"
                className="pill-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            {/* Email* */}
            <div>
              <label style={labelStyle}>Email<RedAsterisk /></label>
              <input
                id="signup-email"
                className="pill-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* Password* */}
            <div>
              <label style={labelStyle}>Password<RedAsterisk /></label>
              <input
                id="signup-password"
                className="pill-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {/* ReType Password* */}
            <div>
              <label style={labelStyle}>ReType Password<RedAsterisk /></label>
              <input
                id="signup-retype-password"
                className="pill-input"
                type="password"
                name="retypePassword"
                value={formData.retypePassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Role* */}
            <div>
              <label style={labelStyle}>Role<RedAsterisk /></label>
              <div style={{ position: 'relative' }}>
                <select
                  id="signup-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{
                    ...selectStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {/* Custom chevron */}
                <span style={{
                  position: 'absolute', right: '1.125rem', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                  color: '#9ca3af',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </span>
              </div>
              {formData.role === 'admin' && (
                <p style={{ fontSize: '0.75rem', color: '#f97316', marginTop: '0.375rem', marginLeft: '1rem', fontWeight: 400 }}>
                  ⚠ Administrator role requires a verified admin@freeads.no email.
                </p>
              )}
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button
                id="signup-submit-btn"
                className="auth-submit-btn"
                type="submit"
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Creating account…' : 'Sign up'}
              </button>
            </div>
          </form>
          )}

          {view === 'verify' && (
            <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockToken && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  color: '#1e40af',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                }}>
                  <strong>[MVP Dev Note]</strong> Your verification code is: <strong>{mockToken}</strong>
                </div>
              )}
              
              <div>
                <label style={labelStyle}>Verification Code<RedAsterisk /></label>
                <input
                  id="verify-code"
                  className="pill-input"
                  type="text"
                  name="verifyCode"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                <button
                  id="verify-submit-btn"
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Verifying…' : 'Verify Email'}
                </button>
              </div>
            </form>
          )}

          {/* Switcher */}
          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: 400,
            marginTop: '0.5rem',
          }}>
            Already have an account?{' '}
            <button
              id="goto-signin-link"
              type="button"
              onClick={onGoSignIn}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontWeight: 700, color: '#000000', fontSize: 'inherit',
                fontFamily: 'inherit', textDecoration: 'underline',
              }}
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

/* ── Shared Micro-components ── */

function LogoMark() {
  return (
    <img 
      src="/logo.png" 
      alt="freeads.no" 
      style={{ height: '24px', width: 'auto', display: 'block' }} 
    />
  );
}

function RedAsterisk() {
  return <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>;
}

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 400,
  color: '#000000',
  marginBottom: '0.375rem',
  marginLeft: '0.125rem',
  fontFamily: 'Inter, sans-serif',
};

const selectStyle = {
  width: '100%',
  padding: '0.875rem 1.375rem',
  paddingRight: '2.5rem',
  borderRadius: '9999px',
  border: '1.5px solid #d1d5db',
  backgroundColor: '#ffffff',
  color: '#000000',
  fontSize: '0.9375rem',
  fontWeight: 400,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  cursor: 'pointer',
};
