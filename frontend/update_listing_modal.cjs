const fs = require('fs');
const path = require('path');

const modalPath = path.join(__dirname, 'src', 'components', 'ListingModal.jsx');
let content = fs.readFileSync(modalPath, 'utf8');

// 1. Remove companyWebsite from the job-specific section
const websiteFieldRegex = /<div className="space-y-1">\s*<label htmlFor="companyWebsite"[^>]*>Website<\/label>\s*<input[^>]*name="companyWebsite"[\s\S]*?<\/div>/;
content = content.replace(websiteFieldRegex, '');

// 2. Change the Contact Information grid to 2 columns to allow space for the Website
content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">/,
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">'
);

// 3. Add value attribute to contactPhone select
content = content.replace(
  /name: 'contactPhone', value: e\.target\.value \+ ' ' \+ val \}\}\);\s*\}\}\s*className="rounded-l-xl[^"]*"/,
  `$&
    value={formData.contactPhone.match(/^\\+\\d+/) ? formData.contactPhone.match(/^\\+\\d+/)[0] : '+91'}`
);

// 4. Add value attribute to contactWhatsapp select
content = content.replace(
  /name: 'contactWhatsapp', value: e\.target\.value \+ ' ' \+ val \}\}\);\s*\}\}\s*className="rounded-l-xl[^"]*"/,
  `$&
    value={formData.contactWhatsapp.match(/^\\+\\d+/) ? formData.contactWhatsapp.match(/^\\+\\d+/)[0] : '+91'}`
);

// 5. Inject the Website field right after contactWhatsapp in the grid
const websiteInjection = `
  <div className="space-y-1">
    <label htmlFor="companyWebsite" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Website</label>
    <input
      type="url"
      id="companyWebsite"
      name="companyWebsite"
      value={formData.companyWebsite || ''}
      onChange={handleChange}
      placeholder="e.g. https://www.example.com"
      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
    />
  </div>`;

// We inject it after the contactWhatsapp block
const whatsappEndRegex = /name: 'contactWhatsapp'[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(whatsappEndRegex, match => match + websiteInjection);

fs.writeFileSync(modalPath, content, 'utf8');
console.log("ListingModal updated successfully.");
