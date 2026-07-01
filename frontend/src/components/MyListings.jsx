import React, { useState, useEffect } from 'react';
import ListingModal from './ListingModal';

export default function MyListings({ user }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Editing state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const fetchMyListings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/listings?owner=${user.id || user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setListings(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to retrieve your listings');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setListings(prev => prev.filter(l => l._id !== id));
        alert('Listing deleted successfully!');
      } else {
        throw new Error(data.error || 'Failed to delete listing');
      }
    } catch (err) {
      alert(err.message || 'Error deleting listing');
    }
  };

  const handleEditClick = (listing) => {
    setSelectedListing(listing);
    setIsEditOpen(true);
  };

  // Dedicated inline edit modal for updating existing listings
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/listings/${selectedListing._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedListing)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setListings(prev => prev.map(l => l._id === selectedListing._id ? data.data : l));
        setIsEditOpen(false);
        setSelectedListing(null);
        alert('Listing updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update listing');
      }
    } catch (err) {
      alert(err.message || 'Error updating listing');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-outfit text-2xl font-bold text-slate-900">Manage Listings</h2>
          <p className="text-sm text-slate-500">Edit, remove, or check the status of your advertisements and jobs.</p>
        </div>
        <button
          onClick={fetchMyListings}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Refresh List
        </button>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse space-y-4">
          <div className="h-6 w-1/4 bg-slate-100 rounded-lg mx-auto" />
          <div className="h-20 w-4/5 bg-slate-100 rounded-lg mx-auto" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-100 text-sm text-red-700 rounded-2xl">
          {error}
        </div>
      ) : listings.length === 0 ? (
        <div className="w-full text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm px-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-outfit text-lg font-bold text-slate-900 mb-1">No postings found</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-xs">
            You haven't posted any classified ads or job openings yet. Click 'Post an Ad' at the top to publish one.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price / Salary</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {listings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{listing.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        listing.category === 'job' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {listing.category === 'job' ? 'Job' : 'Ad'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {listing.category === 'job' 
                        ? `${Number(listing.price).toLocaleString()} NOK / year` 
                        : `${Number(listing.price).toLocaleString()} NOK`}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{listing.location}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(listing)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-100 bg-rose-50/50 text-xs font-semibold text-rose-700 hover:bg-rose-100/50 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inline edit form modal */}
      {isEditOpen && selectedListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            
            <div className="relative inline-block transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-outfit text-lg font-bold text-slate-950">Edit Listing</h3>
                <button onClick={() => setIsEditOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Title</label>
                  <input
                    type="text"
                    value={selectedListing.title}
                    onChange={(e) => setSelectedListing(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {selectedListing.category === 'job' ? 'Salary (NOK / yr)' : 'Price (NOK)'}
                    </label>
                    <input
                      type="number"
                      value={selectedListing.price}
                      onChange={(e) => setSelectedListing(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Location</label>
                    <input
                      type="text"
                      value={selectedListing.location}
                      onChange={(e) => setSelectedListing(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contact Email</label>
                  <input
                    type="email"
                    value={selectedListing.contactEmail}
                    onChange={(e) => setSelectedListing(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
                  <textarea
                    value={selectedListing.description}
                    onChange={(e) => setSelectedListing(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-brand-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
