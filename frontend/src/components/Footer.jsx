import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-extrabold text-sm">
                f!
              </span>
              <span className="font-outfit text-lg font-bold tracking-tight text-slate-900">
                freeads<span className="text-brand-500">.no</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Norway's modern classified ads and job listings board. Fast, free, and local.
            </p>
          </div>

          {/* Links Grid */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Browse</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">Classified Ads</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">Job Openings</a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">Help Center</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">Safety Tips</a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} freeads.no. All rights reserved. Made in Norway.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-slate-300">Stage 1 MVP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
