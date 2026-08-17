import React, { useState } from 'react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  user, 
  onLogout, 
  onLoginClick,
  onPostClick,
  setActiveTab,
  onHomeClick,
  showSearch = true
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  const getCategoryLabel = () => {
    if (selectedCategory === 'all') return 'All';
    if (selectedCategory === 'classified') return 'Classifieds';
    if (selectedCategory === 'job') return 'Jobs';
    return 'All';
  };

  const handleUserMenuClick = (tabName) => {
    setActiveTab(tabName);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm h-16">
      <div className="mx-auto flex max-w-7xl h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onHomeClick ? onHomeClick : () => handleUserMenuClick('feed')} 
            className="focus:outline-none"
            aria-label="freeads.no"
          >
            <img 
              src="/logo.png" 
              alt="freeads.no" 
              style={{ height: '24px', width: 'auto', display: 'block' }} 
            />
          </button>
        </div>

        {/* Search Bar Removed as per user instruction */}
        {/* Right Side: Authentication / Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-3 sm:gap-4 relative">
              {/* Post an Ad button */}
              <button
                type="button"
                onClick={onPostClick}
                style={{
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
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#000000'; }}
              >
                + Post an Ad
              </button>

              {/* Notification Bell Icon */}
              <button type="button" className="relative p-1.5 text-slate-400 hover:text-slate-600 focus:outline-none">
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Chat Bubble Icon */}
              <button 
                type="button" 
                onClick={() => handleUserMenuClick('chat')}
                className="p-1.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* User Avatar Circle */}
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-9 w-9 rounded-full bg-[#0047ab] text-white flex items-center justify-center font-medium text-sm border-2 border-white shadow-sm hover:scale-102 transition-transform focus:outline-none overflow-hidden"
              >
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </button>

              {/* Avatar Dropdown Menu (Figma Match) */}
              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl border border-slate-200/80 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-sm font-semibold text-slate-700">
                  {/* Dropdown User header */}
                  <div className="px-4 pb-2.5 mb-1.5 border-b border-slate-100">
                    <p className="font-medium text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user.email || 'arjun@example.com'}</p>
                  </div>

                  {/* Menu Options */}
                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('find-jobs')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Find Jobs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('overview')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard Overview
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('listings')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    My Listings
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('applicants')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Applicants & Leads
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('saved')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved Listings
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('messages')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Messages
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('billing')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Billing
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('profile')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </button>

                  {user && user.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => handleUserMenuClick('admin')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-amber-600 hover:text-amber-700"
                    >
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Admin Console
                    </button>
                  )}

                  <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-rose-600 hover:text-rose-700"
                    >
                      <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="inline-flex items-center rounded-full border-[1.5px] border-black bg-white px-5 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:outline-none"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
