import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Listing Policy', href: '#' },
    { label: 'Feedback', href: '#' },
    { label: 'Contact Us', href: 'mailto:contact@freeads.no' },
  ];

  return (
    <footer className="w-full bg-white mt-auto pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          {footerLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => {
                if (link.href === '#') e.preventDefault();
              }}
              className="text-[15px] sm:text-[16px] text-black font-normal hover:text-slate-600 transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-6 text-[14px] text-black font-normal text-center">
            &copy; {currentYear} freeads.no. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
