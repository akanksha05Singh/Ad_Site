import React, { useState, useEffect } from 'react';
import ListingModal from './ListingModal';
import { API_BASE_URL } from '../config';

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
 const response = await fetch(`${API_BASE_URL}/api/listings?contactEmail=${encodeURIComponent(user.email)}`, {
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
 const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
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


 
  const handleRepost = async (id) => {
    if (!window.confirm('Repost this ad to reset its duration to 30 days and bump it to the top?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/listings/${id}/repost`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Listing reposted successfully! It has been moved to the top.');
        fetchMyListings();
      } else {
        throw new Error(data.error || 'Failed to repost listing');
      }
    } catch (err) {
      alert(err.message || 'Error reposting listing');
    }
  };

  const getExpiryInfo = (createdAt) => {
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', color: 'text-rose-600', bg: 'bg-rose-50', dot: 'bg-rose-500' };
    if (daysLeft <= 5) return { text: `${daysLeft} days left`, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
    return { text: `${daysLeft} days left`, color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-6">
 {/* Title */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="font-outfit text-2xl font-medium text-slate-900">Manage Listings</h2>
 <p className="text-sm text-slate-500">Edit, remove, or check the status of your advertisements and jobs.</p>
 </div>
 <button
 onClick={fetchMyListings}
 className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-normal text-slate-600 hover:bg-slate-50"
 >
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
 </svg>
 Refresh List
 </button>
 </div>

 {/* Main Table */}
 {loading ? (
 <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 animate-pulse space-y-4">
 <div className="h-6 w-1/4 bg-slate-100 rounded-lg mx-auto" />
 <div className="h-20 w-4/5 bg-slate-100 rounded-lg mx-auto" />
 </div>
 ) : error ? (
 <div className="p-4 bg-red-50 border border-red-100 text-sm text-red-700 rounded-2xl">
 {error}
 </div>
 ) : listings.length === 0 ? (
 <div className="w-full text-center py-16 bg-white rounded-3xl border border-slate-200 px-4">
 <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
 </svg>
 </div>
 <h3 className="font-outfit text-lg font-medium text-slate-900 mb-1">No postings found</h3>
 <p className="text-slate-500 max-w-sm mx-auto text-sm">
 You haven't posted any classified ads or job openings yet. Click 'Post an Ad' at the top to publish one.
 </p>
 </div>
 ) : (
 <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-100 text-sm font-normal text-slate-400 uppercase tracking-wider">
 <th className="px-6 py-4">Title</th>
 <th className="px-6 py-4">Category</th>
 <th className="px-6 py-4">Price / Salary</th>
 <th className="px-6 py-4">Location</th>
 <th className="px-6 py-4">Status / Expiry</th>
 <th className="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
 {listings.map((listing) => (
 <tr key={listing._id} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4 font-medium text-slate-900">{listing.title}</td>
 <td className="px-6 py-4">
 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-normal ${
 listing.category === 'job' 
 ? 'bg-emerald-50 text-emerald-700' 
 : 'bg-indigo-50 text-indigo-700'
 }`}>
 {listing.category === 'job' ? 'Job' : 'Ad'}
 </span>
 </td>
 <td className="px-6 py-4 font-medium text-slate-900">
 {listing.category === 'job' 
 ? `${Number(listing.price).toLocaleString()} NOK / month` 
 : `${Number(listing.price).toLocaleString()} NOK`}
 </td>
 <td className="px-6 py-4 font-medium text-slate-500">{listing.location}</td>
 <td className="px-6 py-4">
  {(() => {
    if (listing.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Pending Review
        </span>
      );
    }
    const expiry = getExpiryInfo(listing.createdAt);
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${expiry.color} ${expiry.bg}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${expiry.dot}`} />
        {expiry.text}
      </span>
    );
  })()}
</td>
 <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
  <button
    onClick={() => handleRepost(listing._id)}
    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
    title="Repost to bump to top and reset 30 days"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" /></svg>
    Repost
  </button>
 <button
 onClick={() => handleEditClick(listing)}
 className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-normal text-slate-600 hover:bg-slate-50 transition-colors"
 >
 Edit
 </button>
 <button
 onClick={() => handleDelete(listing._id)}
 className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-100 bg-rose-50/50 text-sm font-normal text-rose-700 hover:bg-rose-100/50 transition-colors"
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

 {/* Reusable Edit Modal */}
 {isEditOpen && selectedListing && (
 <ListingModal 
 isOpen={isEditOpen} 
 onClose={() => {
 setIsEditOpen(false);
 setSelectedListing(null);
 }} 
 onListingUpdated={(updatedListing) => {
 setListings(prev => prev.map(l => l._id === updatedListing._id ? updatedListing : l));
 alert('Listing updated successfully!');
 }} 
 initialData={selectedListing} 
 user={user} 
 />
 )}
 </div>
 );
}
