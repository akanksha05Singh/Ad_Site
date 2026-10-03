import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function AdminUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageForm, setMessageForm] = useState(null); // { userId, sendToAll: boolean }
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, status, duration = null) => {
    if (!window.confirm(`Are you sure you want to ${status} this user?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, duration })
      });
      if (res.ok) fetchUsers();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userId: messageForm.userId,
          sendToAll: messageForm.sendToAll,
          subject,
          message
        })
      });
      if (res.ok) {
        alert('Message sent successfully!');
        setMessageForm(null);
        setSubject('');
        setMessage('');
      }
    } catch (e) { alert('Error sending message'); }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading users...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>User Management</h2>
        <button 
          onClick={() => setMessageForm({ sendToAll: true })}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
        >
          Message All Subscribers
        </button>
      </div>

      {messageForm && (
        <div style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{messageForm.sendToAll ? 'Send Message to All' : 'Send Message to User'}</h3>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Subject" required value={subject} onChange={e => setSubject(e.target.value)} style={{ padding: '0.5rem' }} />
            <textarea placeholder="Message content..." required rows="4" value={message} onChange={e => setMessage(e.target.value)} style={{ padding: '0.5rem' }}></textarea>
            <div>
              <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', marginRight: '1rem' }}>Send Message</button>
              <button type="button" onClick={() => setMessageForm(null)} style={{ padding: '0.5rem 1rem', backgroundColor: '#9ca3af', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Name/Email</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ fontWeight: '500' }}>{u.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{u.email}</div>
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500',
                  backgroundColor: u.status === 'active' ? '#d1fae5' : u.status === 'suspended' ? '#fef3c7' : '#fee2e2',
                  color: u.status === 'active' ? '#065f46' : u.status === 'suspended' ? '#92400e' : '#991b1b'
                }}>
                  {u.status} {u.suspensionEndDate && `(until ${new Date(u.suspensionEndDate).toLocaleDateString()})`}
                </span>
              </td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setMessageForm({ userId: u._id, sendToAll: false })} style={{ padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', cursor: 'pointer' }}>Message</button>
                
                {u.status !== 'active' ? (
                  <button onClick={() => handleStatusChange(u._id, 'active')} style={{ padding: '0.25rem 0.5rem', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.25rem', cursor: 'pointer' }}>Reactivate</button>
                ) : (
                  <>
                    <select onChange={(e) => { if(e.target.value) handleStatusChange(u._id, 'suspended', e.target.value) }} style={{ padding: '0.25rem' }}>
                      <option value="">Suspend...</option>
                      <option value="3Days">For 3 Days</option>
                      <option value="1Week">For 1 Week</option>
                      <option value="1Month">For 1 Month</option>
                    </select>
                    <button onClick={() => handleStatusChange(u._id, 'blocked')} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.25rem', cursor: 'pointer' }}>Block</button>
                  </>
                )}
                
                <button onClick={() => handleDelete(u._id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
