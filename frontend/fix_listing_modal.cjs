const fs = require('fs');
const path = require('path');

const modalPath = path.join(__dirname, 'src', 'components', 'ListingModal.jsx');
let content = fs.readFileSync(modalPath, 'utf8');

// Replace contactPhone input
const phoneInputOld = `<input
  type="tel"
  id="contactPhone"
  name="contactPhone"
  value={formData.contactPhone}
  onChange={handleChange}
  placeholder="e.g. +47 123 45 678"
  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
  />`;

const phoneInputNew = `<div className="flex">
  <select
    onChange={(e) => {
      const val = formData.contactPhone.replace(/^\\+\\d+\\s*/, '');
      handleChange({ target: { name: 'contactPhone', value: e.target.value + ' ' + val }});
    }}
    className="rounded-l-xl border border-r-0 border-slate-200 px-2 py-2.5 text-sm bg-slate-50 focus:outline-none text-slate-600"
  >
    <option value="+91">🇮🇳 +91</option>
    <option value="+47">🇳🇴 +47</option>
    <option value="+1">🇺🇸 +1</option>
    <option value="+44">🇬🇧 +44</option>
  </select>
  <input
    type="tel"
    id="contactPhone"
    name="contactPhone"
    value={formData.contactPhone.replace(/^\\+\\d+\\s*/, '')}
    onChange={(e) => {
      const codeMatch = formData.contactPhone.match(/^\\+\\d+/);
      const code = codeMatch ? codeMatch[0] : '+91';
      handleChange({ target: { name: 'contactPhone', value: code + ' ' + e.target.value }});
    }}
    placeholder="98765 43210"
    className="w-full rounded-r-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
  />
</div>`;

content = content.replace(phoneInputOld, phoneInputNew);

// Replace contactWhatsapp input
const whatsappInputOld = `<input
  type="tel"
  id="contactWhatsapp"
  name="contactWhatsapp"
  value={formData.contactWhatsapp}
  onChange={handleChange}
  placeholder="e.g. +47 123 45 678"
  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
  />`;

const whatsappInputNew = `<div className="flex">
  <select
    onChange={(e) => {
      const val = formData.contactWhatsapp.replace(/^\\+\\d+\\s*/, '');
      handleChange({ target: { name: 'contactWhatsapp', value: e.target.value + ' ' + val }});
    }}
    className="rounded-l-xl border border-r-0 border-slate-200 px-2 py-2.5 text-sm bg-slate-50 focus:outline-none text-slate-600"
  >
    <option value="+91">🇮🇳 +91</option>
    <option value="+47">🇳🇴 +47</option>
    <option value="+1">🇺🇸 +1</option>
    <option value="+44">🇬🇧 +44</option>
  </select>
  <input
    type="tel"
    id="contactWhatsapp"
    name="contactWhatsapp"
    value={formData.contactWhatsapp.replace(/^\\+\\d+\\s*/, '')}
    onChange={(e) => {
      const codeMatch = formData.contactWhatsapp.match(/^\\+\\d+/);
      const code = codeMatch ? codeMatch[0] : '+91';
      handleChange({ target: { name: 'contactWhatsapp', value: code + ' ' + e.target.value }});
    }}
    placeholder="98765 43210"
    className="w-full rounded-r-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
  />
</div>`;

content = content.replace(whatsappInputOld, whatsappInputNew);

fs.writeFileSync(modalPath, content, 'utf8');
console.log("ListingModal.jsx updated successfully.");
