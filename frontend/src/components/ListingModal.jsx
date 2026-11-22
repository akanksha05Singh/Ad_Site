import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { ALL_LOCATIONS } from '../constants/locations';

const OCCUPATION_OPTIONS = [
  'Engineer',
  'Graphic Designer',
  'Software Developer',
  'Product Designer',
  'Marketing Specialist',
  'Plumber',
  'Electrician',
  'Sales Executive',
  'Accountant',
  'Customer Support',
  'Other'
];

const LOCATION_OPTIONS = ALL_LOCATIONS;

const SALARY_MIN_OPTIONS = [
  '15,000',
  '20,000',
  '25,000',
  '30,000',
  '40,000',
  '50,000',
  '75,000',
  '1,00,000'
];

const SALARY_MAX_OPTIONS = [
  '25,000',
  '35,000',
  '45,000',
  '60,000',
  '80,000',
  '1,00,000',
  '1,50,000',
  '2,00,000+'
];

export default function ListingModal({ isOpen, onClose, onListingCreated, onListingUpdated, initialData, user }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    category: 'JOB',
    title: '',
    occupationCategory: 'Engineer',
    location: '',
    price: '25,000',
    maxPrice: '35,000',
    gender: 'Any',
    employmentType: 'Any', // 'Full time', 'Part time', 'Work from home', 'Any'
    companyName: '',
    companyWebsite: '',
    contactEmail: '',
    description: '',
    isFeatured: false,
    contactPerson: '',
    designation: '',
    contactPhone: '',
    phoneCountryCode: '+91',
    hidePhone: false,
    contactWhatsapp: '',
    whatsappCountryCode: '+91'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          category: initialData.category ? initialData.category.toUpperCase() : 'JOB',
          title: initialData.title || '',
          occupationCategory: initialData.occupationCategory || 'Engineer',
          location: initialData.location || '',
          price: initialData.price ? initialData.price.toLocaleString('en-IN') : '25,000',
          maxPrice: initialData.maxPrice ? initialData.maxPrice.toLocaleString('en-IN') : '35,000',
          gender: initialData.gender || 'Any',
          employmentType: initialData.employmentType || 'Any',
          companyName: initialData.companyName || '',
          companyWebsite: initialData.companyWebsite || '',
          contactEmail: initialData.contactEmail || user?.email || '',
          description: initialData.description || '',
          isFeatured: initialData.isFeatured || false,
          contactPerson: initialData.contactPerson || '',
          designation: initialData.designation || '',
          contactPhone: initialData.contactPhone || '',
          phoneCountryCode: initialData.phoneCountryCode || '+91',
          hidePhone: initialData.hidePhone || false,
          contactWhatsapp: initialData.contactWhatsapp || '',
          whatsappCountryCode: initialData.whatsappCountryCode || '+91'
        });
      } else {
        setFormData({
          category: 'JOB',
          title: '',
          occupationCategory: 'Engineer',
          location: '',
          price: '25,000',
          maxPrice: '35,000',
          gender: 'Any',
          employmentType: 'Any',
          companyName: '',
          companyWebsite: '',
          contactEmail: user?.email || '',
          description: '',
          isFeatured: false,
          contactPerson: '',
          designation: '',
          contactPhone: '',
          phoneCountryCode: '+91',
          hidePhone: false,
          contactWhatsapp: '',
          whatsappCountryCode: '+91'
        });
      }
    }
  }, [isOpen, initialData, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmploymentTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      employmentType: type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Job title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Job description is required');
      return;
    }

    setLoading(true);

    try {
      const parsedMinPrice = parseInt(String(formData.price).replace(/[^0-9]/g, ''), 10) || 0;
      const parsedMaxPrice = parseInt(String(formData.maxPrice).replace(/[^0-9]/g, ''), 10) || 0;

      const payload = {
        title: formData.title,
        category: 'job',
        occupationCategory: formData.occupationCategory,
        location: formData.location || 'Bangalore',
        price: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        gender: formData.gender,
        employmentType: formData.employmentType,
        workFromHome: formData.employmentType === 'Work from home',
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        contactEmail: formData.contactEmail,
        description: formData.description,
        isFeatured: formData.isFeatured,
        contactPerson: formData.contactPerson,
        designation: formData.designation,
        contactPhone: formData.contactPhone,
        phoneCountryCode: formData.phoneCountryCode,
        hidePhone: formData.hidePhone,
        contactWhatsapp: formData.contactWhatsapp,
        whatsappCountryCode: formData.whatsappCountryCode,
        imageUrl: user?.profilePhoto || user?.avatar || ''
      };

      const url = initialData
        ? `${API_BASE_URL}/api/listings/${initialData._id}`
        : `${API_BASE_URL}/api/listings`;

      const method = initialData ? 'PUT' : 'POST';
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text && text.length < 200 ? text : `Server returned ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit job listing');
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
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-left">
        {/* White Card Container matching PDF layout */}
        <div className="relative w-full max-w-[620px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 z-10">

          {/* Close button top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-black p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-4 text-[14px] text-slate-800">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Row 1: Category* (Left) & Job title* (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
              <div className="sm:col-span-5">
                <label className="block text-slate-800 text-[13.5px] font-medium mb-1">
                  Category<span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-slate-300 text-slate-700 bg-white text-[13.5px] focus:outline-none focus:border-slate-500 appearance-none cursor-pointer"
                  >
                    <option value="JOB">JOB</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-7">
                <label className="block text-slate-800 text-[13.5px] font-medium mb-1">
                  Job title<span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Eg. Front end full stack engineer"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-[13.5px] focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Row 2: Occupation* (Left) & Location* (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
              <div className="sm:col-span-6">
                <label className="block text-slate-800 text-[13.5px] font-medium mb-1">
                  Occupation<span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    name="occupationCategory"
                    value={formData.occupationCategory}
                    onChange={handleChange}
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-slate-300 text-slate-700 bg-white text-[13.5px] focus:outline-none focus:border-slate-500 appearance-none cursor-pointer"
                  >
                    {OCCUPATION_OPTIONS.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-slate-800 text-[13.5px] font-medium mb-1">
                  Location<span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-slate-300 text-slate-700 bg-white text-[13.5px] focus:outline-none focus:border-slate-500 appearance-none cursor-pointer"
                  >
                    <option value="">Select location</option>
                    {LOCATION_OPTIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Salary per month* (Min / Max) & Gender preference */}
            <div>
              <label className="block text-slate-800 text-[13.5px] font-medium mb-1">
                Salary per month<span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">

                {/* Min */}
                <div className="sm:col-span-3 flex items-center gap-1.5">
                  <span className="text-slate-700 text-[13.5px]">Min</span>
                  <div className="relative flex-1">
                    <select
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full h-10 px-2.5 pr-7 rounded-lg border border-slate-300 text-slate-700 bg-white text-[13px] focus:outline-none focus:border-slate-500 appearance-none cursor-pointer"
                    >
                      {SALARY_MIN_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Max */}
                <div className="sm:col-span-3 flex items-center gap-1.5">
                  <span className="text-slate-700 text-[13.5px]">Max</span>
                  <div className="relative flex-1">
                    <select
                      name="maxPrice"
                      value={formData.maxPrice}
                      onChange={handleChange}
                      className="w-full h-10 px-2.5 pr-7 rounded-lg border border-slate-300 text-slate-700 bg-white text-[13px] focus:outline-none focus:border-slate-500 appearance-none cursor-pointer"
                    >
                      {SALARY_MAX_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Gender preference */}
                <div className="sm:col-span-6">
                  <div className="flex flex-col">
                    <span className="text-slate-800 text-[13.5px] font-medium mb-1">Gender preference</span>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full h-10 px-3 pr-8 rounded-lg border border-slate-300 text-slate-700 bg-white text-[13.5px] focus:outline-none focus:border-slate-500 appearance-none cursor-pointer"
                      >
                        <option value="Any">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Employment Type Checkboxes */}
            <div className="pt-1 space-y-2">
              {['Full time', 'Part time', 'Work from home', 'Any'].map(type => {
                const isChecked = formData.employmentType === type;
                return (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer text-[13.5px] text-slate-800">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleEmploymentTypeToggle(type)}
                      className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                );
              })}
            </div>

            {/* Company name */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center pt-1">
              <label className="sm:col-span-4 text-slate-800 text-[13.5px] font-normal">
                Company name
              </label>
              <div className="sm:col-span-8">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-slate-800 text-[13.5px] focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Company website */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <label className="sm:col-span-4 text-slate-800 text-[13.5px] font-normal">
                Company website
              </label>
              <div className="sm:col-span-8">
                <input
                  type="text"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-slate-800 text-[13.5px] focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <label className="sm:col-span-4 text-slate-800 text-[13.5px] font-normal">
                Email
              </label>
              <div className="sm:col-span-8">
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-slate-800 text-[13.5px] focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Job description */}
            <div className="pt-2">
              <label className="block text-slate-800 text-[13.5px] font-normal mb-1.5">
                Job discription
              </label>
              <textarea
                name="description"
                rows="7"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-800 text-[13.5px] focus:outline-none focus:border-slate-500 resize-none"
              />
            </div>

            {/* Featured jobs checkbox + bullet notes */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-black focus:ring-black cursor-pointer"
                />
                <span className="text-[13.5px] font-medium text-slate-900">Featured jobs</span>
              </label>
              <ul className="list-disc list-inside pl-6 mt-1 text-[12.5px] text-slate-700 space-y-0.5">
                <li>High visibility</li>
                <li>Displayed in homepage in the order of date posted</li>
                <li>Marked with eye catching star symbol to stand out from regular organic listing</li>
              </ul>
            </div>

            {/* Contact person for this position */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center pt-2">
              <label className="sm:col-span-5 text-slate-800 text-[13.5px] font-normal">
                Contact person for this position
              </label>
              <div className="sm:col-span-7">
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-slate-800 text-[13.5px] focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <label className="sm:col-span-5 text-slate-800 text-[13.5px] font-normal">
                Designation
              </label>
              <div className="sm:col-span-7">
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-slate-800 text-[13.5px] focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <label className="sm:col-span-3 text-slate-800 text-[13.5px] font-normal">
                Phone
              </label>
              <div className="sm:col-span-6 flex items-center">
                <div className="flex items-center w-full h-10 border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <div className="flex items-center px-2.5 bg-slate-50 border-r border-slate-300 text-slate-700 text-[13px] shrink-0">
                    <span>IN +91</span>
                    <svg className="w-3.5 h-3.5 ml-1 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full h-full px-3 text-slate-800 placeholder-slate-400 text-[13.5px] focus:outline-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-3 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer text-[13.5px] text-slate-700">
                  <input
                    type="checkbox"
                    name="hidePhone"
                    checked={formData.hidePhone}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span>Hide</span>
                </label>
              </div>
            </div>

            {/* Whatsapp */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <label className="sm:col-span-3 text-slate-800 text-[13.5px] font-normal">
                Whatsapp
              </label>
              <div className="sm:col-span-6 flex items-center">
                <div className="flex items-center w-full h-10 border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <div className="flex items-center px-2.5 bg-slate-50 border-r border-slate-300 text-slate-700 text-[13px] shrink-0">
                    <span>IN +91</span>
                    <svg className="w-3.5 h-3.5 ml-1 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="contactWhatsapp"
                    value={formData.contactWhatsapp}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full h-full px-3 text-slate-800 placeholder-slate-400 text-[13.5px] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit / Post Button */}
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-[13.5px] font-normal text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-black text-white text-[13.5px] font-normal hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
