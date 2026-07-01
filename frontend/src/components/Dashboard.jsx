import React from 'react';

export default function Dashboard({ user }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          My Dashboard
        </h1>
        <p className="text-xs font-semibold text-slate-400">
          Manage all your listings, applications, and communications.
        </p>
      </div>

      {/* Stats Cards Row (Figma Match) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Listings Stat */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h4 className="font-outfit font-extrabold text-3xl text-slate-900 tracking-tight">3</h4>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">Active Listings</p>
            <p className="text-[11px] font-bold text-[#0047ab] mt-1.5">+1 this week</p>
          </div>
        </div>

        {/* Total Applicants Stat */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-outfit font-extrabold text-3xl text-slate-900 tracking-tight">87</h4>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">Total Applicants</p>
            <p className="text-[11px] font-bold text-indigo-600 mt-1.5">+12 today</p>
          </div>
        </div>

        {/* Profile Views Stat */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-outfit font-extrabold text-3xl text-slate-900 tracking-tight">1.2K</h4>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">Profile Views</p>
            <p className="text-[11px] font-bold text-[#f05a28] mt-1.5">+34 today</p>
          </div>
        </div>

      </div>

      {/* Recent Activity Section (Figma Match) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="font-outfit text-base font-extrabold text-slate-900">
          Recent Activity
        </h3>

        <div className="divide-y divide-slate-100 font-semibold">
          {/* Activity 1 */}
          <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-slate-800">
                Priya Nair applied to <span className="font-bold text-slate-900">Senior Product Designer</span>
              </p>
              <p className="text-[10px] text-slate-400">2m ago</p>
            </div>
          </div>

          {/* Activity 2 */}
          <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="h-9 w-9 rounded-full bg-orange-50 text-[#f05a28] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-slate-800">
                New message from <span className="font-bold text-slate-900">Vikram</span> about BMW 3 Series
              </p>
              <p className="text-[10px] text-slate-400">45m ago</p>
            </div>
          </div>

          {/* Activity 3 */}
          <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-slate-800">
                Your Creta listing got <span className="font-bold text-slate-900">15 new views</span>
              </p>
              <p className="text-[10px] text-slate-400">2h ago</p>
            </div>
          </div>

          {/* Activity 4 */}
          <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="h-9 w-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.178 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 9.42c-.772-.564-.373-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-slate-800">
                Staff Engineer listing promoted to <span className="font-bold text-slate-900">Featured</span>
              </p>
              <p className="text-[10px] text-slate-400">Yesterday</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
