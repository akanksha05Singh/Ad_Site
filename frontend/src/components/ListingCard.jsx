import React, { useState } from 'react';

export default function ListingCard({ listing, forceExpanded = false, onSelect }) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = forceExpanded || internalExpanded;

  const {
    title = 'Graphic Designer',
    companyName = 'TCS',
    location = 'Bangalore',
    isFeatured = false,
    description = '',
    contactEmail = '',
    contactPhone = '',
    contactWhatsapp = '',
    companyWebsite = '',
    contactPerson = 'Alex Joy',
    designation = 'Director'
  } = listing || {};

  // Company avatar styling matching PDF
  const isTCS = companyName?.toUpperCase()?.includes('TCS');
  const avatarBg = isTCS ? '#7fe3f5' : '#fad69b'; // Cyan for TCS, peach for others
  const avatarText = isTCS ? 'TCS' : (companyName?.substring(0, 2) || 'Ab');

  return (
    <article 
      className="w-full bg-white border border-slate-200/90 rounded-[14px] p-4 sm:p-5 transition-shadow hover:shadow-xs select-none"
    >
      {/* ── Top Row: Avatar + Title/Company + Star & Heart Icons ── */}
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => {
          if (onSelect) onSelect(listing);
          else setInternalExpanded(!internalExpanded);
        }}
      >
        <div className="flex items-start gap-4">
          {/* Company Avatar Box */}
          <div 
            style={{ backgroundColor: avatarBg }}
            className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-slate-900 text-lg shrink-0 tracking-tight"
          >
            {avatarText}
          </div>

          {/* Title & Company Info */}
          <div>
            <h3 className="text-[15.5px] font-semibold text-[#1d4ed8] hover:underline cursor-pointer leading-tight">
              {title}
            </h3>
            <p className="text-[13.5px] text-slate-900 font-normal mt-0.5">{companyName}</p>
            <p className="text-[13.5px] text-slate-800 font-normal">{location}</p>
          </div>
        </div>

        {/* Right Action Icons: Star & Heart */}
        <div className="flex flex-col items-center gap-2 pt-0.5 text-slate-400">
          {/* Star Icon (Red outline if featured) */}
          <button 
            type="button" 
            className="focus:outline-none hover:scale-110 transition-transform"
            aria-label="Star"
          >
            <svg 
              className={`w-4 h-4 ${isFeatured ? 'text-red-500 fill-none stroke-current' : 'text-slate-300 fill-none stroke-current'}`} 
              viewBox="0 0 24 24" 
              strokeWidth="1.8"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>

          {/* Heart Icon */}
          <button 
            type="button" 
            className="focus:outline-none hover:scale-110 transition-transform"
            aria-label="Bookmark"
          >
            <svg className="w-4 h-4 text-slate-300 hover:text-red-400 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Expanded Detail View (Matches PDF Mockup) ── */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-[13px] text-slate-800 space-y-4 leading-normal">
          
          {/* Intro Paragraph */}
          <p className="text-black leading-relaxed">
            {description || "Are you a visual storyteller who is passionate about transforming great ideas into captivating designs? Do you have a keen eye for detail, color, and typography, and thrive working at the intersection of strategy and creativity? Then you might be the one we're looking for."}
          </p>

          {/* About Us */}
          <div>
            <h4 className="font-bold text-black mb-1">About Us</h4>
            <p className="text-black leading-relaxed">
              Brief introduction to your company. What do you do, who are your customers, and what is the workplace culture like? Use 3–4 sentences to sell your company as an exciting place to work
            </p>
          </div>

          {/* Key tasks */}
          <div>
            <h4 className="font-bold text-black mb-1">Key tasks</h4>
            <ul className="list-none space-y-0.5 text-black">
              <li>• Develop and design visual material for social media</li>
              <li>• Conceptualize and finalize print materials, including brochures</li>
              <li>• Further develop and ensure a common thread in the company</li>
            </ul>
          </div>

          {/* Who are you? */}
          <div>
            <h4 className="font-bold text-black mb-1">Who are you?</h4>
            <p className="text-black leading-relaxed">
              You have relevant education in graphic design, visual communication or similar.
            </p>
          </div>

          {/* What we offer */}
          <div>
            <h4 className="font-bold text-black mb-1">What we offer</h4>
            <ul className="list-none space-y-0.5 text-black">
              <li>• A creative and challenging position with great influence.</li>
              <li>• An informal, supportive and engaged working environment.</li>
              <li>• Competitive conditions and good development opportunities.</li>
              <li>• Great office space centrally located in {location || 'Bangalore'}</li>
            </ul>
          </div>

          {/* Contact Person Details */}
          <div className="pt-2 text-black leading-snug">
            <p className="font-normal">Contact person for this position</p>
            <p className="font-normal text-slate-800">{contactPerson || 'Alex Joy'}</p>
            <p className="font-normal text-slate-800">{designation || 'Director'}</p>
            
            {companyWebsite ? (
              <a 
                href={companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#2a45a0] hover:underline block mt-0.5"
              >
                {companyWebsite.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <a href="https://www.tcmnbgd.com" target="_blank" rel="noopener noreferrer" className="text-[#2a45a0] hover:underline block mt-0.5">
                www.tcmnbgd.com
              </a>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-2 text-[14px]">
              {/* Email */}
              <div className="flex items-center gap-1.5 text-black">
                <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{contactEmail || 'xyz@gmail.com'}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-1.5 text-black">
                <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{contactPhone || '+91 0123456789'}</span>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-1.5 text-black">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>{contactWhatsapp || '+91 0123456789'}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </article>
  );
}
