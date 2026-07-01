import React, { useState } from 'react';

// Indian Numbering System Formatter
function formatIndianCurrency(num) {
  const x = num.toString();
  let lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return '₹' + res;
}

export default function AdminConsole({ user, onExit }) {
  // adminTab: 'overview', 'queue', 'gov', 'scraper'
  const [adminTab, setAdminTab] = useState('overview');
  const [currency, setCurrency] = useState('INR');

  // 1. Moderation Queue state
  const [queueItems, setQueueItems] = useState([
    {
      id: "AD-4401",
      title: "Work From Home – Earn ₹50K/Month No Skills...",
      category: "Jobs",
      sellerType: "Individual",
      seller: "unknown_user",
      reason: "Suspicious Link",
      posted: "5m ago",
      imageUrl: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&w=80&q=80",
      status: "pending"
    },
    {
      id: "AD-4400",
      title: "2020 Honda City ZX – Top Condition",
      category: "Cars",
      sellerType: "Individual",
      seller: "Rahul Verma",
      reason: "Duplicate Listing",
      posted: "18m ago",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=80&q=80",
      status: "pending"
    },
    {
      id: "AD-4399",
      title: "Senior React Developer – ₹80 LPA",
      category: "Jobs",
      sellerType: "Company",
      seller: "TechCorp Ltd.",
      reason: "Salary Mismatch",
      posted: "34m ago",
      imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=80&q=80",
      status: "pending"
    },
    {
      id: "AD-4398",
      title: "iPhone 15 Pro – Brand New Sealed",
      category: "Items",
      sellerType: "Individual",
      seller: "deal_hunter",
      reason: "Price Too Low – Scam Risk",
      posted: "1h ago",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=80&q=80",
      status: "pending"
    },
    {
      id: "AD-4397",
      title: "2BHK Flat for Rent – Koramangala ₹18K",
      category: "Property",
      sellerType: "Individual",
      seller: "Anand Kumar",
      reason: "Missing RERA ID",
      posted: "2h ago",
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=80&q=80",
      status: "pending"
    },
    {
      id: "AD-4396",
      title: "Delivery Partner Jobs – No Documents Required",
      category: "Jobs",
      sellerType: "Individual",
      seller: "flexwork_in",
      reason: "Policy Violation",
      posted: "3h ago",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=80&q=80",
      status: "pending"
    }
  ]);

  const handleApprove = (id) => {
    setQueueItems(queueItems.map(item => item.id === id ? { ...item, status: 'approved' } : item));
  };

  const handleReject = (id) => {
    setQueueItems(queueItems.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
  };

  // 2. User & Company Governance state
  const companies = [
    { id: "S", name: "Swiggy Pvt. Ltd.", industry: "Food Tech", region: "IN", color: "bg-orange-500", verified: true, count: "48 postings", details: "Swiggy is a leading food ordering and delivery platform in India. Registered with verified corporate tax ID." },
    { id: "N", name: "NordTech AS", industry: "SaaS / B2B", region: "EU", color: "bg-blue-600", verified: false, count: "12 postings", details: "NordTech AS provides B2B software solutions for energy grids in Oslo. Currently pending document review." },
    { id: "B", name: "BharatPe Network", industry: "Fintech", region: "IN", color: "bg-red-500", verified: true, count: "19 postings", details: "BharatPe is an Indian fintech company that caters to small merchants with QR code payment APIs. Fully verified." },
    { id: "F", name: "FastCargo GmbH", industry: "Logistics", region: "EU", color: "bg-purple-550", verified: false, count: "6 postings", details: "FastCargo GmbH operates third-party shipping networks in Hamburg. Profile created recently." },
    { id: "P", name: "SpamJobs Network", industry: "Unknown", region: "IN", color: "bg-slate-400", verified: false, count: "3 flagged", block: true, details: "Flagged multiple times for suspicious listings containing external tracking links. Access restricted." }
  ];
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  // 3. Scraper state
  const [targetUrl, setTargetUrl] = useState('');
  const [scraperLogs, setScraperLogs] = useState([]);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [automationTasks, setAutomationTasks] = useState([
    { id: "SCR-01", name: "LinkedIn Jobs – India", frequency: "Daily", count: 1842, lastRun: "Today, 06:00", active: true },
    { id: "SCR-02", name: "Naukri.com – IT Category", frequency: "Daily", count: 3210, lastRun: "Today, 06:05", active: true },
    { id: "SCR-03", name: "Indeed.no – Norway", frequency: "Weekly", count: 418, lastRun: "Mon, 08:00", active: true },
    { id: "SCR-04", name: "Glassdoor – Remote Global", frequency: "Weekly", count: 290, lastRun: "Jun 14, 08:00", active: false },
    { id: "SCR-05", name: "Finn.no – Technology", frequency: "Daily", count: 674, lastRun: "Today, 06:10", active: true }
  ]);

  const toggleScraperActive = (id) => {
    setAutomationTasks(automationTasks.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const runScraperTask = (name) => {
    setScrapeLoading(true);
    setScraperLogs(prev => [...prev, `[INIT] Triggering scrape job for ${name}...`]);
    
    setTimeout(() => {
      setScraperLogs(prev => [...prev, `[CONNECT] Successfully connected to target API.`]);
    }, 500);

    setTimeout(() => {
      setScraperLogs(prev => [...prev, `[PARSE] Scraped and parsed 12 new listings.`]);
    }, 1200);

    setTimeout(() => {
      setScraperLogs(prev => [...prev, `[SYNC] Seeding listings to local MongoDB database...`]);
      setScrapeLoading(false);
    }, 2000);
  };

  // Helper pills styling
  const getCatPill = (cat) => {
    if (cat === 'Jobs') return 'bg-blue-50 text-blue-600';
    if (cat === 'Cars') return 'bg-orange-50 text-orange-650';
    if (cat === 'Items') return 'bg-purple-50 text-purple-650';
    return 'bg-emerald-50 text-emerald-650';
  };

  const getActiveListingsCount = () => {
    return queueItems.filter(item => item.status === 'pending').length;
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50 overflow-hidden font-sans">
      
      {/* Dark Sidebar Panel (Figma Match #090d16) */}
      <aside className="w-64 bg-[#090d16] text-slate-350 flex flex-col shrink-0">
        
        {/* Brand header */}
        <div className="p-6 border-b border-slate-900/60 space-y-1 bg-slate-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f05a28] text-white font-extrabold text-base shadow-sm">
              F
            </span>
            <span className="font-outfit text-base font-extrabold text-white tracking-tight">
              freeads<span className="text-[#f05a28]">.no</span>
            </span>
          </div>
          <p className="text-[9px] font-bold text-emerald-500 tracking-widest uppercase pl-0.5 pt-1">
            • Admin Console
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow p-4 space-y-1 text-xs font-bold">
          {/* Command Overview */}
          <button
            type="button"
            onClick={() => setAdminTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              adminTab === 'overview' ? 'bg-[#0f172a] text-white font-extrabold' : 'text-slate-400 hover:bg-[#0f172a]/40 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Command Overview</span>
          </button>

          {/* Moderation Queue */}
          <button
            type="button"
            onClick={() => setAdminTab('queue')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              adminTab === 'queue' ? 'bg-[#0f172a] text-white font-extrabold' : 'text-slate-400 hover:bg-[#0f172a]/40 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Moderation Queue</span>
            </div>
            {getActiveListingsCount() > 0 && (
              <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-[#f05a28] text-[10px] font-bold text-white animate-pulse">
                {getActiveListingsCount()}
              </span>
            )}
          </button>

          {/* User Governance */}
          <button
            type="button"
            onClick={() => setAdminTab('gov')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              adminTab === 'gov' ? 'bg-[#0f172a] text-white font-extrabold' : 'text-slate-400 hover:bg-[#0f172a]/40 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>User & Company Gov.</span>
          </button>

          {/* Job Scraper Control */}
          <button
            type="button"
            onClick={() => setAdminTab('scraper')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              adminTab === 'scraper' ? 'bg-[#0f172a] text-white font-extrabold' : 'text-slate-400 hover:bg-[#0f172a]/40 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Job Scraper</span>
          </button>
        </nav>

        {/* Bottom Panel controls */}
        <div className="p-4 border-t border-slate-900/65 text-xs font-bold space-y-1 bg-slate-950/10">
          <button type="button" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-[#0f172a]/40 hover:text-white text-left">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span>Admin Settings</span>
          </button>
          <button type="button" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-[#0f172a]/40 hover:text-white text-left">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>System Health</span>
          </button>
          <button
            type="button"
            onClick={onExit}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0f172a]/40 hover:text-rose-450 text-left text-rose-500 mt-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            <span>Exit Admin</span>
          </button>
        </div>

      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-grow flex flex-col h-full min-w-0 overflow-y-auto bg-slate-50/50">
        
        {/* Header Ribbon */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <h2 className="font-outfit text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              {adminTab === 'overview' ? 'Command Overview' : adminTab === 'queue' ? 'Moderation Queue' : adminTab === 'gov' ? 'User & Company Governance' : 'Job Scraper Control'}
            </h2>
            <p className="text-[9px] text-slate-400 font-semibold">
              Last refreshed: just now · Platform time: 12:12:30 PM
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <div className="h-8 w-8 rounded-full bg-[#0047ab] text-white flex items-center justify-center font-extrabold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8 flex-grow">
          
          {/* TAB 1: Command Overview */}
          {adminTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Active Listings Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Active Listings</p>
                    <svg className="w-4 h-4 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <h3 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">58,800</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600">
                      <span>Jobs</span> <span>14.5k</span>
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-purple-50 text-purple-650">
                      <span>Items</span> <span>31k</span>
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600">
                      <span>Cars</span> <span>8.2k</span>
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                      <span>Property</span> <span>5.1k</span>
                    </div>
                  </div>
                </div>

                {/* Pending Moderation Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Moderation</p>
                      <svg className="w-4 h-4 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">
                        {getActiveListingsCount()}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-orange-50 text-[#f05a28] text-[9px] font-extrabold">Needs Review</span>
                    </div>
                    
                    <div className="mt-3 text-[10px] font-semibold text-slate-500 space-y-1 pl-1">
                      <div className="flex justify-between">
                        <span>Flagged Jobs</span> 
                        <span className="font-bold text-slate-900">{queueItems.filter(i => i.category === 'Jobs' && i.status === 'pending').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flagged Items</span> 
                        <span className="font-bold text-slate-900">{queueItems.filter(i => i.category === 'Items' && i.status === 'pending').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flagged Cars</span> 
                        <span className="font-bold text-slate-900">{queueItems.filter(i => i.category === 'Cars' && i.status === 'pending').length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setAdminTab('queue')}
                    className="w-full mt-3 py-2 bg-[#f05a28] hover:bg-[#f26522] text-xs font-bold text-white rounded-lg shadow-sm transition-all"
                  >
                    Review Queue
                  </button>
                </div>

                {/* Gross Revenue Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-[9px] font-bold">
                      <button
                        type="button"
                        onClick={() => setCurrency('INR')}
                        className={`px-2 py-0.5 rounded-md ${currency === 'INR' ? 'bg-[#0047ab] text-white' : 'text-slate-450'}`}
                      >
                        INR
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('EUR')}
                        className={`px-2 py-0.5 rounded-md ${currency === 'EUR' ? 'bg-[#0047ab] text-white' : 'text-slate-450'}`}
                      >
                        EUR
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">
                      {currency === 'INR' ? '₹2,94,501' : '€3,180'}
                    </h3>
                    <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
                      <span>↑ +18.4%</span> <span className="text-slate-400 font-semibold">vs last month</span>
                    </p>
                  </div>

                  <div className="text-[10px] font-semibold text-slate-500 space-y-1 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span>Featured - India</span> 
                      <span className="font-bold text-slate-900">{currency === 'INR' ? '₹1,84,302' : '€1,990'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Featured - Europe</span> 
                      <span className="font-bold text-slate-900">{currency === 'INR' ? '₹1,10,199' : '€1,190'}</span>
                    </div>
                  </div>
                </div>

                {/* New Registrations Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">New Registrations</p>
                      <svg className="w-4 h-4 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20H22V18C22 15.7909 20.2091 14 18 14H16c-.3813 0-.7492.0533-1.0972.1528M9 20H14V18C14 15.7909 12.2091 14 10 14H8c-2.20914 0-4 1.7909-4 4v2H9z" />
                      </svg>
                    </div>
                    <h3 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">710</h3>
                    <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <span>↑ Today</span> <span className="text-slate-400 font-semibold">· +24% vs yesterday</span>
                    </p>
                  </div>

                  {/* Sparkline wave */}
                  <div className="h-10 w-full mt-2">
                    <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
                      <path
                        d="M0,20 Q15,5 30,12 T60,6 T90,2 T100,8"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

              </div>

              {/* Transactions Table Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900">
                    Recent Revenue Activity
                  </h3>
                  <button type="button" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 shadow-sm transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                    </svg>
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs font-semibold text-slate-500 min-w-[700px]">
                    <thead className="bg-slate-50 text-[10px] text-slate-450 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3.5">Transaction ID</th>
                        <th className="px-4 py-3.5">User / Company</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Plan Tier</th>
                        <th className="px-4 py-3.5">Region</th>
                        <th className="px-4 py-3.5">Amount</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { id: "TXN-9821", name: "Razorpay Pvt. Ltd.", cat: "Jobs", tier: "Featured", region: "IN India", amount: "₹999", status: "Paid", date: "23 Jun, 10:14" },
                        { id: "TXN-9820", name: "Vikram Khanna", cat: "Cars", tier: "Featured", region: "IN India", amount: "₹499", status: "Paid", date: "23 Jun, 09:52" },
                        { id: "TXN-9819", name: "NordTech AS", cat: "Jobs", tier: "Featured", region: "EU Europe", amount: "₹999", status: "Pending", date: "23 Jun, 09:31" },
                        { id: "TXN-9818", name: "Priya Nair", cat: "Items", tier: "Standard", region: "IN India", amount: "₹0", status: "Paid", date: "23 Jun, 08:45" },
                        { id: "TXN-9817", name: "Berlin Motors GmbH", cat: "Cars", tier: "Featured", region: "EU Europe", amount: "₹499", status: "Paid", date: "22 Jun, 23:10" },
                        { id: "TXN-9816", name: "Meesho India", cat: "Items", tier: "Featured", region: "IN India", amount: "₹499", status: "Failed", date: "22 Jun, 21:05" }
                      ].map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-[#0047ab] font-bold">{t.id}</td>
                          <td className="px-4 py-4 font-bold text-slate-900">{t.name}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getCatPill(t.cat)}`}>
                              {t.cat}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              t.tier === 'Featured' ? 'bg-[#f05a28] text-white border-transparent' : 'bg-slate-50 text-slate-450 border-slate-200'
                            }`}>
                              {t.tier === 'Featured' ? '★ Featured' : 'Standard'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-400 font-medium uppercase tracking-wide">{t.region}</td>
                          <td className="px-4 py-4 font-bold text-slate-900">{t.amount}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 font-bold ${
                              t.status === 'Paid' ? 'text-emerald-600' : t.status === 'Pending' ? 'text-amber-600' : 'text-rose-600'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                t.status === 'Paid' ? 'bg-emerald-500' : t.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                              {t.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-400 font-medium">{t.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Moderation Queue */}
          {adminTab === 'queue' && (
            <div className="space-y-6 animate-in fade-in duration-200 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-orange-50 border border-orange-200 text-[#f05a28] text-xs font-bold rounded-lg">
                    Pending {queueItems.filter(i => i.status === 'pending').length}
                  </button>
                  <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold rounded-lg">
                    Approved {queueItems.filter(i => i.status === 'approved').length}
                  </button>
                  <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold rounded-lg">
                    Rejected {queueItems.filter(i => i.status === 'rejected').length}
                  </button>
                </div>
                <button type="button" className="text-xs font-bold text-slate-450 hover:text-slate-700">
                  Reset Queue
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs font-semibold text-slate-500 min-w-[850px]">
                  <thead className="bg-slate-50 text-[10px] text-slate-450 uppercase tracking-wider border-b border-slate-150">
                    <tr>
                      <th className="px-4 py-3.5">Ad ID</th>
                      <th className="px-4 py-3.5">Preview / Title</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Seller Type</th>
                      <th className="px-4 py-3.5">Seller</th>
                      <th className="px-4 py-3.5">Flagged Reason</th>
                      <th className="px-4 py-3.5">Posted</th>
                      <th className="px-4 py-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queueItems.map((item) => (
                      <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${item.status !== 'pending' ? 'opacity-40' : ''}`}>
                        <td className="px-4 py-4 text-[#0047ab] font-bold">{item.id}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-150 shrink-0" />
                            <span className="font-bold text-slate-900 line-clamp-1 max-w-[200px]" title={item.title}>
                              {item.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${getCatPill(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-450">
                            {item.sellerType}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-700 truncate max-w-[80px]" title={item.seller}>{item.seller}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-rose-100 bg-rose-50/50 text-rose-600 text-[10px] font-extrabold">
                            ⚠️ {item.reason}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-450 font-medium">{item.posted}</td>
                        <td className="px-4 py-4">
                          {item.status === 'pending' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-bold uppercase ${item.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {item.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: User & Company Gov. */}
          {adminTab === 'gov' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
              
              {/* Left Registry Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div>
                  <h3 className="font-outfit text-sm font-extrabold text-slate-900">Company Registry</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">5 registered · 2 verified</p>
                </div>
                
                <div className="flex flex-col gap-1">
                  {companies.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCompany(c)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                        selectedCompany.name === c.name ? 'bg-slate-50 border border-slate-200 shadow-sm' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full ${c.color} text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm`}>
                          {c.id}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 text-xs truncate max-w-[120px]">{c.name}</span>
                            {c.verified && <span className="text-blue-500 text-xs">✓</span>}
                            {c.block && <span className="text-rose-500 text-xs">⊘</span>}
                          </div>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{c.industry} · {c.region}</p>
                        </div>
                      </div>
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Details Panel */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 min-h-[300px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl ${selectedCompany.color} text-white flex items-center justify-center font-extrabold text-lg shadow-sm`}>
                        {selectedCompany.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-outfit text-base font-extrabold text-slate-900">{selectedCompany.name}</h3>
                          {selectedCompany.verified ? (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-wider">Verified</span>
                          ) : selectedCompany.block ? (
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[8px] font-bold uppercase tracking-wider">Blocked</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[8px] font-bold uppercase tracking-wider">Pending</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedCompany.industry} Registry · Region {selectedCompany.region}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{selectedCompany.count}</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Company Description</h4>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50/50 border border-slate-100 rounded-xl p-4">
                      {selectedCompany.details}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  {selectedCompany.block ? (
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all">
                      Unblock Company
                    </button>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all">
                        Block Company
                      </button>
                      {!selectedCompany.verified && (
                        <button className="px-4 py-2 bg-[#0047ab] hover:bg-[#0f52ba] text-white rounded-xl text-xs font-bold transition-all">
                          Verify Profile
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Job Scraper */}
          {adminTab === 'scraper' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Fetch Input Block */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-outfit text-sm font-extrabold text-slate-900">Fetch & Parse External Job Listing</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Paste any public job listing URL to extract structured data for review before publishing.</p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-grow flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 p-1 pl-3 h-11 transition-all">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <input
                      type="text"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="Enter target job listing URL (e.g., https://company.com/careers/job-id)"
                      className="flex-grow pl-3 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => runScraperTask("Manual URL")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0047ab] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0f52ba] transition-all shrink-0 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Fetch & Parse Data
                  </button>
                </div>

                {/* Scraper Terminal Output Logs */}
                {scraperLogs.length > 0 && (
                  <div className="rounded-xl bg-[#090d16] p-4 text-[10px] font-mono text-emerald-400 space-y-1.5 border border-slate-900 shadow-inner">
                    {scraperLogs.map((log, index) => (
                      <p key={index}>{log}</p>
                    ))}
                    {scrapeLoading && (
                      <p className="animate-pulse">Loading scraper parameters...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Scraper Automation Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-outfit text-sm font-extrabold text-slate-900">Automation Queue</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Recurring scrape tasks · 4 active</p>
                  </div>
                  <button className="px-4 py-2 bg-[#0047ab] hover:bg-[#0f52ba] text-xs font-bold text-white rounded-xl shadow-sm transition-all focus:outline-none">
                    + Add Source
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs font-semibold text-slate-500 min-w-[700px]">
                    <thead className="bg-slate-50 text-[10px] text-slate-450 uppercase tracking-wider border-b border-slate-150">
                      <tr>
                        <th className="px-4 py-3.5">ID</th>
                        <th className="px-4 py-3.5">Target Source</th>
                        <th className="px-4 py-3.5">Frequency</th>
                        <th className="px-4 py-3.5">Jobs Scraped</th>
                        <th className="px-4 py-3.5">Last Run</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {automationTasks.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-[#0047ab] font-bold">{t.id}</td>
                          <td className="px-4 py-4 font-bold text-slate-900">{t.name}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase ${
                              t.frequency === 'Daily' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-650'
                            }`}>
                              {t.frequency}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-bold text-slate-900">{t.count.toLocaleString()}</td>
                          <td className="px-4 py-4 text-slate-400 font-medium">{t.lastRun}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 font-bold ${t.active ? 'text-emerald-600' : 'text-amber-600'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${t.active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {t.active ? 'Active' : 'Paused'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 font-bold">
                              <button
                                onClick={() => toggleScraperActive(t.id)}
                                className={`px-2.5 py-1.5 border rounded-lg text-[10px] transition-all focus:outline-none ${
                                  t.active 
                                    ? 'border-amber-200 text-amber-600 bg-amber-50/50 hover:bg-amber-50' 
                                    : 'border-emerald-200 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50'
                                }`}
                              >
                                {t.active ? 'Pause' : 'Resume'}
                              </button>
                              <button
                                onClick={() => runScraperTask(t.name)}
                                className="px-2.5 py-1.5 border border-blue-200 text-[#0047ab] bg-blue-50/50 hover:bg-blue-50 rounded-lg text-[10px] transition-all focus:outline-none"
                              >
                                Run
                              </button>
                              <button className="p-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-400 hover:text-slate-600 transition-all focus:outline-none">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
