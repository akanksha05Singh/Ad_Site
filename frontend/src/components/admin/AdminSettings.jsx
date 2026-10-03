import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function AdminSettings({ token }) {
  const [settings, setSettings] = useState({ standardAdFee: 0, featureAdFee: 10 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        setSettings(data.data);
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving settings.');
      }
    } catch (error) {
      setMessage('Error saving settings.');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Platform Settings & Fees</h2>
      
      {message && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '0.375rem' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Standard Ad Fee (₹)</label>
          <input
            type="number"
            value={settings.standardAdFee}
            onChange={(e) => setSettings({ ...settings, standardAdFee: Number(e.target.value) })}
            style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '15px' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Featured Ad Fee (₹)</label>
          <input
            type="number"
            value={settings.featureAdFee}
            onChange={(e) => setSettings({ ...settings, featureAdFee: Number(e.target.value) })}
            style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '15px' }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
