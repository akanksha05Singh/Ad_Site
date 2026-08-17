import React from 'react';
import { API_BASE_URL } from '../config';

/* ─────────────────────────────────────────────────────────────────
   SignInPage — Full-page sign-in screen matching the reference.jpg
   Two pill buttons: "Sign in with Google" and "Sign in with Email"
   Clicking "Email" shows the email/password form panel.
   Google: mock OAuth stub for prototype.
───────────────────────────────────────────────────────────────────*/
export default function SignInPage({ onAuthSuccess, onGoSignUp, onGoHome }) {
  const [view, setView] = React.useState('options'); // 'options' | 'email' | 'forgot_password' | 'reset_password' | 'verify'
  const [formData, setFormData] = React.useState({ email: '', password: '', resetCode: '', newPassword: '' });
  const [mockResetToken, setMockResetToken] = React.useState(null);
  const [verifyCode, setVerifyCode] = React.useState('');
  const [pendingUserId, setPendingUserId] = React.useState(null);
  const [mockVerifyToken, setMockVerifyToken] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email.trim()) return setError('Email is required.');
    if (!formData.password) return setError('Password is required.');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.requiresVerification) {
          setPendingUserId(data.userId);
          
          // Call the resend verification endpoint to get a new code for MVP dev note
          try {
            const resendRes = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: data.userId }),
            });
            const resendData = await resendRes.json();
            if (resendRes.ok) {
              setMockVerifyToken(resendData.verificationToken);
            }
          } catch (e) {
            console.error('Failed to resend verification', e);
          }
          
          setSuccess('Email not verified. Please check your email for the code.');
          setView('verify');
          return;
        }
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuthSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Centered Panel */}
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
          gap: '1rem',
        }}>

          {/* Error Banner */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.8125rem',
              fontWeight: 400,
            }}>
              {error}
            </div>
          )}
          
          {/* Success Banner */}
          {success && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              color: '#16a34a',
              fontSize: '0.8125rem',
              fontWeight: 400,
            }}>
              {success}
            </div>
          )}

          {view === 'options' ? (
            <>
              {/* Sign in with Google */}
              <button
                id="signin-google-btn"
                className="pill-btn"
                onClick={async () => {
                  setError('');
                  setLoading(true);
                  try {
                    // Mock Google auth flow - bypasses standard verification
                    const payload = {
                      name: 'Google User',
                      email: 'google.user@example.com',
                      provider: 'google'
                    };
                    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Google Login failed');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    onAuthSuccess(data.user, data.token);
                  } catch (err) {
                    setError(err.message);
                    setLoading(false);
                  }
                }}
                type="button"
                disabled={loading}
              >
                <GoogleIcon />
                Sign in with Google
              </button>

              {/* Sign in with Email */}
              <button
                id="signin-email-btn"
                className="pill-btn"
                onClick={() => { setView('email'); setError(''); }}
                type="button"
              >
                <EnvelopeIcon />
                Sign in with Email
              </button>
            </>
          ) : view === 'email' ? (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <button
                type="button"
                onClick={() => { setView('options'); setError(''); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.8125rem', color: '#6b7280', textAlign: 'left',
                  marginBottom: '0.25rem', fontFamily: 'inherit',
                }}
              >
                ← Back
              </button>
              <input
                className="pill-input"
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              <div style={{ position: 'relative' }}>
                <input
                  className="pill-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0
                  }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.25rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot_password'); setError(''); }} style={{ color: '#2563eb', fontSize: '0.8125rem', textDecoration: 'none', cursor: 'pointer' }}>Forgot password?</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                <button
                  id="signin-submit-btn"
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>
          ) : view === 'forgot_password' ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setSuccess('');
              if (!formData.email.trim()) return setError('Email is required.');
              setLoading(true);
              
              try {
                const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: formData.email.trim() }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Request failed');
                
                if (data.resetToken) {
                  setMockResetToken(data.resetToken);
                }
                setSuccess('If the email exists, a reset code was sent.');
                setView('reset_password');
              } catch (err) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <button
                type="button"
                onClick={() => { setView('email'); setError(''); setSuccess(''); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.8125rem', color: '#6b7280', textAlign: 'left',
                  marginBottom: '0.25rem', fontFamily: 'inherit',
                }}
              >
                ← Back to Sign in
              </button>
              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <input
                className="pill-input"
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                <button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          ) : view === 'reset_password' ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setSuccess('');
              if (!formData.resetCode.trim()) return setError('Reset code is required.');
              if (!formData.newPassword.trim()) return setError('New password is required.');
              
              setLoading(true);
              try {
                const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    email: formData.email.trim(),
                    code: formData.resetCode.trim(),
                    newPassword: formData.newPassword
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Reset failed');
                
                setSuccess('Password successfully reset! You can now sign in.');
                setView('email');
                setMockResetToken(null);
                setFormData(prev => ({ ...prev, password: '', resetCode: '', newPassword: '' }));
              } catch (err) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              
              {mockResetToken && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  color: '#1e40af',
                  fontSize: '0.8125rem',
                  marginBottom: '0.5rem',
                }}>
                  <strong>[MVP Prototype Note]</strong> In the live app, this code is emailed to you. Your test code is: <strong>{mockResetToken}</strong>
                </div>
              )}

              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                Enter the 6-digit code sent to {formData.email} and your new password.
              </p>
              
              <input
                className="pill-input"
                type="text"
                name="resetCode"
                placeholder="6-digit reset code"
                value={formData.resetCode}
                onChange={handleChange}
                required
              />
              <div style={{ position: 'relative' }}>
                <input
                  className="pill-input"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0
                  }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                <button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>
              </div>
            </form>
          ) : view === 'verify' ? (
            <form onSubmit={async (e) => {
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
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockVerifyToken && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  color: '#1e40af',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                }}>
                  <strong>[MVP Prototype Note]</strong> In the live app, this code is emailed to you. Your test code is: <strong>{mockVerifyToken}</strong>
                </div>
              )}
              
              <div>
                <input
                  className="pill-input"
                  type="text"
                  name="verifyCode"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit verification code"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                <button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Verifying…' : 'Verify Email'}
                </button>
              </div>
            </form>
          ) : null}

          {/* Switcher */}
          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: 400,
            marginTop: '0.5rem',
          }}>
            Don't have an account?{' '}
            <button
              id="goto-signup-link"
              type="button"
              onClick={onGoSignUp}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontWeight: 700, color: '#000000', fontSize: 'inherit',
                fontFamily: 'inherit', textDecoration: 'underline',
              }}
            >
              Sign up
            </button>
            {' '}for free
          </p>

        </div>
      </div>
    </div>
  );
}

/* ── Micro-Components ── */

function LogoMark() {
  return (
    <img 
      src="/logo.png" 
      alt="freeads.no" 
      style={{ height: '24px', width: 'auto', display: 'block' }} 
    />
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.4 6.6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.4 6.6 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3-11.4-7.3l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C41.3 36 44 30.4 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
}
