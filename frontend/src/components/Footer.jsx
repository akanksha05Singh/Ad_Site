import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5">
          {/* Brand */}
          <div>
            <img 
              src="/logo.png" 
              alt="freeads.no" 
              className="h-5 w-auto block"
            />
          </div>
          
          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-1">SUPPORT</h3>
            <a href="mailto:contact@freeads.no" className="text-base text-slate-600 hover:text-slate-900 transition-colors">
              contact@freeads.no
            </a>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-1">LEGAL</h3>
            <div className="flex flex-col gap-1">
              <a href="/" onClick={(e) => e.preventDefault()} className="text-base text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="/" onClick={(e) => e.preventDefault()} className="text-base text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} freeads.no. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
