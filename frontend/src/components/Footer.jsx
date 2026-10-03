import React from 'react';

export default function Footer() {
 return (
 <footer className="w-full bg-white border-t border-slate-200 mt-auto">
 <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 <div className="flex flex-col items-center gap-0">
 {/* Brand */}
 <div className="mb-0">
 <img 
 src="/logo.png" 
 alt="freeads.no" 
 className="h-5 w-auto block"
 />
 </div>
 
 <div className="text-center mt-0.5">
 <h3 className="text-[13px] font-extrabold text-black uppercase leading-none mb-0">SUPPORT</h3>
 <a href="mailto:contact@freeads.no" className="text-[13px] text-slate-600 hover:text-slate-900 transition-colors block leading-none">
 contact@freeads.no
 </a>
 </div>

 <div className="text-center mt-0.5">
 <h3 className="text-[13px] font-extrabold text-black uppercase leading-none mb-0">LEGAL</h3>
 <div className="flex flex-col gap-0">
 <a href="/" onClick={(e) => e.preventDefault()} className="text-[13px] text-slate-600 hover:text-slate-900 transition-colors leading-none">Privacy Policy</a>
 <a href="/" onClick={(e) => e.preventDefault()} className="text-[13px] text-slate-600 hover:text-slate-900 transition-colors leading-none">Terms of Service</a>
 </div>
 </div>

 {/* Copyright */}
 <div className="mt-1 text-center text-[11px] text-slate-500">
 &copy; {new Date().getFullYear()} freeads.no. All rights reserved.
 </div>
 </div>
 </div>
 </footer>
 );
}
