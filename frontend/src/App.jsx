import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BrowseGrid from './components/BrowseGrid';
import ListingModal from './components/ListingModal';
import AuthForms from './components/AuthForms';
import Dashboard from './components/Dashboard';
import MyListings from './components/MyListings';
import ChatWindow from './components/ChatWindow';
import AdminPanel from './components/AdminPanel';
import ScraperPanel from './components/ScraperPanel';
import UserProfile from './components/UserProfile';
import AdminConsole from './components/AdminConsole';

export default function App() {
  // Authentication States
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Tab View Navigation
  // activeTab: 'feed', 'dashboard', 'admin'
  const [activeTab, setActiveTab] = useState('feed'); 
  
  // workspaceTab (sub-tabs inside logged-in dashboard view)
  // 'overview', 'listings', 'applicants', 'saved', 'messages', 'billing', 'profile'
  const [workspaceTab, setWorkspaceTab] = useState('overview');

  // Listing creation & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Billing & PayPal Checkout states
  const [billingPlan, setBillingPlan] = useState('Free Tier Plan');
  const [checkoutPlan, setCheckoutPlan] = useState(null); 
  const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'checkout', 'success'
  const [paymentMethod, setPaymentMethod] = useState('paypal_guest'); // 'card', 'paypal_guest'
  const [isPaying, setIsPaying] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setActiveTab('dashboard');
    }
  }, []);

  const handleAuthSuccess = (authUser, authToken) => {
    setUser(authUser);
    setToken(authToken);
    setActiveTab('dashboard'); 
    setWorkspaceTab('overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken('');
    setActiveTab('feed');
  };

  const handleListingCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Helper to click Category Cards to trigger live feed updates
  const handleCategoryCardClick = (category, search = '') => {
    setSelectedCategory(category);
    setSearchQuery(search);
  };

  // Billing handlers
  const handleStartCheckout = (planName) => {
    setCheckoutPlan(planName);
    setPaymentStep('checkout');
  };

  const handleProcessPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setBillingPlan(checkoutPlan === 'premium' ? 'Premium Publisher Plan' : 'Featured Seller Boost');
      setPaymentStep('success');
    }, 2000);
  };

  // Helper when user clicks avatar dropdown tabs
  const handleDropdownTabClick = (tabName) => {
    if (tabName === 'feed') {
      setActiveTab('feed');
    } else if (tabName === 'chat') {
      setActiveTab('dashboard');
      setWorkspaceTab('messages');
    } else if (tabName === 'admin') {
      setActiveTab('admin'); // set activeTab to 'admin' to load dark admin console!
    } else if (tabName === 'applicants') {
      setActiveTab('dashboard');
      setWorkspaceTab('applicants');
    } else if (tabName === 'saved') {
      setActiveTab('dashboard');
      setWorkspaceTab('saved');
    } else if (tabName === 'profile') {
      setActiveTab('dashboard');
      setWorkspaceTab('profile'); // load UserProfile/AccountSettings!
    } else {
      setActiveTab('dashboard');
      setWorkspaceTab('overview');
    }
  };

  // Render Screens inside Dashboard Right Column
  const renderWorkspaceContent = () => {
    switch (workspaceTab) {
      case 'listings':
        return <MyListings user={user} />;
      case 'messages':
        return <ChatWindow user={user} />;
      case 'profile':
        return <UserProfile user={user} onProfileUpdate={setUser} setWorkspaceTab={setWorkspaceTab} />;
      case 'applicants':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="font-outfit text-xl font-bold text-slate-900">Applicants & Leads</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-500">
                <thead className="bg-slate-50 text-[10px] text-slate-450 uppercase tracking-wider border-b border-slate-150">
                  <tr>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Applied Position</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-4 font-bold text-slate-900">Priya Nair</td>
                    <td className="px-4 py-4">Senior Product Designer</td>
                    <td className="px-4 py-4 text-slate-400">2 minutes ago</td>
                    <td className="px-4 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold">Reviewing</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-bold text-slate-900">Amit Patel</td>
                    <td className="px-4 py-4">Staff Software Engineer</td>
                    <td className="px-4 py-4 text-slate-400">2 days ago</td>
                    <td className="px-4 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">Shortlisted</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'saved':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="font-outfit text-xl font-bold text-slate-900">Saved Items ({selectedCategory === 'all' ? '3' : '1'})</h2>
            <p className="text-xs text-slate-400">Items and ads you bookmarked for later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 flex gap-4">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">2023 BMW 3 Series 320d</h4>
                  <p className="text-[#f05a28] font-bold text-xs mt-1">₹42,50,000</p>
                  <p className="text-[10px] text-slate-400 mt-2">Saved 3 days ago</p>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex gap-4">
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">3BHK Sea-View Apartment</h4>
                  <p className="text-[#f05a28] font-bold text-xs mt-1">₹3.2 Cr</p>
                  <p className="text-[10px] text-slate-400 mt-2">Saved Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'billing':
        if (paymentStep === 'select') {
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-8 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="font-outfit text-xl font-bold text-slate-900">Billing & Subscriptions</h2>
                <p className="text-xs text-slate-400">Manage your active plans, payment cards, and invoices.</p>
              </div>

              {/* Current Active Plan Card */}
              <div className="p-5 bg-[#0047ab]/5 rounded-2xl flex items-center justify-between border border-[#0047ab]/10">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-[#0047ab] uppercase tracking-wide">Current active subscription</p>
                  <h4 className="font-outfit text-lg font-extrabold text-slate-900">{billingPlan}</h4>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {billingPlan === 'Free Tier Plan' 
                      ? 'Upgrade your plan to unlock premium seller analytics and listing boosts.'
                      : 'Thank you for supporting Norway\'s premier digital classifieds platform!'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Upgrade Options */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Select an Upgrade Option</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Premium Publisher */}
                  <div className="border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-350 hover:shadow-sm transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-outfit font-extrabold text-slate-900 text-sm">Premium Publisher</h4>
                        <span className="text-xs font-extrabold text-[#0047ab]">₹999 / mo</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Perfect for frequent sellers and small businesses looking to maximize exposure.
                      </p>
                      <ul className="text-[10px] font-semibold text-slate-600 space-y-1.5 list-disc pl-4">
                        <li>Post unlimited classified ads & jobs</li>
                        <li>Get a blue verified company registry badge</li>
                        <li>Access real-time listings traffic analytics</li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartCheckout('premium')}
                      className="w-full mt-4 py-2 bg-[#0047ab] hover:bg-[#0f52ba] text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Upgrade to Premium
                    </button>
                  </div>

                  {/* Featured Seller Boost */}
                  <div className="border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-350 hover:shadow-sm transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-outfit font-extrabold text-slate-900 text-sm">Featured Seller Boost</h4>
                        <span className="text-xs font-extrabold text-[#f05a28]">₹1,999 / mo</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        For maximum acceleration. Adds tags and overrides rank to keep listings on top.
                      </p>
                      <ul className="text-[10px] font-semibold text-slate-600 space-y-1.5 list-disc pl-4">
                        <li>Everything included in Premium tier</li>
                        <li>Automated orange ★ Featured card badges</li>
                        <li>High-priority listing rank in search results</li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartCheckout('featured')}
                      className="w-full mt-4 py-2 bg-[#f05a28] hover:bg-[#f26522] text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Get Featured Boost
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        }

        if (paymentStep === 'checkout') {
          const planTitle = checkoutPlan === 'premium' ? 'Premium Publisher Plan' : 'Featured Seller Boost';
          const planCost = checkoutPlan === 'premium' ? '₹999/month' : '₹1,999/month';

          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200 max-w-xl mx-auto">
              <div className="space-y-1">
                <h2 className="font-outfit text-xl font-bold text-slate-900">Secure Checkout</h2>
                <p className="text-xs text-slate-450">Review your subscription order and finalize payment details.</p>
              </div>

              {/* Order Summary Block */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{planTitle}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Recurring Monthly Billing</p>
                </div>
                <span className="text-xs font-extrabold text-slate-900">{planCost}</span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Select Payment Method</h3>
                
                {/* PayPal Option */}
                <label className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'paypal_guest' ? 'border-[#0047ab] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === 'paypal_guest'}
                    onChange={() => setPaymentMethod('paypal_guest')}
                    className="mt-1 text-[#0047ab] focus:ring-[#0047ab]"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">PayPal Guest Checkout</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-extrabold uppercase">Recommended</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Pay directly using your debit or credit card without being forced to create a PayPal account. Secured by PayPal.
                    </p>
                    {/* Card logo strip */}
                    <div className="flex gap-1.5 pt-1">
                      <span className="text-[8px] font-extrabold px-1 py-0.5 bg-slate-100 text-slate-600 rounded">VISA</span>
                      <span className="text-[8px] font-extrabold px-1 py-0.5 bg-slate-100 text-slate-600 rounded">MC</span>
                      <span className="text-[8px] font-extrabold px-1 py-0.5 bg-slate-100 text-slate-600 rounded">AMEX</span>
                      <span className="text-[8px] font-extrabold px-1 py-0.5 bg-slate-100 text-slate-600 rounded">DISC</span>
                    </div>
                  </div>
                </label>

                {/* Standard Card Option */}
                <label className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'card' ? 'border-[#0047ab] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-[#0047ab] focus:ring-[#0047ab]"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900">Standard Card Entry</span>
                    <p className="text-[10px] text-slate-500 font-semibold">Enter card details directly in manual forms.</p>
                  </div>
                </label>
              </div>

              {/* Simulated Card inputs */}
              <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue="Arjun Sharma"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0047ab]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0047ab]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">CVV</label>
                    <input
                      type="password"
                      defaultValue="123"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0047ab]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentStep('select')}
                  className="flex-grow py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all focus:outline-none text-center"
                >
                  Cancel Order
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isPaying}
                  className="flex-grow py-2.5 bg-[#0047ab] hover:bg-[#0f52ba] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 focus:outline-none disabled:opacity-50"
                >
                  {isPaying ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Authorizing...
                    </>
                  ) : (
                    paymentMethod === 'paypal_guest' ? 'PayPal Guest Pay' : 'Pay Now'
                  )}
                </button>
              </div>
            </div>
          );
        }

        if (paymentStep === 'success') {
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 animate-in scale-in duration-200 max-w-md mx-auto text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-outfit text-xl font-bold text-slate-900">Payment Successful!</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Your subscription status has been upgraded. PayPal Guest checkout finalized card transaction safely.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left text-[11px] font-bold text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>Subscribed Plan:</span> <span>{billingPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Gateway:</span> <span>PayPal Guest Checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span> <span className="text-emerald-600">Paid / Active</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentStep('select')}
                className="w-full py-2.5 bg-[#0047ab] hover:bg-[#0f52ba] text-white text-xs font-bold rounded-lg transition-all focus:outline-none"
              >
                Return to Billing Dashboard
              </button>
            </div>
          );
        }

        return null;
      case 'overview':
      default:
        return <Dashboard user={user} />;
    }
  };

  // Render Full Dark Admin Console when active
  if (activeTab === 'admin' && user) {
    return <AdminConsole user={user} onExit={() => { setActiveTab('dashboard'); setWorkspaceTab('overview'); }} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Persisted Nav Header containing Search strip */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setIsAuthOpen(true)}
        onPostClick={() => setIsModalOpen(true)}
        setActiveTab={handleDropdownTabClick}
        showSearch={true} // Search is always visible in the header in all views!
      />

      {/* Main Container */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'dashboard' && user ? (
          /* Figma-aligned 2-Column Logged In Layout */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Left Card navigation panel */}
            <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
              {/* User block details */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="h-10 w-10 rounded-full bg-[#0047ab] text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-outfit font-bold text-slate-900 text-sm truncate">{user.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mt-0.5">Free plan</p>
                </div>
              </div>

              {/* Sidebar navigation list */}
              <nav className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                {/* Overview link */}
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('overview')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    workspaceTab === 'overview' 
                      ? 'bg-blue-50 text-[#0047ab]' 
                      : 'hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Overview</span>
                  </div>
                </button>

                {/* My Listings link */}
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('listings')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    workspaceTab === 'listings' 
                      ? 'bg-blue-50 text-[#0047ab]' 
                      : 'hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>My Listings</span>
                  </div>
                  <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    4
                  </span>
                </button>

                {/* Applicants link */}
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('applicants')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    workspaceTab === 'applicants' 
                      ? 'bg-blue-50 text-[#0047ab]' 
                      : 'hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Applicants & Leads</span>
                  </div>
                  <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    2
                  </span>
                </button>

                {/* Saved Items link */}
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('saved')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    workspaceTab === 'saved' 
                      ? 'bg-blue-50 text-[#0047ab]' 
                      : 'hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>Saved Items</span>
                  </div>
                  <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    3
                  </span>
                </button>

                {/* Messages link */}
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('messages')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    workspaceTab === 'messages' 
                      ? 'bg-blue-50 text-[#0047ab]' 
                      : 'hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Messages</span>
                  </div>
                  <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    4
                  </span>
                </button>

                {/* Billing link */}
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('billing')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    workspaceTab === 'billing' 
                      ? 'bg-blue-50 text-[#0047ab]' 
                      : 'hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Billing</span>
                  </div>
                </button>

                {/* Profile link */}
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('profile')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    workspaceTab === 'profile' 
                      ? 'bg-blue-50 text-[#0047ab]' 
                      : 'hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Profile</span>
                  </div>
                </button>

                {/* Admin Console link (Direct entry for prototype testing!) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-amber-600 hover:bg-slate-50 hover:text-amber-700 transition-all font-bold"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Admin Console</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                </button>

              </nav>
            </aside>

            {/* Right Workspace container */}
            <div className="lg:col-span-3 min-w-0">
              {renderWorkspaceContent()}
            </div>

          </div>
        ) : (
          /* Public Homepage View (Matching Figma screenshots) */
          <div className="space-y-12">
            
            {/* Slogan Pill & Slogan Title */}
            <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6 py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                58,800+ active listings today
              </span>
              <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight">
                Norway's marketplace, <br />
                <span className="text-[#0047ab]">reimagined.</span>
              </h1>
              <p className="text-sm font-semibold text-slate-500 max-w-xl">
                One login for every category — jobs, cars, property, and everyday items.
              </p>
            </section>

            {/* 4-Category Cards Row */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Jobs Card */}
              <button
                type="button"
                onClick={() => handleCategoryCardClick('job')}
                className={`group text-center bg-white rounded-2xl border p-6 flex flex-col items-center gap-3 transition-all hover:shadow-md ${
                  selectedCategory === 'job' ? 'border-[#0047ab] ring-2 ring-blue-500/10' : 'border-slate-200'
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-slate-900 text-sm">Jobs</h3>
                  <p className="text-[11px] font-bold text-slate-400">14,500+</p>
                </div>
              </button>

              {/* Cars Card */}
              <button
                type="button"
                onClick={() => handleCategoryCardClick('classified', 'BMW')}
                className={`group text-center bg-white rounded-2xl border p-6 flex flex-col items-center gap-3 transition-all hover:shadow-md ${
                  selectedCategory === 'classified' && searchQuery === 'BMW' ? 'border-[#0047ab] ring-2 ring-blue-500/10' : 'border-slate-200'
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-550 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-slate-900 text-sm">Cars</h3>
                  <p className="text-[11px] font-bold text-slate-400">8,200+</p>
                </div>
              </button>

              {/* Property Card */}
              <button
                type="button"
                onClick={() => handleCategoryCardClick('classified', 'Apartment')}
                className={`group text-center bg-white rounded-2xl border p-6 flex flex-col items-center gap-3 transition-all hover:shadow-md ${
                  selectedCategory === 'classified' && searchQuery === 'Apartment' ? 'border-[#0047ab] ring-2 ring-blue-500/10' : 'border-slate-200'
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-slate-900 text-sm">Property</h3>
                  <p className="text-[11px] font-bold text-slate-400">5,100+</p>
                </div>
              </button>

              {/* Items Card */}
              <button
                type="button"
                onClick={() => handleCategoryCardClick('classified', 'Camera')}
                className={`group text-center bg-white rounded-2xl border p-6 flex flex-col items-center gap-3 transition-all hover:shadow-md ${
                  selectedCategory === 'classified' && searchQuery === 'Camera' ? 'border-[#0047ab] ring-2 ring-blue-500/10' : 'border-slate-200'
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-650 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-slate-900 text-sm">Items</h3>
                  <p className="text-[11px] font-bold text-slate-400">31,000+</p>
                </div>
              </button>
            </section>

            {/* Metrics Ribbon Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-200/80 pt-10">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-outfit font-extrabold text-xl text-slate-900 tracking-tight">58,800+</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Listings</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20H22V18C22 15.7909 20.2091 14 18 14H16c-.3813 0-.7492.0533-1.0972.1528M9 20H14V18C14 15.7909 12.2091 14 10 14H8c-2.20914 0-4 1.7909-4 4v2H9zM13 6C13 8.20914 11.2091 10 9 10C6.79086 10 5 8.20914 5 6C5 3.79086 6.79086 2 9 2C11.2091 2 13 3.79086 13 6zm7 2C7 9.65685 18.6569 11 17 11C15.3431 11 14 9.65685 14 8C14 6.34315 15.3431 5 17 5C18.6569 5 20 6.34315 20 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-outfit font-extrabold text-xl text-slate-900 tracking-tight">2.4M+</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Registered Users</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-outfit font-extrabold text-xl text-slate-900 tracking-tight">1,200+</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Companies Hiring</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-outfit font-extrabold text-xl text-slate-900 tracking-tight">3,500+</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Jobs Filled / Month</p>
                </div>
              </div>
            </section>

            {/* Featured Listings Feed Container */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#f05a28] font-bold text-xl leading-none">★</span>
                  <h2 className="font-outfit text-xl font-extrabold text-slate-950">Featured Listings</h2>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-[#f05a28] text-white text-[9px] font-bold uppercase tracking-wider">
                    Promoted
                  </span>
                </div>
                
                {/* Visual Navigation chevrons on right */}
                <div className="flex items-center gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-350 shadow-sm transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-350 shadow-sm transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Feed Grid */}
              <BrowseGrid
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                refreshTrigger={refreshTrigger}
              />
            </div>

            {/* Blue Hiring Banner at Bottom */}
            <section className="rounded-3xl bg-[#0047ab] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Hiring? Reach 2.4M+ professionals.
                </h3>
                <p className="text-sm font-semibold text-blue-100">
                  Post your first job free. Premium placement from ₹999/month.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('job');
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-6 py-3.5 rounded-xl bg-[#f05a28] hover:bg-[#f26522] text-sm font-extrabold text-white shadow-lg shadow-black/10 active:scale-98 transition-all shrink-0"
              >
                + Post a Job Ad
              </button>
            </section>

          </div>
        )}
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Auth Forms Overlay */}
      <AuthForms
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Post Listing Modal */}
      <ListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onListingCreated={handleListingCreated}
      />
    </div>
  );
}
