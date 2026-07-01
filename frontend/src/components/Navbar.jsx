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
            onClick={() => handleUserMenuClick('feed')} 
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f52ba] text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
              F
            </span>
            <span className="font-outfit text-lg font-extrabold tracking-tight text-slate-900">
              freeads<span className="text-[#0f52ba]">.no</span>
            </span>
          </button>
        </div>

        {/* Center Side: Embedded Search Strip (Figma Match) */}
        {showSearch && (
          <div className="hidden md:flex items-center flex-grow max-w-xl mx-8 bg-slate-100 hover:bg-slate-150/80 rounded-xl border border-slate-200 p-1 pl-3 h-11 transition-all">
            {/* Category Dropdown Trigger */}
            <div className="relative shrink-0 pr-3 border-r border-slate-200">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 focus:outline-none"
              >
                <span>{getCategoryLabel()}</span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Category Dropdown List */}
              {dropdownOpen && (
                <div className="absolute top-8 left-0 mt-1 w-32 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50 text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('all')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 hover:text-slate-900"
                  >
                    All Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('classified')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Classifieds
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('job')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Jobs
                  </button>
                </div>
              )}
            </div>

            {/* Input Box */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, cars, property, items..."
              className="flex-grow pl-3 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none h-full"
            />

            {/* Search Icon Button */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0047ab] text-white hover:bg-[#0f52ba] transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        )}

        {/* Right Side: Authentication / Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-3 sm:gap-4 relative">
              {/* Orange Post button */}
              <button
                type="button"
                onClick={onPostClick}
                className="inline-flex items-center rounded-full bg-[#f05a28] hover:bg-[#f26522] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all focus:outline-none"
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
                className="h-9 w-9 rounded-full bg-[#0047ab] text-white flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-sm hover:scale-102 transition-transform focus:outline-none"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {/* Avatar Dropdown Menu (Figma Match) */}
              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl border border-slate-200/80 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-semibold text-slate-700">
                  {/* Dropdown User header */}
                  <div className="px-4 pb-2.5 mb-1.5 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email || 'arjun@example.com'}</p>
                  </div>

                  {/* Menu Options */}
                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('dashboard')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    My Dashboard
                  </button>

                  {user && (
                    <button
                      type="button"
                      onClick={() => handleUserMenuClick('admin')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Admin Console
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('profile')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserMenuClick('dashboard')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    My Applications
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
                    onClick={() => handleUserMenuClick('profile')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </button>

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
              className="inline-flex items-center rounded-xl bg-[#0047ab] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0f52ba] transition-all focus:outline-none"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
