import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllListings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      if (response.ok && data.success) {
        setListings(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to retrieve listings');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllListings();
  }, []);

  const handleModeration = async (id, action) => {
    if (!window.confirm(`Are you sure you want to perform moderation action "${action}" on this listing?`)) return;

    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (action === 'delete') {
        response = await fetch(`/api/listings/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Approve listing (update status to active)
        response = await fetch(`/api/listings/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'active' })
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        if (action === 'delete') {
          setListings(prev => prev.filter(l => l._id !== id));
          alert('Listing deleted by moderator!');
        } else {
          setListings(prev => prev.map(l => l._id === id ? { ...l, status: 'active' } : l));
          alert('Listing approved!');
        }
      } else {
        throw new Error(data.error || 'Moderation action failed');
      }
    } catch (err) {
      alert(err.message || 'Error processing moderation');
    }
  };

  // Generate mockup stats
  const totalUsers = 124;
  const reportedListingsCount = listings.filter(l => l.title.toLowerCase().includes('scam') || l.description.toLowerCase().includes('scam')).length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-outfit text-2xl font-bold text-slate-900">Admin Moderation Console</h2>
        <p className="text-sm text-slate-500">Monitor overall platform compliance and review active listings.</p>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total User Accounts</span>
            <p className="font-outfit text-2xl font-extrabold text-slate-900">{totalUsers}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flagged Warnings</span>
            <p className="font-outfit text-2xl font-extrabold text-rose-600">{reportedListingsCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-650">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Listings Active</span>
            <p className="font-outfit text-2xl font-extrabold text-slate-900">{listings.length}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Listings Moderation List */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse space-y-4">
          <div className="h-20 w-4/5 bg-slate-100 rounded-lg mx-auto" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-150 text-sm text-red-700 rounded-2xl">{error}</div>
      ) : listings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-250">
          <p className="text-xs text-slate-400">No listings exist on the platform to moderate.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-outfit font-bold text-xs text-slate-400 uppercase tracking-wider">
            All Listings
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Publisher Email</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {listings.map((listing) => {
                  const isSuspicious = listing.title.toLowerCase().includes('scam') || listing.description.toLowerCase().includes('scam');
                  return (
                    <tr key={listing._id} className={`hover:bg-slate-50/50 transition-colors ${
                      isSuspicious ? 'bg-rose-50/20' : ''
                    }`}>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {listing.title}
                        {isSuspicious && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                            High Risk
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 capitalize">{listing.category}</td>
                      <td className="px-6 py-4 text-slate-500">{listing.contactEmail}</td>
                      <td className="px-6 py-4 font-medium text-slate-500">{listing.location}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-600 uppercase tracking-wider">
                          {listing.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {listing.status === 'pending' && (
                          <button
                            onClick={() => handleModeration(listing._id, 'approve')}
                            className="px-2.5 py-1.5 rounded bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleModeration(listing._id, 'delete')}
                          className="px-2.5 py-1.5 rounded border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 hover:text-rose-800 transition-colors"
                        >
                          Remove Ad
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
