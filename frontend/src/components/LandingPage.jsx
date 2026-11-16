import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

/* ── Reference Mock Featured Listings matching image exactly ── */
const MOCK_FEATURED_LISTINGS = [
  { _id: 'mock-1', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-2', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-3', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-4', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-5', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-6', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-7', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-8', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-9', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
  { _id: 'mock-10', title: 'Graphic Designer', companyName: 'TCS', location: 'Bangalore', isFeatured: true },
];

export default function LandingPage({ 
  onSignInClick, 
  user, 
  onLogout, 
  onJobsClick, 
  onHomeClick, 
  onDashboardClick,
  onFeaturedClick
}) {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isJobsBoxHovered, setIsJobsBoxHovered] = useState(false);

  const CARDS_PER_PAGE = 10;
  const FETCH_LIMIT = 30; // Limit of 20-30 per page

  useEffect(() => {
    // Fetch featured listings sorted by date and time of posting (createdAt: -1)
    fetch(`${API_BASE_URL}/api/listings?isFeatured=true&limit=${FETCH_LIMIT}`)
      .then(r => r.json())
      .then(data => {
        let items = [];
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          items = data.data;
        }
        
        // If fewer than CARDS_PER_PAGE featured items in DB, supplement with reference items
        // so that the 8-card grid matches the reference image seamlessly
        if (items.length < CARDS_PER_PAGE) {
          const needed = CARDS_PER_PAGE - items.length;
          items = [...items, ...MOCK_FEATURED_LISTINGS.slice(0, needed)];
        }
        
        setFeaturedListings(items);
      })
      .catch(() => {
        setFeaturedListings(MOCK_FEATURED_LISTINGS);
      })
      .finally(() => setLoadingListings(false));
  }, []);

  const totalCards = featuredListings.length;
  const totalPages = Math.max(1, Math.ceil(totalCards / CARDS_PER_PAGE));
  const displayedListings = featuredListings.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleJobsCategoryClick = () => {
    if (onJobsClick) {
      onJobsClick();
    } else if (onSignInClick) {
      onSignInClick();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col antialiased">
      
      {/* ── Outer Alignment Container (Matches Max Width 7xl & px-4 sm:px-6 lg:px-8 to align with Navbar) ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col">

        {/* ── Top Header: freeads.no° logo left, clean, no border (Matches Navbar h-16 alignment) ── */}
        <header className="h-16 w-full flex items-center justify-between">
          <button 
            type="button" 
            onClick={onHomeClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
            className="focus:outline-none p-0 border-none bg-transparent cursor-pointer"
            aria-label="freeads.no"
          >
            <img 
              src="/logo.png" 
              alt="freeads.no" 
              style={{ height: '24px', width: 'auto', display: 'block' }} 
            />
          </button>
        </header>

        {/* ── Hero Section (Left Text Module + Right 4x3 Categories Grid) ── */}
        <section className="pt-6 sm:pt-10 pb-16 sm:pb-20 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8">
            
            {/* Left Column: Heading + Gift Icon + Subscription Offer */}
            <div className="w-full md:w-[480px] flex flex-col items-center text-center justify-between min-h-[300px] py-1">
              <h1 className="text-[32px] sm:text-[38px] font-normal text-black leading-[1.22] tracking-tight m-0">
                Explore exciting<br />
                new job opportunities<br />
                near you
              </h1>

              {/* Gift Box Icon with Ribbon Bow and Sparkles */}
              <div className="my-3 flex items-center justify-center">
                <GiftWithSparklesIcon />
              </div>

              {/* Subscription Offer (Clickable to Sign In / Sign Up) */}
              <div 
                onClick={onSignInClick}
                className="text-center text-[15px] sm:text-[15.5px] text-black cursor-pointer leading-snug hover:opacity-80 transition-opacity select-none m-0"
              >
                Sign up today to get <strong className="font-bold">free</strong><br />
                <strong className="font-bold">subscription till 30th June 2027</strong>
              </div>
            </div>

            {/* Right Column: 4x3 Grid of Categories (Larger boxes, smaller gaps matching manager note) */}
            <div className="w-full md:w-auto flex md:justify-end justify-center">
              <div className="w-[420px] sm:w-[460px] grid grid-cols-4 gap-1.5 sm:gap-2">
                {/* 12 Category Boxes (4 cols x 3 rows) */}
                {Array.from({ length: 12 }).map((_, index) => {
                  // Index 5 is Row 2, Column 2 (0-indexed: Row 1 = 0..3, Row 2 = 4..7 -> index 5 is Col 2)
                  const isJobsBox = index === 5;

                  if (isJobsBox) {
                    return (
                      <div
                        key={index}
                        onClick={handleJobsCategoryClick}
                        onMouseEnter={() => setIsJobsBoxHovered(true)}
                        onMouseLeave={() => setIsJobsBoxHovered(false)}
                        style={{
                          backgroundColor: isJobsBoxHovered ? '#bbf7d0' : '#ffffff',
                        }}
                        className="aspect-square border border-slate-300 rounded-[2px] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none shadow-none"
                        title="Jobs (Click to sign in / sign up)"
                      >
                        <BriefcaseIcon />
                        <span className="text-[11px] sm:text-[12px] font-bold text-black tracking-wider uppercase mt-1.5 sm:mt-2">
                          JOBS
                        </span>
                      </div>
                    );
                  }

                  // Other 11 placeholder category boxes
                  return (
                    <div
                      key={index}
                      className="aspect-square border border-slate-300 rounded-[2px] bg-white select-none transition-colors"
                    />
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ── Featured Listing Section ── */}
        <section className="w-full pt-4 sm:pt-6 pb-20 sm:pb-28">
          
          {/* Section Header: Star + Title on Left | Circular Pagination on Right */}
          <div className="flex items-center justify-between mb-6 pb-1">
            <div className="flex items-center gap-2">
              <OutlineStarIcon className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              <h2 className="text-xl sm:text-[22px] font-normal text-black tracking-tight">
                Featured Listing
              </h2>
            </div>

            {/* Circular Navigation Buttons: < and > */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrevPage}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:border-black hover:text-black transition-colors focus:outline-none cursor-pointer"
                aria-label="Previous listings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:border-black hover:text-black transition-colors focus:outline-none cursor-pointer"
                aria-label="Next listings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 5-Column Card Grid (10 cards: 5 cols x 2 rows matching manager's instruction) */}
          {loadingListings ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-4.5 w-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 h-[260px] animate-pulse flex flex-col justify-between"
                >
                  <div className="w-5 h-5 bg-slate-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-4.5 w-full">
              {displayedListings.map((listing, idx) => (
                <article
                  key={listing._id || idx}
                  onClick={() => {
                    if (onFeaturedClick) {
                      onFeaturedClick(listing);
                    } else if (onJobsClick) {
                      onJobsClick();
                    } else {
                      setSelectedJob(listing);
                    }
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 h-[260px] flex flex-col justify-between cursor-pointer hover:border-slate-400 hover:shadow-xs transition-all duration-200 select-none"
                >
                  {/* Top-Left: Red Outline Star */}
                  <div className="flex items-start justify-start">
                    <OutlineStarIcon className="w-4.5 h-4.5 text-red-500" strokeWidth={1.8} />
                  </div>

                  {/* Bottom-Left: Designation, Company Name, Location */}
                  <div className="flex flex-col text-left mt-auto pt-4">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-black tracking-tight line-clamp-1">
                      {listing.title || 'Graphic Designer'}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] font-normal text-black mt-1 line-clamp-1">
                      {listing.companyName || 'TCS'}
                    </p>
                    <p className="text-[14px] sm:text-[15px] font-normal text-black mt-0.5 line-clamp-1">
                      {listing.location || 'Bangalore'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

        </section>

        {/* ── Centered Footer (Exactly as in Reference) ── */}
        <footer className="w-full pt-16 sm:pt-24 pb-16 sm:pb-20 mt-auto">
          <div className="flex flex-col items-center justify-center space-y-2.5 text-center">
            <a 
              href="#" 
              onClick={e => e.preventDefault()} 
              className="text-[14px] text-black font-normal hover:text-slate-600 transition-colors"
            >
              About Us
            </a>
            <a 
              href="#" 
              onClick={e => e.preventDefault()} 
              className="text-[14px] text-black font-normal hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              onClick={e => e.preventDefault()} 
              className="text-[14px] text-black font-normal hover:text-slate-600 transition-colors"
            >
              Terms & Conditions
            </a>
            <a 
              href="#" 
              onClick={e => e.preventDefault()} 
              className="text-[14px] text-black font-normal hover:text-slate-600 transition-colors"
            >
              Listing Policy
            </a>
            <a 
              href="#" 
              onClick={e => e.preventDefault()} 
              className="text-[14px] text-black font-normal hover:text-slate-600 transition-colors"
            >
              Feedback
            </a>
            <a 
              href="mailto:contact@freeads.no" 
              className="text-[14px] text-black font-normal hover:text-slate-600 transition-colors"
            >
              Contact Us
            </a>

            <div className="pt-8 text-[14px] text-black font-normal">
              &copy; 2026 freeads.no. All rights reserved.
            </div>
          </div>
        </footer>

      </div>

      {/* ── Job Details Modal on Card Click ── */}
      {selectedJob && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setSelectedJob(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 relative text-left"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-black focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-3">
              <OutlineStarIcon className="w-5 h-5 text-red-500" strokeWidth={2} />
              <span className="text-xs uppercase font-bold tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                Featured Ad
              </span>
            </div>

            <h2 className="text-2xl font-bold text-black">{selectedJob.title}</h2>
            <p className="text-lg font-medium text-slate-700 mt-1">{selectedJob.companyName || 'Company'}</p>
            <p className="text-sm text-slate-500 mt-0.5">{selectedJob.location || 'Location'}</p>

            {selectedJob.description && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedJob.description}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              {selectedJob.originalLink ? (
                <a
                  href={selectedJob.originalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  View Original Listing &rarr;
                </a>
              ) : selectedJob.contactEmail ? (
                <a
                  href={`mailto:${selectedJob.contactEmail}?subject=Application for ${encodeURIComponent(selectedJob.title)}`}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Contact Employer ({selectedJob.contactEmail})
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJob(null);
                    if (onSignInClick) onSignInClick();
                  }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Sign in to Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Micro SVG Icons Matching Reference Image Exactly
───────────────────────────────────────────────────────────── */

/** Outline Briefcase Icon for JOBS Box */
function BriefcaseIcon() {
  return (
    <svg 
      className="w-7 h-7 sm:w-8 sm:h-8 text-black" 
      viewBox="0 0 28 28" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Handle */}
      <path d="M10 7V5.5C10 4.67 10.67 4 11.5 4h5c.83 0 1.5.67 1.5 1.5V7" />
      {/* Outer Case */}
      <rect x="3.5" y="7" width="21" height="15" rx="2" />
      {/* Horizontal divider line */}
      <line x1="3.5" y1="13" x2="24.5" y2="13" />
      {/* Central clasp lock */}
      <path d="M12 11h4v4h-4z" />
    </svg>
  );
}

/** Outline Star Icon for Section Header and Cards */
function OutlineStarIcon({ className = 'w-5 h-5', strokeWidth = 1.8 }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
      />
    </svg>
  );
}

/** Outline Gift Box with Bow and Sparkles Icon */
function GiftWithSparklesIcon() {
  return (
    <svg 
      className="w-10 h-10 text-black" 
      viewBox="0 0 36 36" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Top Left Sparkles */}
      <path d="M7 6v3M5.5 7.5h3" strokeWidth="1.3" />
      {/* Top Right Sparkles */}
      <path d="M29 5v3M27.5 6.5h3" strokeWidth="1.3" />
      <path d="M32 11v2M31 12h2" strokeWidth="1.2" />

      {/* Bow loops */}
      <path d="M14.5 13.5c-2.2-2.8-5.5-2.5-5.5.5s3.5 2 5.5 2.5" />
      <path d="M21.5 13.5c2.2-2.8 5.5-2.5 5.5.5s-3.5 2-5.5 2.5" />

      {/* Gift Box Lid */}
      <rect x="7" y="16.5" width="22" height="4" rx="1" />

      {/* Gift Box Base */}
      <path d="M8.5 20.5V30a2 2 0 002 2h15a2 2 0 002-2v-9.5" />

      {/* Vertical Ribbon Stripe */}
      <line x1="18" y1="16.5" x2="18" y2="32" />
    </svg>
  );
}
