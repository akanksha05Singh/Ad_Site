const fs = require('fs');
const path = require('path');

const modalPath = path.join(__dirname, 'src', 'components', 'ListingModal.jsx');
let content = fs.readFileSync(modalPath, 'utf8');

const startMarker = '<form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">';
const endMarker = '<div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3 mt-6">';

const startIndex = content.indexOf(startMarker) + startMarker.length;
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find markers!");
  process.exit(1);
}

const errorBlock = `
 {error && (
 <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
 <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
 </svg>
 {error}
 </div>
 )}
`;

const newFormLayout = `
 \${errorBlock}

 {/* Basic Info Row - Job title is smaller now (col-span-5) */}
 <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
   <div className="sm:col-span-3 space-y-1">
     <label htmlFor="category" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Category</label>
     <select
       id="category"
       name="category"
       value={formData.category}
       onChange={handleChange}
       className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all bg-white"
     >
       <option value="job">JOB</option>
     </select>
   </div>

   <div className="sm:col-span-5 space-y-1">
     <label htmlFor="title" className="text-sm font-bold text-slate-500 uppercase tracking-wide">
       {formData.category === 'job' ? 'Job Title' : 'Listing Title'}
     </label>
     <input
       type="text"
       id="title"
       name="title"
       value={formData.title}
       onChange={handleChange}
       placeholder="e.g. Senior Fullstack Engineer"
       className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
     />
   </div>

   {formData.category === 'job' && (
     <div className="sm:col-span-4 space-y-1">
       <label htmlFor="companyName" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Company Name</label>
       <input
         type="text"
         id="companyName"
         name="companyName"
         value={formData.companyName || ''}
         onChange={handleChange}
         placeholder="e.g. TechCorp"
         className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
       />
     </div>
   )}
 </div>

 {formData.category === 'job' && (
   <div className="grid grid-cols-1 gap-4">
     <div className="space-y-1">
       <label htmlFor="occupationCategory" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Occupation</label>
       <select
         id="occupationCategory"
         name="occupationCategory"
         value={formData.occupationCategory}
         onChange={handleChange}
         className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all bg-white"
       >
         <option value="">Select Occupation</option>
         <option value="Software Development">Software Development</option>
         <option value="Design">Design</option>
         <option value="Marketing">Marketing</option>
         <option value="Sales">Sales</option>
         <option value="Customer Support">Customer Support</option>
         <option value="Other">Other</option>
       </select>
     </div>
   </div>
 )}

 {/* Job preferences / Location */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
   {formData.category === 'job' && (
     <div className="space-y-1">
       <label htmlFor="gender" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Gender Preference</label>
       <select
         id="gender"
         name="gender"
         value={formData.gender}
         onChange={handleChange}
         className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all bg-white"
       >
         <option value="Any">Any Gender</option>
         <option value="Male">Male (1)</option>
         <option value="Female">Female (2)</option>
       </select>
     </div>
   )}
   
   <div className="space-y-1">
     <label htmlFor="location" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Location</label>
     <select
       id="location"
       name="location"
       value={formData.location || ''}
       onChange={handleChange}
       className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all bg-white"
     >
       <option value="">Select Location</option>
       <option value="Andhra Pradesh">Andhra Pradesh</option>
       <option value="Delhi">Delhi</option>
       <option value="Maharashtra">Maharashtra</option>
       <option value="Karnataka">Karnataka</option>
       <option value="Other">Other</option>
     </select>
   </div>
 </div>

 {/* Salary & Work Type */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
   {formData.category === 'job' ? (
     <div className="space-y-1">
       <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">
         Salary (per month)
       </label>
       <div className="flex gap-2">
         <input
           type="text"
           id="price"
           name="price"
           value={formData.price}
           onChange={handleChange}
           placeholder="Min"
           className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
         />
         <input
           type="text"
           id="maxPrice"
           name="maxPrice"
           value={formData.maxPrice}
           onChange={handleChange}
           placeholder="Max"
           className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
         />
       </div>
     </div>
   ) : (
     <div className="space-y-1">
       <label htmlFor="price" className="text-sm font-bold text-slate-500 uppercase tracking-wide">
         Price (₹)
       </label>
       <input
         type="number"
         id="price"
         name="price"
         min="0"
         value={formData.price}
         onChange={handleChange}
         placeholder="e.g. 15000"
         className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
       />
     </div>
   )}

   {formData.category === 'job' && (
     <div className="flex flex-col justify-center pt-5">
       <div className="flex flex-wrap gap-4">
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="checkbox" name="fullTime" checked={formData.fullTime} onChange={handleChange} className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" />
           <span className="text-sm font-medium text-slate-700">Full Time</span>
         </label>
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="checkbox" name="partTime" checked={formData.partTime} onChange={handleChange} className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" />
           <span className="text-sm font-medium text-slate-700">Part Time</span>
         </label>
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="checkbox" name="workFromHome" checked={formData.workFromHome} onChange={handleChange} className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" />
           <span className="text-sm font-medium text-slate-700">Work from Home</span>
         </label>
       </div>
     </div>
   )}
 </div>

 {/* Contact Information (Contact inputs are now Full Width to make them bigger) */}
 <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-100 mt-4">
   <div className="space-y-1">
     <label htmlFor="contactPhone" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Contact Phone</label>
     <div className="flex">
       <select
         onChange={(e) => {
           const val = formData.contactPhone.replace(/^\\+\\d+\\s*/, '');
           handleChange({ target: { name: 'contactPhone', value: e.target.value + ' ' + val }});
         }}
         className="rounded-l-xl border border-r-0 border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none text-slate-600"
         value={formData.contactPhone.match(/^\\+\\d+/) ? formData.contactPhone.match(/^\\+\\d+/)[0] : '+91'}
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
         className="w-full rounded-r-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
       />
     </div>
   </div>
   <div className="space-y-1">
     <label htmlFor="contactWhatsapp" className="text-sm font-bold text-slate-500 uppercase tracking-wide">WhatsApp</label>
     <div className="flex">
       <select
         onChange={(e) => {
           const val = formData.contactWhatsapp.replace(/^\\+\\d+\\s*/, '');
           handleChange({ target: { name: 'contactWhatsapp', value: e.target.value + ' ' + val }});
         }}
         className="rounded-l-xl border border-r-0 border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none text-slate-600"
         value={formData.contactWhatsapp.match(/^\\+\\d+/) ? formData.contactWhatsapp.match(/^\\+\\d+/)[0] : '+91'}
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
         className="w-full rounded-r-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
       />
     </div>
   </div>

   <div className="space-y-1">
     <label htmlFor="contactEmail" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Contact Email</label>
     <input
       type="email"
       id="contactEmail"
       name="contactEmail"
       value={formData.contactEmail}
       onChange={handleChange}
       readOnly
       placeholder="e.g. contact@domain.no"
       className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 cursor-not-allowed focus:outline-none transition-all"
     />
   </div>
   <div className="space-y-1">
     <label htmlFor="companyWebsite" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Website</label>
     <input
       type="url"
       id="companyWebsite"
       name="companyWebsite"
       value={formData.companyWebsite || ''}
       onChange={handleChange}
       placeholder="e.g. https://www.example.com"
       className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
     />
   </div>
 </div>

 {/* Description */}
 <div className="space-y-1 mt-4">
   <label htmlFor="description" className="text-sm font-bold text-slate-500 uppercase tracking-wide">Description</label>
   <textarea
     id="description"
     name="description"
     rows="6"
     value={formData.description}
     onChange={handleChange}
     placeholder="Provide detailed description of the ad or job qualifications..."
     className="w-full resize-y min-h-[100px] rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
   />
 </div>

 <div className="pt-2">
   <label className="flex items-center gap-2 cursor-pointer">
     <input
       type="checkbox"
       name="isFeatured"
       checked={formData.isFeatured}
       onChange={handleChange}
       className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
     />
     <span className="text-sm font-medium text-slate-700">Featured Ad</span>
   </label>
 </div>
\n`;

const updatedContent = content.substring(0, startIndex) + newFormLayout + content.substring(endIndex);
fs.writeFileSync(modalPath, updatedContent, 'utf8');

console.log('Layout successfully refactored');
