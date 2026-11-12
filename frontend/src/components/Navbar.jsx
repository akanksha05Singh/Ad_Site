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
 showSearch = true,
 isHomePage = false
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
 <header className={`sticky top-0 z-40 w-full bg-white h-16 ${isHomePage ? '' : 'border-b border-slate-200'}`}>
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
 {/* Right Side: Authentication / Actions (Matching PDF exactly) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* + Post an AD button */}
          <button
            type="button"
            onClick={onPostClick || onLoginClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.42rem 1.15rem',
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
            + Post an AD
          </button>

          {/* Notification Bell matching PDF */}
          <button 
            type="button" 
            onClick={onLoginClick}
            className="relative p-1 text-black hover:opacity-75 focus:outline-none cursor-pointer bg-transparent border-none"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar Circle (matching PDF avatar) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setUserMenuOpen(!userMenuOpen);
                } else if (onLoginClick) {
                  onLoginClick();
                }
              }}
              className="h-9 w-9 rounded-full bg-[#f87171] text-white flex items-center justify-center font-bold text-sm border-none cursor-pointer focus:outline-none overflow-hidden shadow-xs hover:opacity-90"
              aria-label="User Profile"
            >
              {user && user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
              ) : user && user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Avatar Dropdown Menu if user is logged in */}
            {user && userMenuOpen && (
              <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl border border-slate-200/80 py-3 z-50 shadow-lg text-sm font-semibold text-slate-700">
                <div className="px-4 pb-2.5 mb-1.5 border-b border-slate-100">
                  <p className="font-medium text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email || 'user@freeads.no'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUserMenuClick('find-jobs')}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700"
                >
                  Find Jobs
                </button>
                <button
                  type="button"
                  onClick={() => handleUserMenuClick('overview')}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-slate-700"
                >
                  Dashboard Overview
                </button>
                <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-rose-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
 );
}
