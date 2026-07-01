import React from 'react';

export default function SearchBar({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Query Input */}
        <div className="relative w-full md:flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or location..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
          <span className="hidden sm:inline text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Category:</span>
          
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('classified')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'classified'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Classifieds
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('job')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'job'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
