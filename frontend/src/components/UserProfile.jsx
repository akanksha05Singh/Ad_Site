import React, { useState } from 'react';

export default function UserProfile({ user, onProfileUpdate, setWorkspaceTab }) {
  const [fullName, setFullName] = useState(user?.name || 'Arjun Sharma');
  const [emailAddress, setEmailAddress] = useState(user?.email || 'arjun@example.com');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [aboutMe, setAboutMe] = useState('Product-focused professional based in Bengaluru.');
  
  const [activeSubTab, setActiveSubTab] = useState('settings'); // 'settings', 'career', 'company'
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct updated user object
    const updatedUser = {
      ...user,
      name: fullName,
      email: emailAddress
    };

    // Update parent states & localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }

    setAlertMessage('Changes saved successfully!');
    setTimeout(() => setAlertMessage(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column Drawer Profile Card */}
        <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-[#0047ab] text-white flex items-center justify-center font-extrabold text-2xl border-4 border-slate-50 shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-outfit font-extrabold text-base text-slate-900">{fullName}</h3>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{emailAddress}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <nav className="flex flex-col gap-1 text-xs font-bold text-slate-500">
              
              {/* Account Settings Tab */}
              <button
                type="button"
                onClick={() => setActiveSubTab('settings')}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                  activeSubTab === 'settings' 
                    ? 'bg-blue-50 text-[#0047ab]' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                  activeSubTab === 'settings' ? 'bg-[#0047ab] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Account Settings</p>
                  <p className="text-[9px] text-slate-450 mt-0.5">Name, email, password</p>
                </div>
              </button>

              {/* My Ads & Listings Tab */}
              <button
                type="button"
                onClick={() => setWorkspaceTab('listings')}
                className="w-full flex items-start gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition-all"
              >
                <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">My Ads & Listings</p>
                  <p className="text-[9px] text-slate-455 mt-0.5">Manage your listings</p>
                </div>
              </button>

              {/* Career Profile Tab */}
              <button
                type="button"
                onClick={() => setActiveSubTab('career')}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                  activeSubTab === 'career' 
                    ? 'bg-blue-50 text-[#0047ab]' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                  activeSubTab === 'career' ? 'bg-[#0047ab] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Career Profile</p>
                  <p className="text-[9px] text-slate-455 mt-0.5">For job seekers</p>
                </div>
              </button>

              {/* Company Info Tab */}
              <button
                type="button"
                onClick={() => setActiveSubTab('company')}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                  activeSubTab === 'company' 
                    ? 'bg-blue-50 text-[#0047ab]' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                  activeSubTab === 'company' ? 'bg-[#0047ab] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Company Info</p>
                  <p className="text-[9px] text-slate-455 mt-0.5">For employers</p>
                </div>
              </button>

            </nav>
          </div>
        </aside>

        {/* Right Column Form Card (Figma Match) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {activeSubTab === 'settings' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Alert Feedback Message */}
              {alertMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{alertMessage}</span>
                </div>
              )}

              <div>
                <h3 className="font-outfit text-base font-extrabold text-slate-900">Account Settings</h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Used for buying and selling across all categories</p>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                  />
                </div>

                {/* City / Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">City / Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                  />
                </div>

                {/* About Me (Full-width) */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">About Me</label>
                  <textarea
                    rows={4}
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all resize-none"
                  />
                </div>

              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0047ab] hover:bg-[#0f52ba] text-xs font-bold text-white shadow-sm transition-all focus:outline-none"
                >
                  Save Changes
                </button>
              </div>

            </form>
          ) : (
            <div className="p-8 text-center space-y-3">
              <svg className="w-10 h-10 text-slate-350 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-outfit font-bold text-slate-900 text-sm">Form Panel Unlocked</h4>
                <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto">This sub-profile section is active and ready for input in the premium plan upgrade.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
