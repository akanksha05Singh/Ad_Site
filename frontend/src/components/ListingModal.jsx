import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function ListingModal({ isOpen, onClose, onListingCreated, onListingUpdated, initialData, user }) {
 if (!isOpen) return null;

 const [formData, setFormData] = useState({
 category: 'job',
 title: '',
 companyName: '',
 companyWebsite: '',
 price: '', // Min Salary or Price
 maxPrice: '', // Max Salary for jobs
 location: '',
 state: '',
 contactEmail: '',
 contactPhone: '',
 contactWhatsapp: '',
 description: '',
 occupationCategory: '',
 employmentType: '', // 'Full-time' or 'Part-time' or both via checkboxes
 fullTime: false,
 partTime: false,
 workFromHome: false,
 gender: 'Any',
 isFeatured: false
 });

 useEffect(() => {
 if (isOpen) {
 if (initialData) {
 setFormData({
 category: initialData.category || 'job',
 title: initialData.title || '',
 companyName: initialData.companyName || '',
 companyWebsite: initialData.companyWebsite || '',
 price: initialData.price ? initialData.price.toLocaleString('en-IN') : '',
 maxPrice: initialData.maxPrice ? initialData.maxPrice.toLocaleString('en-IN') : '',
 location: initialData.location || '',
 state: initialData.state || '',
 contactEmail: initialData.contactEmail || '',
 contactPhone: initialData.contactPhone ? (initialData.contactPhone.startsWith('+') ? initialData.contactPhone : '+91 ' + initialData.contactPhone) : '',
 contactWhatsapp: initialData.contactWhatsapp ? (initialData.contactWhatsapp.startsWith('+') ? initialData.contactWhatsapp : '+91 ' + initialData.contactWhatsapp) : '',
 description: initialData.description || '',
 occupationCategory: initialData.occupationCategory || '',
 employmentType: initialData.employmentType || '',
 fullTime: initialData.employmentType?.includes('Full-time') || false,
 partTime: initialData.employmentType?.includes('Part-time') || false,
 workFromHome: initialData.workFromHome || false,
 gender: initialData.gender || 'Any',
 isFeatured: initialData.isFeatured || false
 });
 } else {
 setFormData({
 category: 'job',
 title: '',
 companyName: '',
 companyWebsite: '',
 price: '',
 maxPrice: '',
 location: '',
 state: '',
 contactEmail: user?.email || '',
 contactPhone: user?.phone ? (user.phone.startsWith('+') ? user.phone : '+91 ' + user.phone) : '',
 contactWhatsapp: '',
 description: '',
 occupationCategory: '',
 employmentType: '',
 fullTime: false,
 partTime: false,
 workFromHome: false,
 gender: 'Any',
 isFeatured: false
 });
 }
 }
 }, [isOpen, initialData, user]);

 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleChange = (e) => {
 const { name, value, type, checked } = e.target;
 
 // Auto-format numbers with commas for salary fields
 if (name === 'price' || name === 'maxPrice') {
 const rawValue = value.replace(/,/g, '');
 if (rawValue === '' || !isNaN(rawValue)) {
 // Format with Indian commas (en-IN)
 const formatted = rawValue ? Number(rawValue).toLocaleString('en-IN') : '';
 setFormData(prev => ({ ...prev, [name]: formatted }));
 }
 return;
 }

 setFormData(prev => ({
 ...prev,
 [name]: type === 'checkbox' ? checked : value
 }));
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 
 // Basic validation
 if (!formData.title.trim()) return setError('Title is required');
 // Parse formatted numbers back to plain numbers
 const parsedMinPrice = formData.price ? Number(formData.price.toString().replace(/,/g, '')) : 0;
 const parsedMaxPrice = formData.maxPrice ? Number(formData.maxPrice.toString().replace(/,/g, '')) : 0;

 if (parsedMinPrice < 0) {
 return setError(formData.category === 'job' ? 'Salary must be a positive number' : 'Price must be a positive number');
 }

 
  if (formData.category === 'job' && parsedMaxPrice > 0 && parsedMaxPrice <= parsedMinPrice) {
    return setError('Maximum salary must be greater than minimum salary');
  }

  if (!formData.location.trim()) return setError('Location is required');
 if (!formData.contactEmail.trim()) return setError('Contact email is required');
 if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.contactEmail)) {
 return setError('Please enter a valid email address');
 }
 if (!formData.description.trim()) return setError('Description is required');

 setLoading(true);

 try {
 // Determine employmentType string from checkboxes
 let empType = '';
 if (formData.fullTime && formData.partTime) empType = 'Full-time, Part-time';
 else if (formData.fullTime) empType = 'Full-time';
 else if (formData.partTime) empType = 'Part-time';

 const url = initialData 
 ? `${API_BASE_URL}/api/listings/${initialData._id}` 
 : `${API_BASE_URL}/api/listings`;
 const method = initialData ? 'PUT' : 'POST';

 const token = localStorage.getItem('token');
 const headers = {
 'Content-Type': 'application/json'
 };
 if (token) {
 headers['Authorization'] = `Bearer ${token}`;
 }

 const response = await fetch(url, {
 method,
 headers,
 body: JSON.stringify({
 ...formData,
 price: parsedMinPrice,
 maxPrice: formData.category === 'job' && parsedMaxPrice ? parsedMaxPrice : undefined,
 employmentType: formData.category === 'job' ? empType : undefined
 })
 });

 const data = await response.json();

 if (!response.ok) {
 throw new Error(data.error || 'Failed to submit listing');
 }

 if (initialData && onListingUpdated) {
 onListingUpdated(data.data);
 } else if (onListingCreated) {
 onListingCreated(data.data);
 }
 onClose();
 } catch (err) {
 setError(err.message || 'Something went wrong. Please try again.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 {/* Backdrop overlay */}
 <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
 <div 
 className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
 aria-hidden="true"
 onClick={onClose}
 />

 {/* Trick to center modal content */}
 <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

 {/* Modal panel */}
 <div className="relative inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
 {/* Header */}
 <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
 <h3 className="font-outfit text-lg font-bold text-slate-900" id="modal-title">
 {formData.category === 'job' ? 'Post a Job' : 'Post an Ad / Listing'}
 </h3>
 <button
 onClick={onClose}
 className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Form */}
 <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
  {error && (
  <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
  <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
  {error}
  </div>
  )}

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
           const val = formData.contactPhone.replace(/^\+\d+\s*/, '');
           handleChange({ target: { name: 'contactPhone', value: e.target.value + ' ' + val }});
         }}
         className="rounded-l-xl border border-r-0 border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none text-slate-600"
         value={formData.contactPhone.match(/^\+\d+/) ? formData.contactPhone.match(/^\+\d+/)[0] : '+91'}
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
         value={formData.contactPhone.replace(/^\+\d+\s*/, '')}
         onChange={(e) => {
           const codeMatch = formData.contactPhone.match(/^\+\d+/);
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
           const val = formData.contactWhatsapp.replace(/^\+\d+\s*/, '');
           handleChange({ target: { name: 'contactWhatsapp', value: e.target.value + ' ' + val }});
         }}
         className="rounded-l-xl border border-r-0 border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none text-slate-600"
         value={formData.contactWhatsapp.match(/^\+\d+/) ? formData.contactWhatsapp.match(/^\+\d+/)[0] : '+91'}
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
         value={formData.contactWhatsapp.replace(/^\+\d+\s*/, '')}
         onChange={(e) => {
           const codeMatch = formData.contactWhatsapp.match(/^\+\d+/);
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

<div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3 mt-6">
 <button
 type="button"
 onClick={onClose}
 disabled={loading}
 className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={loading}
 className="px-5 py-2.5 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-brand-600 transition-all flex items-center gap-2 disabled:opacity-50"
 >
 {loading ? (
 <>
 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
 </svg>
 {initialData ? 'Saving...' : 'Publishing...'}
 </>
 ) : 'Publish Listing'}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
}
