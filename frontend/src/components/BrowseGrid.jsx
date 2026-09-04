import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import JobFiltersSidebar from './JobFiltersSidebar';
import { API_BASE_URL } from '../config';

export default function BrowseGrid({ searchQuery, selectedCategory, location, minPrice, refreshTrigger }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New Job Filters
  const [jobFilters, setJobFilters] = useState({
    q: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    salaryType: 'Per Annum',
    state: '',
    occupationCategory: '',
    fullTime: false,
    partTime: false,
    workFromHome: false
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 100;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    // Fetch lists from proxy-routed /api/listings
    const fetchListings = async () => {
      try {
        let url = `${API_BASE_URL}/api/listings`;
        const params = new URLSearchParams();

        if (selectedCategory && selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }

        // Override top-level props with jobFilters if they exist
        const finalQuery = jobFilters.q || searchQuery || '';
        const finalLocation = jobFilters.location || location || '';
        const finalMinPrice = jobFilters.minSalary || minPrice || '';

        if (finalQuery.trim() !== '') {
          params.append('q', finalQuery);
        }

        if (finalLocation.trim() !== '') {
          params.append('location', finalLocation);
        }

        if (finalMinPrice.toString().trim() !== '') {
          // Remove commas from formatted salary
          const cleanMin = finalMinPrice.toString().replace(/,/g, '');
          params.append('minPrice', cleanMin);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        // Add Job Filters
        if (jobFilters.maxSalary) {
          const cleanMax = jobFilters.maxSalary.toString().replace(/,/g, '');
          url += (url.includes('?') ? '&' : '?') + `maxPrice=${encodeURIComponent(cleanMax)}`;
        }
        if (jobFilters.state) url += (url.includes('?') ? '&' : '?') + `state=${encodeURIComponent(jobFilters.state)}`;
        if (jobFilters.occupationCategory) url += (url.includes('?') ? '&' : '?') + `occupationCategory=${encodeURIComponent(jobFilters.occupationCategory)}`;
        if (jobFilters.fullTime) url += (url.includes('?') ? '&' : '?') + `employmentType=Full-time`;
        if (jobFilters.partTime) url += (url.includes('?') ? '&' : '?') + `employmentType=Part-time`;
        if (jobFilters.workFromHome) url += (url.includes('?') ? '&' : '?') + `workFromHome=true`;
        
        // Add Pagination
        url += (url.includes('?') ? '&' : '?') + `page=${currentPage}&limit=${limit}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch listings');
        }

        if (active) {
          setListings(data.data || []);
          setTotalPages(data.totalPages || 1);
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
  }, [searchQuery, selectedCategory, location, minPrice, refreshTrigger, jobFilters, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex gap-8">
        {selectedCategory === 'job' && (
          <div className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-[600px] animate-pulse" />
          </div>
        )}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-row bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse overflow-hidden h-[120px]">
                <div className="w-[160px] h-full bg-slate-200" />
                <div className="p-5 flex-grow space-y-4">
                  <div className="h-5 w-1/3 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-1/4 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
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
        <h3 className="font-outfit text-xl font-medium text-slate-900 mb-2">Failed to load listings</h3>
        <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-6">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-sm font-normal text-white shadow-sm hover:bg-brand-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Retry Connection
        </button>
      </div>
    );
  }

  const renderPagination = () => {
    const displayTotalPages = totalPages;

    const pages = [];
    
    // Logic to show page numbers with ellipsis
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(displayTotalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < displayTotalPages) {
      if (endPage < displayTotalPages - 1) pages.push('...');
      pages.push(displayTotalPages);
    }

    return (
      <div className="flex justify-center items-center gap-1 mt-10 mb-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-[#0047ab] flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Previous
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={typeof page !== 'number'}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-[#0047ab] text-white'
                : typeof page === 'number'
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 cursor-default'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === displayTotalPages}
          className="px-3 py-2 text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-[#0047ab] flex items-center gap-1"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    );
  };

  const renderGrid = () => {
    if (listings.length === 0) {
      return (
        <div className="w-full flex-1 text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm px-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-outfit text-xl font-medium text-slate-900 mb-1">No listings found</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">
            We couldn't find any listings matching your search parameters. Try broadening your keywords.
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col">
        <div className={`gap-4 mb-8 ${selectedCategory === 'job' ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {listings.map((listing) => (
            <ListingCard key={listing._id || listing.id} listing={listing} isJob={selectedCategory === 'job'} />
          ))}
        </div>
        
        {renderPagination()}
      </div>
    );
  };

  return (
    <div className="flex gap-8 items-start relative min-h-screen">
      {/* Show sidebar only for job category */}
      {selectedCategory === 'job' && (
        <div className="hidden lg:block w-[300px] flex-shrink-0 sticky top-24">
          <JobFiltersSidebar 
            filters={jobFilters} 
            setFilters={setJobFilters}
            onApply={() => setCurrentPage(1)} 
          />
        </div>
      )}
      
      {renderGrid()}
    </div>
  );
}
