import React, { useState } from 'react';

export default function AuthForms({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [showEmailForm, setShowEmailForm] = useState(false); // hides inputs initially (Figma match)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' // default to admin for ease of prototype review
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (activeTab === 'signup' && !formData.name.trim()) return setError('Name is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (!formData.password) return setError('Password is required');

    setLoading(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const bodyData = activeTab === 'login' 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock social logins for prototyping feedback
  const handleSocialMockClick = (provider) => {
    // Fill credentials for demo
    setFormData({
      name: "Arjun Sharma",
      email: "arjun@example.com",
      password: "password",
      role: "admin"
    });
    setShowEmailForm(true);
    setError(`Continue with ${provider} initiated. Review form credentials and click submit.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop overlay */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        {/* Center alignment spacer */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        {/* Modal Panel (Figma Match) */}
        <div className="relative inline-block transform overflow-hidden rounded-3xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:align-middle p-8 space-y-6">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0047ab] text-white font-extrabold text-sm shadow-sm">
                F
              </span>
              <span className="font-outfit text-sm font-extrabold text-slate-900">
                freeads<span className="text-[#0047ab]">.no</span>
              </span>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="font-outfit text-2xl font-extrabold text-slate-950">
              {activeTab === 'login' ? 'Welcome to freeads.no' : 'Join freeads.no'}
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              One account for every category.
            </p>
          </div>

          {/* Alert Message for error/social info */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-150 text-red-600 text-xs font-bold rounded-xl flex items-start gap-2">
              <svg className="w-4 h-4 shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* INITIAL SOCIAL LOGIN OPTIONS (Mockup Parity) */}
          {!showEmailForm ? (
            <div className="space-y-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialMockClick("Google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors focus:outline-none font-bold text-xs text-slate-700"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-white font-extrabold text-[10px]">
                  G
                </span>
                <span>Continue with Google</span>
              </button>

              {/* LinkedIn Button */}
              <button
                type="button"
                onClick={() => handleSocialMockClick("LinkedIn")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#0a66c2] hover:bg-[#0047ab] text-white transition-colors focus:outline-none font-bold text-xs"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-[#0a66c2] font-extrabold text-[9px] border border-transparent">
                  in
                </span>
                <span>Continue with LinkedIn</span>
              </button>

              {/* Separator line */}
              <div className="flex items-center justify-center gap-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="h-px bg-slate-100 flex-grow" />
                <span>or</span>
                <div className="h-px bg-slate-100 flex-grow" />
              </div>

              {/* Continue with Email Trigger */}
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors focus:outline-none font-bold text-xs text-slate-700"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Continue with Email</span>
              </button>
            </div>
          ) : (
            /* EMAIL INPUT FORMS SUBMITTER */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Back button to return to social options */}
              <button
                type="button"
                onClick={() => { setShowEmailForm(false); setError(''); }}
                className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 hover:text-slate-600 focus:outline-none uppercase tracking-wide"
              >
                ← Back to options
              </button>

              {/* Name (Signup only) */}
              {activeTab === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0047ab] focus:outline-none transition-all bg-slate-50/30 hover:bg-slate-50/50 focus:bg-white"
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. arjun@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0047ab] focus:outline-none transition-all bg-slate-50/30 hover:bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0047ab] focus:outline-none transition-all bg-slate-50/30 hover:bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Role (Signup only - defaults to admin for preview ease) */}
              {activeTab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Role Type</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-800 bg-slate-50/30 hover:bg-slate-50/50 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                  >
                    <option value="admin">Site Administrator (Unlocks Admin Console)</option>
                    <option value="user">Regular User</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#0047ab] hover:bg-[#0f52ba] text-white font-bold text-xs active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
              </button>

            </form>
          )}

          {/* Modal Footer (Switch tabs) */}
          <div className="text-center pt-2 border-t border-slate-100/60">
            {activeTab === 'login' ? (
              <p className="text-[11px] font-semibold text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); setShowEmailForm(false); }}
                  className="font-bold text-[#0047ab] hover:underline focus:outline-none"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p className="text-[11px] font-semibold text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); setShowEmailForm(false); }}
                  className="font-bold text-[#0047ab] hover:underline focus:outline-none"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
