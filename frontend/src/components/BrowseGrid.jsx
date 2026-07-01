import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';

export default function BrowseGrid({ searchQuery, selectedCategory, refreshTrigger }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    // Fetch lists from proxy-routed /api/listings
    const fetchListings = async () => {
      try {
        let url = '/api/listings';
        const params = new URLSearchParams();

        if (selectedCategory && selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }

        if (searchQuery && searchQuery.trim() !== '') {
          params.append('q', searchQuery);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch listings');
        }

        if (active) {
          setListings(data.data || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to connect to the server. Make sure the backend server is running and MongoDB is active.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    // Debounce search query changes slightly to prevent API spamming
    const delayDebounce = setTimeout(() => {
      fetchListings();
    }, searchQuery ? 300 : 0);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [searchQuery, selectedCategory, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton wrapper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse overflow-hidden h-[420px]">
              <div className="aspect-video w-full bg-slate-200" />
              <div className="p-5 flex-grow space-y-4">
                <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                <div className="h-5 w-1/3 bg-slate-200 rounded-lg" />
                <div className="space-y-2 mt-2">
                  <div className="h-4 w-full bg-slate-200 rounded-lg" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded-lg" />
                </div>
                <div className="h-4 w-1/2 bg-slate-200 rounded-lg mt-auto" />
                <div className="h-10 w-full bg-slate-200 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm px-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 border border-red-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="font-outfit text-xl font-bold text-slate-900 mb-2">Failed to load listings</h3>
        <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-6">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Retry Connection
        </button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm px-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="font-outfit text-xl font-bold text-slate-900 mb-1">No listings found</h3>
        <p className="text-slate-500 max-w-sm mx-auto text-sm">
          We couldn't find any listings matching your search parameters. Try broadening your keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing._id || listing.id} listing={listing} />
      ))}
    </div>
  );
}
