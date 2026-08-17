import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import Footer from './Footer';

/* ─────────────────────────────────────────────────────────────────
   LandingPage — Pixel-perfect home page matching Home page reference.jpg
   
   Sections:
   1. Sticky Navbar  — logo left / Sign-in pill button right
   2. Hero           — left text module + right illustration
   3. JOB Category   — single pill/icon (all others removed)
   4. Analytics Strip— 2.4M+ / 2,450 / 3,470 counter blocks
   5. Featured Listings — "PROMOTED" badge + 4-col card grid from API
   6. Footer         — logo + Support / Legal columns + copyright
───────────────────────────────────────────────────────────────────*/
export default function LandingPage({ onSignInClick, user, onLogout, hideHeader, hideFooter, onJobsClick, onHomeClick, onDashboardClick }) {
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/listings?category=job&limit=8`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setListings(data.listings || data.data || []);
      })
      .catch(() => setListings([]))
      .finally(() => setLoadingListings(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'var(--font-sans)' }}>

      {/* ── 1. Navbar ── */}
      {!hideHeader && (
        <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem',
        height: '64px',
      }}>
        <button 
          onClick={onHomeClick ? onHomeClick : () => window.scrollTo({top: 0, behavior: 'smooth'})} 
          style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
        >
          <LogoMark />
        </button>
      </header>
      )}

      {/* ── 2. Hero Section ── */}
      <section style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '4rem 2.5rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        {/* Left Text Module */}
        <div style={{ flex: '1 1 340px', maxWidth: '520px' }}>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(2rem, 4vw, 2.875rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#000000',
            margin: 0,
            marginBottom: '1.25rem',
          }}>
            exciting<br/>
            <span style={{ color: '#f05a28', fontWeight: 600 }}>job opportunities</span><br/>
            near you
          </h1>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: 400,
            color: '#000000',
            margin: 0,
            lineHeight: 1.5,
          }}>
            1000s of new jobs<br/>
            <span style={{ fontWeight: 700 }}>updated daily</span>
          </p>
        </div>

        {/* Right Illustration */}
        <div style={{
          flex: '1 1 380px',
          maxWidth: '560px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src="/landing-hero.png"
            alt="Team working on exciting job opportunities"
            style={{ width: '100%', maxWidth: '560px', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* ── 3. JOB Category Pill (only category shown) ── */}
      <section style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '0.5rem 2.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div 
          onClick={onJobsClick}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '24px',
            backgroundColor: '#ff6b57',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(255, 107, 87, 0.25)',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
              <path d="M12 12v4"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: '#000000', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            JOBS
          </span>
        </div>
      </section>

      {/* ── 4. Analytics Strip ── */}
      <section style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '1rem 2.5rem 2.5rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            { value: '2.4 M+', label: 'Registered users' },
            { value: '2,450',  label: 'Active Listing' },
            { value: '3,470',  label: 'Companies Hiring' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: '1 1 200px',
              maxWidth: '300px',
              padding: '1.5rem 1rem',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}>
              <p style={{
                fontWeight: 400,
                fontSize: '1.75rem',
                color: '#000000',
                margin: 0,
              }}>
                {stat.value}
              </p>
              <p style={{
                fontWeight: 400,
                fontSize: '0.875rem',
                color: '#4b5563',
                margin: '0.25rem 0 0',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Featured Listings ── */}
      <section style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '0 2.5rem 3.5rem',
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.875rem',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontWeight: 400, fontSize: '1.125rem', color: '#000000', fontFamily: 'var(--font-sans)' }}>
              Featured Listings
            </span>
            <span style={{
              backgroundColor: '#ff6b57',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
            }}>
              PROMOTED
            </span>
          </div>
          {/* Navigation chevrons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ChevronBtn direction="left" />
            <ChevronBtn direction="right" />
          </div>
        </div>

        {/* Card Grid — 4 columns */}
        {loadingListings ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {listings.slice(0, 12).map((listing, i) => (
              <ListingCard key={listing._id || i} listing={listing} />
            ))}
          </div>
        ) : (
          /* Demo placeholder grid when no data */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <ListingCard key={i} listing={i === 0 ? DEMO_LISTINGS[0] : {}} />
            ))}
          </div>
        )}
      </section>

      {!hideFooter && <Footer />}

    </div>
  );
}

/* ── Helper Components ── */

function LogoMark() {
  return (
    <img 
      src="/logo.png" 
      alt="freeads.no" 
      style={{ height: '24px', width: 'auto', display: 'block' }} 
    />
  );
}

function ChevronBtn({ direction }) {
  return (
    <button
      style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#6b7280',
        transition: 'border-color 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.color = '#000000'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {direction === 'left'
          ? <path d="M15 18l-6-6 6-6"/>
          : <path d="M9 18l6-6-6-6"/>}
      </svg>
    </button>
  );
}

function ListingCard({ listing }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        padding: '1rem',
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {listing.title && (
        <>
          <p style={{
            fontWeight: 500,
            fontSize: '0.875rem',
            color: '#000000',
            margin: 0,
            lineHeight: 1.3,
          }}>
            {listing.title}
          </p>
          {listing.company && (
            <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '0.25rem 0 0', fontWeight: 400, lineHeight: 1.3 }}>
              {listing.company}
            </p>
          )}
          {listing.location && (
            <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '0.125rem 0 0', fontWeight: 400, lineHeight: 1.3 }}>
              {listing.location}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '1rem',
      minHeight: '120px',
      backgroundColor: '#fafafa',
    }}>
      <div style={{ height: '64px', backgroundColor: '#f3f4f6', borderRadius: '6px', marginBottom: '0.625rem' }} />
      <div style={{ height: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '75%', marginBottom: '0.4rem' }} />
      <div style={{ height: '9px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '50%' }} />
    </div>
  );
}

/* HeroIllustration — kept as legacy export but replaced by img tag above */
function HeroIllustration() {
  return (
    <img
      src="/landing-hero.png"
      alt="Team working on exciting job opportunities"
      style={{ width: '100%', maxWidth: '440px', height: 'auto', display: 'block' }}
    />
  );
}
/* Legacy SVG removed */
function _LegacySVG() {
  return (
    <svg
      viewBox="0 0 520 340"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '440px', height: 'auto' }}
      role="img"
      aria-label="Team working on job opportunities"
    >
      {/* Light blue oval backdrop */}
      <ellipse cx="265" cy="175" rx="210" ry="155" fill="#e0f2fe" opacity="0.65"/>

      {/* Desk */}
      <rect x="90" y="218" width="310" height="12" rx="6" fill="#b45309"/>
      <rect x="130" y="230" width="12" height="60" rx="4" fill="#92400e"/>
      <rect x="358" y="230" width="12" height="60" rx="4" fill="#92400e"/>

      {/* Monitor */}
      <rect x="195" y="138" width="110" height="78" rx="8" fill="#1e293b"/>
      <rect x="200" y="143" width="100" height="66" rx="5" fill="#38bdf8" opacity="0.85"/>
      {/* Monitor stand */}
      <rect x="244" y="216" width="12" height="12" rx="2" fill="#334155"/>
      <rect x="233" y="226" width="34" height="5" rx="2" fill="#334155"/>

      {/* Screen content lines */}
      <rect x="210" y="155" width="55" height="5" rx="2" fill="#ffffff" opacity="0.7"/>
      <rect x="210" y="165" width="40" height="4" rx="2" fill="#ffffff" opacity="0.5"/>
      <rect x="210" y="174" width="65" height="4" rx="2" fill="#ffffff" opacity="0.4"/>
      <rect x="210" y="183" width="48" height="4" rx="2" fill="#bae6fd" opacity="0.6"/>

      {/* Keyboard */}
      <rect x="205" y="219" width="90" height="12" rx="4" fill="#e2e8f0"/>

      {/* ── Person 1 (seated, blue shirt) ── */}
      {/* Body */}
      <ellipse cx="250" cy="198" rx="22" ry="26" fill="#38bdf8"/>
      {/* Head */}
      <circle cx="250" cy="168" r="18" fill="#fde68a"/>
      {/* Hair */}
      <ellipse cx="250" cy="155" rx="18" ry="9" fill="#292524"/>
      {/* Face detail */}
      <ellipse cx="244" cy="168" rx="2" ry="2.5" fill="#78350f"/>
      <ellipse cx="256" cy="168" rx="2" ry="2.5" fill="#78350f"/>
      <path d="M245 176 Q250 180 255 176" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Arms on keyboard */}
      <ellipse cx="228" cy="210" rx="9" ry="5" fill="#fde68a" transform="rotate(-15 228 210)"/>
      <ellipse cx="272" cy="210" rx="9" ry="5" fill="#fde68a" transform="rotate(15 272 210)"/>

      {/* ── Person 2 (standing left, red shirt) ── */}
      {/* Body */}
      <rect x="90" y="152" width="38" height="68" rx="14" fill="#ef4444"/>
      {/* Head */}
      <circle cx="109" cy="138" r="18" fill="#fcd34d"/>
      {/* Hair */}
      <ellipse cx="109" cy="126" rx="18" ry="8" fill="#1c1917"/>
      {/* Eyes */}
      <ellipse cx="103" cy="137" rx="2" ry="2.5" fill="#78350f"/>
      <ellipse cx="115" cy="137" rx="2" ry="2.5" fill="#78350f"/>
      {/* Smile */}
      <path d="M104 145 Q109 150 114 145" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Raised arm */}
      <line x1="90" y1="158" x2="68" y2="118" stroke="#ef4444" strokeWidth="12" strokeLinecap="round"/>
      <circle cx="68" cy="118" r="8" fill="#fcd34d"/>
      {/* Legs */}
      <rect x="92" y="218" width="15" height="42" rx="6" fill="#fbbf24"/>
      <rect x="111" y="218" width="15" height="42" rx="6" fill="#fbbf24"/>
      {/* Shoes */}
      <ellipse cx="100" cy="260" rx="11" ry="5" fill="#ef4444"/>
      <ellipse cx="119" cy="260" rx="11" ry="5" fill="#ef4444"/>

      {/* ── Person 3 (standing right 1, orange top) ── */}
      {/* Body */}
      <rect x="328" y="155" width="38" height="68" rx="14" fill="#f97316"/>
      {/* Head */}
      <circle cx="347" cy="140" r="18" fill="#fde68a"/>
      {/* Hair — bun */}
      <ellipse cx="347" cy="126" rx="14" ry="9" fill="#7c2d12"/>
      <circle cx="347" cy="119" r="7" fill="#7c2d12"/>
      {/* Eyes */}
      <ellipse cx="341" cy="140" rx="2" ry="2.5" fill="#78350f"/>
      <ellipse cx="353" cy="140" rx="2" ry="2.5" fill="#78350f"/>
      {/* Legs */}
      <rect x="330" y="221" width="15" height="42" rx="6" fill="#1e293b"/>
      <rect x="349" y="221" width="15" height="42" rx="6" fill="#1e293b"/>
      {/* Shoes */}
      <ellipse cx="338" cy="263" rx="11" ry="5" fill="#38bdf8"/>
      <ellipse cx="357" cy="263" rx="11" ry="5" fill="#38bdf8"/>

      {/* ── Person 4 (standing right 2, yellow top) ── */}
      {/* Body */}
      <rect x="378" y="160" width="36" height="62" rx="14" fill="#fbbf24"/>
      {/* Head */}
      <circle cx="396" cy="146" r="18" fill="#fde68a"/>
      {/* Hair — ponytail */}
      <ellipse cx="396" cy="133" rx="16" ry="9" fill="#dc2626"/>
      <path d="M410 133 Q418 125 414 115" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" fill="none"/>
      {/* Eyes */}
      <ellipse cx="390" cy="146" rx="2" ry="2.5" fill="#78350f"/>
      <ellipse cx="402" cy="146" rx="2" ry="2.5" fill="#78350f"/>
      {/* Legs */}
      <rect x="380" y="220" width="14" height="40" rx="6" fill="#374151"/>
      <rect x="398" y="220" width="14" height="40" rx="6" fill="#374151"/>
      {/* Shoes */}
      <ellipse cx="387" cy="260" rx="10" ry="5" fill="#fbbf24"/>
      <ellipse cx="405" cy="260" rx="10" ry="5" fill="#fbbf24"/>

      {/* Floating icons */}
      {/* Lightbulb */}
      <circle cx="165" cy="95" r="16" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5"/>
      <path d="M165 88 Q165 82 165 80 M161 88 Q160 84 157 86 M169 88 Q170 84 173 86" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="165" cy="93" rx="6" ry="7" fill="#fcd34d" opacity="0.8"/>

      {/* Gear */}
      <circle cx="358" cy="88" r="14" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5"/>
      <circle cx="358" cy="88" r="5" fill="#38bdf8"/>

      {/* Bar chart */}
      <circle cx="145" cy="195" r="13" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <rect x="139" y="196" width="4" height="6" rx="1" fill="#22c55e"/>
      <rect x="145" y="192" width="4" height="10" rx="1" fill="#16a34a"/>
      <rect x="151" y="189" width="4" height="13" rx="1" fill="#15803d"/>

      {/* Speech bubble */}
      <circle cx="375" cy="188" r="13" fill="#fdf4ff" stroke="#f5d0fe" strokeWidth="1.5"/>
      <circle cx="370" cy="188" r="1.5" fill="#a855f7"/>
      <circle cx="375" cy="188" r="1.5" fill="#a855f7"/>
      <circle cx="380" cy="188" r="1.5" fill="#a855f7"/>
    </svg>
  );
}

/* ── Nav Sign-in pill style ── */
const navSignInStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.5rem 1.25rem',
  borderRadius: '9999px',
  border: '1.5px solid #000000',
  backgroundColor: '#ffffff',
  color: '#000000',
  fontSize: '0.875rem',
  fontWeight: 400,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  transition: 'background-color 0.18s ease, color 0.18s ease',
};

/* ── Footer styles ── */
const footerHeadStyle = {
  fontSize: '0.65rem',
  fontWeight: 700,
  color: '#000000',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: 0,
  marginBottom: '0.25rem',
};

const footerLinkStyle = {
  fontSize: '0.8125rem',
  color: '#6b7280',
  textDecoration: 'none',
  fontWeight: 400,
  display: 'block',
};

/* ── Demo fallback listings when API returns nothing ── */
const DEMO_LISTINGS = [
  { title: 'Software Engineer', company: 'TechNor AS', location: 'Oslo' },
  { title: 'Product Designer', company: 'Fjord Digital', location: 'Bergen' },
  { title: 'Data Analyst', company: 'NordStats', location: 'Trondheim' },
  { title: 'Marketing Lead', company: 'Borealis Media', location: 'Stavanger' },
  { title: 'Backend Developer', company: 'Polaris Systems', location: 'Oslo' },
  { title: 'UX Researcher', company: 'Scandi Labs', location: 'Bergen' },
  { title: 'DevOps Engineer', company: 'CloudNord', location: 'Oslo' },
  { title: 'Finance Analyst', company: 'Nordic Capital', location: 'Oslo' },
];
