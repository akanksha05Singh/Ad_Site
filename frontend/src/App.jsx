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
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';

export default function App() {
  // Authentication States
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Page-level routing: 'home' | 'signin' | 'signup' | 'app'
  // 'app' = the main SPA (feed + dashboard + admin)
  const [activePage, setActivePage] = useState('home');

  // Tab View Navigation
  // activeTab: 'feed', 'dashboard', 'admin'
  const [activeTab, setActiveTab] = useState('feed'); 
  
  // workspaceTab (sub-tabs inside logged-in dashboard view)
  // 'overview', 'listings', 'applicants', 'saved', 'messages', 'billing', 'profile'
  const [workspaceTab, setWorkspaceTab] = useState('overview');

  // Listing creation & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMinSalary, setFilterMinSalary] = useState('');
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
      setActivePage('app');
    }
  }, []);

  const handleAuthSuccess = (authUser, authToken) => {
    setUser(authUser);
    setToken(authToken);
    setActiveTab('dashboard'); 
    setWorkspaceTab('find-jobs');
    setActivePage('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken('');
    setActiveTab('feed');
    setActivePage('home');
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
    } else if (tabName === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
      setWorkspaceTab(tabName);
    }
  };

  // Render Screens inside Dashboard Right Column
  const renderWorkspaceContent = () => {
    switch (workspaceTab) {
      case 'find-jobs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-outfit text-xl font-medium text-slate-900">Find Jobs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Keywords</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0047ab] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Oslo"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0047ab] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Min Salary (NOK)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={filterMinSalary}
                    onChange={(e) => setFilterMinSalary(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0047ab] transition-colors"
                  />
                </div>
              </div>
            </div>
            <BrowseGrid 
              searchQuery={searchQuery} 
              selectedCategory="job" 
              location={filterLocation}
              minPrice={filterMinSalary}
              refreshTrigger={refreshTrigger} 
            />
          </div>
        );
      case 'listings':
        return <MyListings user={user} />;
      case 'messages':
        return <ChatWindow user={user} />;
      case 'profile':
        return <UserProfile user={user} onProfileUpdate={setUser} setWorkspaceTab={setWorkspaceTab} />;
      case 'applicants':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="font-outfit text-xl font-medium text-slate-900">Applicants & Leads</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-normal text-slate-500">
                <thead className="bg-slate-50 text-xs text-slate-450 uppercase tracking-wider border-b border-slate-150">
                  <tr>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Applied Position</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-4 font-medium text-slate-900">Priya Nair</td>
                    <td className="px-4 py-4">Senior Product Designer</td>
                    <td className="px-4 py-4 text-slate-400">2 minutes ago</td>
                    <td className="px-4 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-normal">Reviewing</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-medium text-slate-900">Amit Patel</td>
                    <td className="px-4 py-4">Staff Software Engineer</td>
                    <td className="px-4 py-4 text-slate-400">2 days ago</td>
                    <td className="px-4 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-normal">Shortlisted</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'saved':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="font-outfit text-xl font-medium text-slate-900">Saved Items ({selectedCategory === 'all' ? '3' : '1'})</h2>
            <p className="text-sm text-slate-400">Items and ads you bookmarked for later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 flex gap-4">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">2023 BMW 3 Series 320d</h4>
                  <p className="text-[#f05a28] font-normal text-sm mt-1">₹42,50,000</p>
                  <p className="text-xs text-slate-400 mt-2">Saved 3 days ago</p>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex gap-4">
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">3BHK Sea-View Apartment</h4>
                  <p className="text-[#f05a28] font-normal text-sm mt-1">₹3.2 Cr</p>
                  <p className="text-xs text-slate-400 mt-2">Saved Yesterday</p>
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
                <h2 className="font-outfit text-xl font-medium text-slate-900">Billing & Subscriptions</h2>
                <p className="text-sm text-slate-400">Manage your active plans, payment cards, and invoices.</p>
              </div>

              {/* Current Active Plan Card */}
              <div className="p-5 bg-[#0047ab]/5 rounded-2xl flex items-center justify-between border border-[#0047ab]/10">
                <div className="space-y-1">
                  <p className="text-xs font-normal text-[#0047ab] uppercase tracking-wide">Current active subscription</p>
                  <h4 className="font-outfit text-lg font-medium text-slate-900">{billingPlan}</h4>
                  <p className="text-sm font-normal text-slate-500">
                    {billingPlan === 'Free Tier Plan' 
                      ? 'Upgrade your plan to unlock premium seller analytics and listing boosts.'
                      : 'Thank you for supporting Norway\'s premier digital classifieds platform!'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-normal uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Upgrade Options */}
              <div className="space-y-4">
                <h3 className="text-sm font-normal text-slate-400 uppercase tracking-wider">Select an Upgrade Option</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Premium Publisher */}
                  <div className="border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-350 hover:shadow-sm transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-outfit font-medium text-slate-900 text-sm">Premium Publisher</h4>
                        <span className="text-sm font-normal text-[#0047ab]">₹999 / mo</span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        Perfect for frequent sellers and small businesses looking to maximize exposure.
                      </p>
                      <ul className="text-xs font-normal text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          <span>Post unlimited classified ads & jobs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          <span>Get a blue verified company registry badge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          <span>Access real-time listings traffic analytics</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartCheckout('premium')}
                      className="w-full mt-4 py-2 bg-[#0047ab] hover:bg-[#0f52ba] text-white text-sm font-normal rounded-lg transition-all"
                    >
                      Upgrade to Premium
                    </button>
                  </div>

                  {/* Featured Seller Boost */}
                  <div className="border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-350 hover:shadow-sm transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-outfit font-medium text-slate-900 text-sm">Featured Seller Boost</h4>
                        <span className="text-sm font-normal text-[#f05a28]">₹1,999 / mo</span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        For maximum acceleration. Adds tags and overrides rank to keep listings on top.
                      </p>
                      <ul className="text-xs font-normal text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          <span>Everything included in Premium tier</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          <span>Automated orange ★ Featured card badges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          <span>High-priority listing rank in search results</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartCheckout('featured')}
                      className="w-full mt-4 py-2 bg-[#f05a28] hover:bg-[#f26522] text-white text-sm font-normal rounded-lg transition-all"
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
                <h2 className="font-outfit text-xl font-medium text-slate-900">Secure Checkout</h2>
                <p className="text-sm text-slate-450">Review your subscription order and finalize payment details.</p>
              </div>

              {/* Order Summary Block */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-normal text-slate-900">{planTitle}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Recurring Monthly Billing</p>
                </div>
                <span className="text-sm font-normal text-slate-900">{planCost}</span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-xs font-normal text-slate-400 uppercase tracking-wider">Select Payment Method</h3>
                
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
                      <span className="text-sm font-normal text-slate-900">PayPal Guest Checkout</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-medium uppercase">Recommended</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Pay directly using your debit or credit card without being forced to create a PayPal account. Secured by PayPal.
                    </p>
                    {/* Card logo strip */}
                    <div className="flex gap-1.5 pt-1">
                      <span className="text-[8px] font-medium px-1 py-0.5 bg-slate-100 text-slate-600 rounded">VISA</span>
                      <span className="text-[8px] font-medium px-1 py-0.5 bg-slate-100 text-slate-600 rounded">MC</span>
                      <span className="text-[8px] font-medium px-1 py-0.5 bg-slate-100 text-slate-600 rounded">AMEX</span>
                      <span className="text-[8px] font-medium px-1 py-0.5 bg-slate-100 text-slate-600 rounded">DISC</span>
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
                    <span className="text-sm font-normal text-slate-900">Standard Card Entry</span>
                    <p className="text-xs text-slate-500 font-medium">Enter card details directly in manual forms.</p>
                  </div>
                </label>
              </div>

              {/* Simulated Card inputs */}
              <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
                <div className="space-y-1">
                  <label className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue="Arjun Sharma"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 bg-white focus:outline-none focus:border-[#0047ab]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 bg-white focus:outline-none focus:border-[#0047ab]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">CVV</label>
                    <input
                      type="password"
                      defaultValue="123"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 bg-white focus:outline-none focus:border-[#0047ab]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentStep('select')}
                  className="flex-grow py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-normal transition-all focus:outline-none text-center"
                >
                  Cancel Order
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isPaying}
                  className="flex-grow py-2.5 bg-[#0047ab] hover:bg-[#0f52ba] text-white text-sm font-normal rounded-lg transition-all flex items-center justify-center gap-1.5 focus:outline-none disabled:opacity-50"
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
                <h3 className="font-outfit text-xl font-medium text-slate-900">Payment Successful!</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Your subscription status has been upgraded. PayPal Guest checkout finalized card transaction safely.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left text-sm font-normal text-slate-700 space-y-1">
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
                className="w-full py-2.5 bg-[#0047ab] hover:bg-[#0f52ba] text-white text-sm font-normal rounded-lg transition-all focus:outline-none"
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

  // ── Page-level routing guards ──

  // Landing page (unauthenticated home)
  if (activePage === 'home') {
    return (
      <LandingPage
        onSignInClick={() => setActivePage('signin')}
        user={user}
        onLogout={handleLogout}
        onJobsClick={() => {
          if (user) {
            setActiveTab('dashboard');
            setWorkspaceTab('find-jobs');
            setActivePage('app');
          } else {
            setActivePage('signin');
          }
        }}
        onDashboardClick={() => {
          setActiveTab('dashboard');
          setActivePage('app');
        }}
      />
    );
  }

  if (activePage === 'signin') {
    return (
      <SignInPage
        onAuthSuccess={handleAuthSuccess}
        onGoSignUp={() => setActivePage('signup')}
        onGoHome={() => setActivePage('home')}
      />
    );
  }

  if (activePage === 'signup') {
    return (
      <SignUpPage
        onAuthSuccess={handleAuthSuccess}
        onGoSignIn={() => setActivePage('signin')}
        onGoHome={() => setActivePage('home')}
      />
    );
  }

  // Render Full Dark Admin Console when active
  if (activeTab === 'admin' && user) {
    return <AdminConsole user={user} onExit={() => { setActiveTab('dashboard'); setWorkspaceTab('overview'); }} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Persisted Nav Header containing Search strip */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setActivePage('signin')}
        onPostClick={() => setIsModalOpen(true)}
        setActiveTab={handleDropdownTabClick}
        onHomeClick={() => {
          setActiveTab('feed');
          setActivePage('home');
        }}
        showSearch={activeTab !== 'feed'} // Search is completely removed from the home feed
      />

      {/* Main Container */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'dashboard' && user ? (
          <div className="w-full">
            {renderWorkspaceContent()}
          </div>
        ) : activeTab === 'browse' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-medium text-slate-900">Browse Jobs</h1>
            </div>
            <BrowseGrid 
              searchQuery={searchQuery} 
              selectedCategory="job" 
              refreshTrigger={refreshTrigger} 
            />
          </div>
        ) : (
          <LandingPage
            onSignInClick={() => setActivePage('signin')}
            user={user}
            onLogout={handleLogout}
            hideHeader={true}
            onJobsClick={() => setActiveTab('browse')}
            onHomeClick={() => {
              setActiveTab('feed');
              setActivePage('home');
            }}
            onDashboardClick={() => setActiveTab('dashboard')}
          />
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
        user={user}
      />
    </div>
  );
}
