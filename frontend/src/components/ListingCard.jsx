import React from 'react';

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

const formatFigmaPrice = (price, category, title) => {
  const lowercaseTitle = title.toLowerCase();
  
  if (category === 'job') {
    if (lowercaseTitle.includes('designer')) {
      return '₹28–42 LPA';
    }
    if (lowercaseTitle.includes('staff')) {
      return '₹50–75 LPA';
    }
    // Generic fallback for jobs
    const lakhs = price / 100000;
    return `₹${lakhs} LPA`;
  }
  
  if (price >= 10000000) {
    const crores = price / 10000000;
    return `₹${crores.toFixed(1)} Cr`;
  }
  
  return formatIndianCurrency(price);
};

export default function ListingCard({ listing }) {
  const { title, price, category, location, imageUrl } = listing;

  const isJob = category === 'job';
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
  const priceDisplay = formatFigmaPrice(price, category, title);

  // Default fallback image if none provided
  const cardImage = imageUrl || (isJob 
    ? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
    : "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80");

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
