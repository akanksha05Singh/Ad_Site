import React, { useState } from 'react';

// Indian Numbering System Formatter (e.g. 42,50,000)
function formatIndianCurrency(num) {
  const x = num.toString();
  let lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return '₹' + res;
}

const formatFigmaPrice = (price, maxPrice, category, title) => {
  const lowercaseTitle = title.toLowerCase();
  
  if (category === 'job') {
    if (lowercaseTitle.includes('designer')) {
      return '₹28–42 LPA';
    }
    if (lowercaseTitle.includes('staff')) {
      return '₹50–75 LPA';
    }
    // Generic fallback for jobs
    const minLakhs = price / 100000;
    if (maxPrice && maxPrice > price) {
      const maxLakhs = maxPrice / 100000;
      return `₹${minLakhs} LPA - ₹${maxLakhs} LPA`;
    }
    return `₹${minLakhs} LPA`;
  }
  
  if (price >= 10000000) {
    const crores = price / 10000000;
    return `₹${crores.toFixed(1)} Cr`;
  }
  
  return formatIndianCurrency(price);
};

export default function ListingCard({ listing, isJob: forceIsJob }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, price, maxPrice, category, location, imageUrl, description, workFromHome, isScraped, originalLink, contactEmail, contactPhone, contactWhatsapp } = listing;

  const isJob = forceIsJob || category === 'job';
  const lowercaseTitle = title.toLowerCase();
  
  // Custom badge and specs parsing matching the Figma board cards
  let badgeLabel = '★ Featured Ad';
  let detailsText = '';
  let locationLabel = location;

  if (lowercaseTitle.includes('designer')) {
    badgeLabel = '★ Featured Job';
    detailsText = 'Razorpay · Bengaluru';
    locationLabel = 'Bengaluru, KA';
  } else if (lowercaseTitle.includes('bmw')) {
    badgeLabel = '★ Featured Car';
    detailsText = '18,000 km · Diesel · Automatic';
    locationLabel = 'Mumbai, MH';
  } else if (lowercaseTitle.includes('apartment')) {
    badgeLabel = '★ Featured Property';
    detailsText = 'Bandra West · 1,450 sq ft';
    locationLabel = 'Mumbai, MH';
  } else if (lowercaseTitle.includes('staff')) {
    badgeLabel = '★ Featured Job';
    detailsText = 'Swiggy · Hyderabad';
    locationLabel = 'Hyderabad, TS';
  } else if (lowercaseTitle.includes('camera')) {
    badgeLabel = '★ Featured Item';
    detailsText = 'Like New · With 3 Lenses';
    locationLabel = 'Delhi NCR';
  } else {
    // General fallback
    badgeLabel = isJob ? '★ Featured Job' : '★ Featured Item';
    detailsText = isJob ? 'Company · Location' : 'Used · Good Condition';
  }

  // Format Price display using Indian numbering lakhs/crores/LPA matches
  const priceDisplay = formatFigmaPrice(price, maxPrice, category, title);

  // Default fallback image if none provided
  const cardImage = imageUrl || (isJob 
    ? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
    : "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80");

  // Handle Card Click
  const handleCardClick = () => {
    if (isScraped && originalLink) {
      // Single click takes them directly to original site
      window.open(originalLink, '_blank', 'noopener,noreferrer');
    } else {
      // Expand to show details for manual job providers
      setIsExpanded(!isExpanded);
    }
  };

  // Horizontal List Layout (Long format)
  if (isJob) {
    return (
      <article 
        className={`group flex flex-col rounded-2xl border border-slate-200 transition-colors duration-200 overflow-hidden cursor-pointer ${isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
        onClick={handleCardClick}
      >
        <div className="flex flex-row items-center p-3 gap-4 relative">
          
          {/* Badge Overlay for non-scraped */}
          {!isScraped && (
            <span className="absolute top-2 right-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm bg-[#f05a28] text-white">
              {badgeLabel}
            </span>
          )}        {/* Left: Thumbnail Image */}
        <div className="relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0 bg-white border border-slate-100 overflow-hidden rounded-lg">
          <img 
            src={cardImage} 
            alt={title}
            className="w-full h-full object-contain p-1"
            loading="lazy"
          />
        </div>

        {/* Middle: Details */}
        <div className="flex flex-col flex-grow min-w-0 justify-center pr-20">
          <h3 
            className="text-base font-bold text-slate-900 group-hover:text-[#0047ab] transition-colors" 
            title={title}
          >
            {title}
          </h3>
          
          <p className="text-sm font-medium text-slate-500 mt-0.5 truncate">
            {detailsText}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate uppercase tracking-wider">{locationLabel} {workFromHome && " (HYBRID)"}</span>
            </div>
            
            {/* Left-Aligned Salary Display beneath Location */}
            <span className="text-sm font-semibold text-[#0047ab]">
              {priceDisplay}
            </span>
          </div>
        </div>

        </div>

        {/* Expanded Accordion Description */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-slate-200 pt-3">
            {description && (
              <div className="text-sm text-slate-700 whitespace-pre-wrap">{description}</div>
            )}
            
            {/* Dynamic Application/Contact Area */}
            <div className="mt-4 pt-3 border-t border-slate-200 border-dashed flex flex-col gap-2">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="font-bold text-slate-800 mb-1">Contact Information:</div>
                {contactEmail && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {contactEmail}
                  </div>
                )}
                {contactPhone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {contactPhone}
                  </div>
                )}
                {contactWhatsapp && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    {contactWhatsapp}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  // Original Square Layout for Non-Jobs
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      
      {/* Visual Frame containing Image, Badge, and Price overlay */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
        <img 
          src={cardImage} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Figma Badge Overlay */}
        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm z-10 bg-[#f05a28] text-white">
          {badgeLabel}
        </span>

        {/* Dark Gradient bottom-overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/0 to-transparent" />

        {/* Figma Price Overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="font-outfit font-extrabold text-lg text-white tracking-tight drop-shadow-md">
            {priceDisplay}
          </span>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="flex flex-col flex-grow p-4.5 space-y-1.5 bg-white">
        {/* Title */}
        <h3 className="font-outfit text-sm font-bold text-slate-900 group-hover:text-[#0047ab] transition-colors line-clamp-1" title={title}>
          {title}
        </h3>

        {/* Specifications & Company details */}
        <p className="text-xs font-semibold text-slate-500 line-clamp-1">
          {detailsText}
        </p>

        {/* Location line */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100 mt-auto">
          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate uppercase tracking-wider">{locationLabel}</span>
        </div>
      </div>

    </article>
  );
}
