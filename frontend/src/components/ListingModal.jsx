import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function ListingModal({ isOpen, onClose, onListingCreated, user }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    category: 'job',
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
    gender: 'Any'
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        contactEmail: prev.contactEmail || user?.email || '',
        contactPhone: prev.contactPhone || user?.phone || ''
      }));
    }
  }, [isOpen, user]);

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

      const response = await fetch(`${API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

      // Success
      setFormData({
        title: '',
        category: 'job',
        price: '',
        maxPrice: '',
        location: '',
        state: '',
        contactEmail: '',
        contactPhone: '',
        description: '',
        occupationCategory: '',
        fullTime: false,
        partTime: false,
        workFromHome: false
      });
      
      onListingCreated(data.data);
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
        <div className="relative inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
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



            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="category" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
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

            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="title" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
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

            {/* Job specific fields */}
            {formData.category === 'job' && (
              <>
                <div className="space-y-1">
                  <label htmlFor="occupationCategory" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Occupation</label>
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
                
                <div className="flex flex-wrap gap-4 pt-1">
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

                <div className="space-y-1 mt-2">
                  <label htmlFor="gender" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender Preference</label>
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
              </>
            )}

            {/* Row for Price, Location & State */}
            <div className={`grid grid-cols-1 ${formData.category === 'job' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
              {/* Salary / Price */}
              {formData.category === 'job' ? (
                <>
                  <div className="space-y-1">
                    <label htmlFor="price" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Min Salary (Per Month)
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 50,000"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="maxPrice" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Max Salary (Per Month)
                    </label>
                    <input
                      type="text"
                      id="maxPrice"
                      name="maxPrice"
                      value={formData.maxPrice}
                      onChange={handleChange}
                      placeholder="e.g. 1,00,000"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label htmlFor="price" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Price (NOK)
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

              {/* Location */}
              <div className="space-y-1">
                <label htmlFor="location" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <label htmlFor="state" className="text-xs font-bold text-slate-500 uppercase tracking-wide">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="contactEmail" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  readOnly
                  placeholder="e.g. contact@domain.no"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 cursor-not-allowed focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="contactPhone" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contact Phone</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="e.g. +47 123 45 678"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="contactWhatsapp" className="text-xs font-bold text-slate-500 uppercase tracking-wide">WhatsApp</label>
                <input
                  type="tel"
                  id="contactWhatsapp"
                  name="contactWhatsapp"
                  value={formData.contactWhatsapp}
                  onChange={handleChange}
                  placeholder="e.g. +47 123 45 678"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed description of the ad or job qualifications..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
              />
            </div>

            {/* Buttons */}
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
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 hover:shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing...
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
