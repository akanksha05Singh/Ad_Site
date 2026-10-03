import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function AdminListings({ token }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchListings = () => {
    fetch(`${API_BASE_URL}/api/listings/my-listings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        // We actually want all listings. The admin endpoint for all listings should be added, 
        // but for now we'll fetch them from the public endpoint.
        return fetch(`${API_BASE_URL}/api/listings`);
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) setListings(data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchListings();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setEditForm(listing);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/listings/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingId(null);
        fetchListings();
      }
    } catch (e) { console.error(e); }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading ads...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Manage Ads</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Ad Title</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Price/Salary</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(l => (
            <tr key={l._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '1rem' }}>
                {editingId === l._id ? (
                  <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ width: '100%', padding: '0.25rem' }} />
                ) : (
                  <div>{l.title}</div>
                )}
              </td>
              <td style={{ padding: '1rem' }}>
                {editingId === l._id ? (
                  <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} style={{ width: '100px', padding: '0.25rem' }} />
                ) : (
                  <div>{l.price ? `₹${l.price}` : 'N/A'}</div>
                )}
              </td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                {editingId === l._id ? (
                  <>
                    <button onClick={handleSave} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.25rem' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#9ca3af', color: '#fff', border: 'none', borderRadius: '0.25rem' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(l)} style={{ padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(l._id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
