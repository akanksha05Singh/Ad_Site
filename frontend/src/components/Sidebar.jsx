import React from 'react';

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const menuItems = [
    { id: 'feed', name: 'Browse Listings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0014 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2z" />
      </svg>
    )},
    { id: 'dashboard', name: 'My Workspace', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    )},
    { id: 'mylistings', name: 'Manage Listings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )},
    { id: 'chat', name: 'Inquiries Inbox', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )}
  ];

  const adminItems = [
    { id: 'admin', name: 'Admin Moderation', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { id: 'scraper', name: 'External Scraper', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    )}
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 text-white font-extrabold text-lg">
          f!
        </span>
        <span className="font-outfit text-lg font-bold tracking-tight text-white">
          freeads<span className="text-brand-400">.no</span>
        </span>
      </div>

      {/* Logged in profile badge */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <img 
          src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
          alt={user.name} 
          className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 p-0.5 object-cover"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate">{user.name}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 flex items-center gap-1">
            {user.role === 'admin' ? 'Administrator' : 'Publisher'}
          </span>
        </div>
      </div>

      {/* Menu Options */}
      <nav className="flex-grow p-4 space-y-1">
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Navigation</span>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === item.id
                ? 'bg-slate-800 text-white font-bold'
                : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}

        {isAdmin && (
          <>
            <span className="px-3 pt-6 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Controls</span>
            {adminItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-slate-800 text-white font-bold'
                    : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Footer Log Out button */}
      <div className="p-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}
