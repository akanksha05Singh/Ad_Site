import React, { useState } from 'react';
import MyListings from './MyListings';

export default function UserProfile({ user, onProfileUpdate, workspaceTab = 'profile', setWorkspaceTab }) {
 const [fullName, setFullName] = useState(user?.name || 'Arjun Sharma');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
 const [emailAddress, setEmailAddress] = useState(user?.email || 'arjun@example.com');
  const [phoneNumber, setPhoneNumber] = useState(() => {
    let p = user?.phone || '';
    if (p && !p.startsWith('+')) p = '+91 ' + p;
    return p;
  });
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    let w = user?.whatsapp || '';
    if (w && !w.startsWith('+')) w = '+91 ' + w;
    return w;
  });
  const [websiteUrl, setWebsiteUrl] = useState(user?.website || '');
 const [location, setLocation] = useState('Bengaluru, Karnataka');
 const [aboutMe, setAboutMe] = useState('Product-focused professional based in Bengaluru.');
 const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
 
 const [alertMessage, setAlertMessage] = useState('');

 const handlePhotoUpload = (e) => {
 if (e.target.files && e.target.files[0]) {
 const reader = new FileReader();
 reader.onload = (e) => {
 setProfilePhoto(e.target.result);
 };
 reader.readAsDataURL(e.target.files[0]);
 }
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 
 // Construct updated user object
 const updatedUser = {
 ...user,
 name: fullName,
 email: emailAddress,
 phone: phoneNumber,
    whatsapp: whatsappNumber,
    website: websiteUrl,
      companyName: companyName,
 profilePhoto: profilePhoto
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
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
 
 {/* Title */}
 <h1 className="font-outfit text-2xl sm:text-3xl font-medium text-slate-950 tracking-tight">
 My Profile
 </h1>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
 
 {/* Left Column Drawer Profile Card */}
 <aside className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
 <div className="flex flex-col items-center text-center space-y-3">
 <div className="h-16 w-16 rounded-full bg-[#0047ab] text-white flex items-center justify-center font-medium text-2xl border-4 border-slate-50 overflow-hidden shrink-0">
 {profilePhoto ? (
 <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
 ) : (
 fullName.charAt(0).toUpperCase()
 )}
 </div>
 <div>
 <h3 className="font-outfit font-medium text-base text-slate-900">{fullName}</h3>
 <p className="text-xs font-semibold text-slate-400 mt-0.5">{emailAddress}</p>
 </div>
 </div>

 <div className="border-t border-slate-100 pt-4">
 <nav className="flex flex-col gap-1 text-sm font-medium text-slate-500">
 
 {/* Account Settings Tab */}
 <button
 type="button"
 onClick={() => setWorkspaceTab('profile')}
 className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
 workspaceTab === 'profile' 
 ? 'bg-blue-50 text-[#0047ab]' 
 : 'hover:bg-slate-50'
 }`}
 >
 <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
 workspaceTab === 'profile' ? 'bg-[#0047ab] text-white' : 'bg-slate-100 text-slate-400'
 }`}>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 </div>
 <div>
 <p className="font-medium">Account Settings</p>
 <p className="text-[11px] text-slate-500 mt-0.5">Name, email, password</p>
 </div>
 </button>

 {/* My Ads & Listings Tab */}
 <button
 type="button"
 onClick={() => setWorkspaceTab('listings')}
 className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
 workspaceTab === 'listings' 
 ? 'bg-blue-50 text-[#0047ab]' 
 : 'hover:bg-slate-50'
 }`}
 >
 <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
 workspaceTab === 'listings' ? 'bg-[#0047ab] text-white' : 'bg-slate-100 text-slate-400'
 }`}>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
 </svg>
 </div>
 <div>
 <p className="font-medium">My Ads & Listings</p>
 <p className="text-[11px] text-slate-500 mt-0.5">Manage your listings</p>
 </div>
 </button>

 {/* Career Profile Tab */}
 <button
 type="button"
 onClick={() => setWorkspaceTab('career')}
 className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
 workspaceTab === 'career' 
 ? 'bg-blue-50 text-[#0047ab]' 
 : 'hover:bg-slate-50'
 }`}
 >
 <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
 workspaceTab === 'career' ? 'bg-[#0047ab] text-white' : 'bg-slate-100 text-slate-400'
 }`}>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
 </svg>
 </div>
 <div>
 <p className="font-medium">Career Profile</p>
 <p className="text-[11px] text-slate-500 mt-0.5">For job seekers</p>
 </div>
 </button>

 {/* Company Info Tab */}
 <button
 type="button"
 onClick={() => setWorkspaceTab('company')}
 className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
 workspaceTab === 'company' 
 ? 'bg-blue-50 text-[#0047ab]' 
 : 'hover:bg-slate-50'
 }`}
 >
 <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
 workspaceTab === 'company' ? 'bg-[#0047ab] text-white' : 'bg-slate-100 text-slate-400'
 }`}>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
 </svg>
 </div>
 <div>
 <p className="font-medium">Company Info</p>
 <p className="text-[11px] text-slate-500 mt-0.5">For employers</p>
 </div>
 </button>

 </nav>
 </div>
 </aside>

 {/* Right Column Content Area */}
 <div className="lg:col-span-3">
 {workspaceTab === 'listings' ? (
 <MyListings user={user} />
 ) : (
 <div className="bg-white rounded-2xl border border-slate-200 p-6">
 {workspaceTab === 'profile' ? (
 <form onSubmit={handleSubmit} className="space-y-6">
 
 {/* Alert Feedback Message */}
 {alertMessage && (
 <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-700 text-sm font-medium rounded-xl flex items-center gap-2">
 <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span>{alertMessage}</span>
 </div>
 )}

 <div>
 <h3 className="font-outfit text-base font-medium text-slate-900">Account Settings</h3>
 <p className="text-sm font-semibold text-slate-400 mt-0.5">Used for buying and selling across all categories</p>
 </div>

 {/* Profile Photo Upload */}
 <div className="flex items-center gap-6 pb-2">
 <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
 {profilePhoto ? (
 <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
 ) : (
 <span className="text-2xl font-bold text-slate-400">{fullName.charAt(0).toUpperCase()}</span>
 )}
 </div>
 <div>
 <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors inline-block ">
 Upload Photo
 <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
 </label>
 {profilePhoto && (
 <button type="button" onClick={() => setProfilePhoto(null)} className="ml-3 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-50 transition-colors inline-block ">
 Delete Photo
 </button>
 )}
 <p className="text-[10px] font-semibold text-slate-400 mt-2 uppercase tracking-wide">JPG, GIF or PNG. Max size of 800K</p>
 </div>
 </div>

 {/* Form Input fields */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 
 {/* Full Name */}
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Full Name</label>
 <input
 type="text"
 value={fullName}
 onChange={(e) => setFullName(e.target.value)}
 className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
 />
 </div>

 {/* Email Address */}
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Email Address</label>
 <input
 type="email"
 value={emailAddress}
 readOnly
 className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 focus:outline-none cursor-not-allowed"
 />
 </div>

 {/* Phone Number */}
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Phone Number</label>
    <div className="flex">
      <select
        onChange={(e) => {
          const val = phoneNumber.replace(/^\+\d+\s*/, '');
          setPhoneNumber(e.target.value + ' ' + val);
        }}
        value={phoneNumber.match(/^\+\d+/) ? phoneNumber.match(/^\+\d+/)[0] : '+91'}
        className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 focus:outline-none focus:border-[#0047ab] transition-all"
      >
        <option value="+91">🇮🇳 +91</option>
        <option value="+47">🇳🇴 +47</option>
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
      </select>
      <input
        type="tel"
        value={phoneNumber.replace(/^\+\d+\s*/, '')}
        onChange={(e) => {
          const codeMatch = phoneNumber.match(/^\+\d+/);
          const code = codeMatch ? codeMatch[0] : '+91';
          setPhoneNumber(code + ' ' + e.target.value);
        }}
        className="w-full rounded-r-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
      />
    </div>
  </div>

  {/* WhatsApp Number */}
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">WhatsApp Number</label>
    <div className="flex">
      <select
        onChange={(e) => {
          const val = whatsappNumber.replace(/^\+\d+\s*/, '');
          setWhatsappNumber(e.target.value + ' ' + val);
        }}
        value={whatsappNumber.match(/^\+\d+/) ? whatsappNumber.match(/^\+\d+/)[0] : '+91'}
        className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 focus:outline-none focus:border-[#0047ab] transition-all"
      >
        <option value="+91">🇮🇳 +91</option>
        <option value="+47">🇳🇴 +47</option>
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
      </select>
      <input
        type="tel"
        value={whatsappNumber.replace(/^\+\d+\s*/, '')}
        onChange={(e) => {
          const codeMatch = whatsappNumber.match(/^\+\d+/);
          const code = codeMatch ? codeMatch[0] : '+91';
          setWhatsappNumber(code + ' ' + e.target.value);
        }}
        className="w-full rounded-r-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
      />
    </div>
  </div>

  {/* City / Location */}
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">City / Location</label>
    <input
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
    />
  </div>

  {/* Website URL */}
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Company / Personal Website</label>
    <input
      type="url"
      value={websiteUrl}
      onChange={(e) => setWebsiteUrl(e.target.value)}
      placeholder="https://example.com"
      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
    />
  </div>

 {/* About Me (Full-width) */}
 <div className="sm:col-span-2 space-y-1.5">
 <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">About Me</label>
 <textarea
 rows={8}
 value={aboutMe}
 onChange={(e) => setAboutMe(e.target.value)}
 className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
 />
 </div>

 </div>

 {/* Submit button */}
 <div className="flex justify-end pt-2 border-t border-slate-100">
 <button
 type="submit"
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 padding: '0.625rem 1.5rem',
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
 Save Changes
 </button>
 </div>

 </form>
 ) : workspaceTab === 'company' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-outfit text-base font-medium text-slate-900">Company Information</h3>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">Details for employers posting jobs</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Company Website</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0047ab] focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.625rem 1.5rem',
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
                Save Changes
              </button>
            </div>
          </form>
        ) : workspaceTab === 'career' ? (
          <div className="p-8 text-center space-y-3">
            <svg className="w-10 h-10 text-slate-350 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-outfit font-medium text-slate-900 text-sm">Career Profile</h4>
              <p className="text-sm text-slate-450 mt-1 max-w-sm mx-auto">This section is for job seekers and is coming soon.</p>
            </div>
          </div>
        ) : (
 <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
 This section is coming soon.
 </div>
 )}
 </div>
 )}
 </div>

 </div>

 </div>
 );
}
