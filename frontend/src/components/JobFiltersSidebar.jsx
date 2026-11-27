import React from 'react';
import { TIER_1_CITIES, TIER_2_CITIES, INDIAN_STATES } from '../constants/locations';
import { SALARY_MIN_OPTIONS, SALARY_MAX_OPTIONS } from '../constants/salaries';

export default function JobFiltersSidebar({ filters, setFilters, onApply }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClearAll = () => {
    setFilters({
      q: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      salaryType: 'Per Annum',
      state: '',
      occupationCategory: '',
      fullTime: false,
      partTime: false,
      workFromHome: false,
      gender: 'Any'
    });
  };

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white border border-slate-300 rounded-[14px] p-5 select-none font-sans text-black">
      
      {/* Clear all link */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleClearAll}
          className="text-[13px] font-bold text-black hover:opacity-70 focus:outline-none cursor-pointer p-0 bg-transparent border-none"
        >
          Clear all
        </button>
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <label htmlFor="q" className="block text-[13px] font-normal text-black mb-1.5">
          Keywords
        </label>
        <input
          type="text"
          id="q"
          name="q"
          value={filters.q || ''}
          onChange={handleChange}
          className="w-full h-8 px-2.5 rounded-[6px] border border-slate-300 bg-white text-[13px] text-black focus:border-slate-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Occupation */}
      <div className="mb-4">
        <label htmlFor="occupationCategory" className="block text-[13px] font-normal text-black mb-1.5">
          Occupation
        </label>
        <div className="relative">
          <select
            id="occupationCategory"
            name="occupationCategory"
            value={filters.occupationCategory || ''}
            onChange={handleChange}
            className="w-full h-8 px-2.5 pr-7 rounded-[6px] border border-slate-300 bg-white text-[13px] text-black appearance-none focus:border-slate-500 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">Select</option>
            <option value="Design">Design</option>
            <option value="Technology">Technology</option>
            <option value="Trades">Trades</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Sales">Sales</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Salary per month */}
      <div className="mb-4">
        <span className="block text-[13px] font-normal text-black mb-1.5">
          Salary per month
        </span>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-normal text-black w-8">Min</span>
          <div className="relative flex-1 flex items-center h-8 rounded-[6px] border border-slate-300 bg-white focus-within:border-slate-500 transition-colors">
            <span className="pl-2 text-[13px] text-slate-600 select-none">₹</span>
            <select
              id="minSalary"
              name="minSalary"
              value={filters.minSalary || ''}
              onChange={handleChange}
              className="w-full h-full px-1.5 pr-6 bg-transparent text-[13px] text-black text-right tabular-nums appearance-none focus:outline-none cursor-pointer"
            >
              <option value="" className="text-right">Select</option>
              {SALARY_MIN_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="text-right">{opt}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-normal text-black w-8">Max</span>
          <div className="relative flex-1 flex items-center h-8 rounded-[6px] border border-slate-300 bg-white focus-within:border-slate-500 transition-colors">
            <span className="pl-2 text-[13px] text-slate-600 select-none">₹</span>
            <select
              id="maxSalary"
              name="maxSalary"
              value={filters.maxSalary || ''}
              onChange={handleChange}
              className="w-full h-full px-1.5 pr-6 bg-transparent text-[13px] text-black text-right tabular-nums appearance-none focus:outline-none cursor-pointer"
            >
              <option value="" className="text-right">Select</option>
              {SALARY_MAX_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="text-right">{opt}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Employment type */}
      <div className="mb-4 pt-1">
        <span className="block text-[13px] font-normal text-black mb-2">
          Employment type
        </span>
        <div className="space-y-1.5 text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="fullTime"
              checked={!!filters.fullTime}
              onChange={handleChange}
              className="w-3.5 h-3.5 rounded border-slate-300 accent-black cursor-pointer"
            />
            <span className="text-black font-normal">Full time</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="partTime"
              checked={!!filters.partTime}
              onChange={handleChange}
              className="w-3.5 h-3.5 rounded border-slate-300 accent-black cursor-pointer"
            />
            <span className="text-black font-normal">Part time</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="workFromHome"
              checked={!!filters.workFromHome}
              onChange={handleChange}
              className="w-3.5 h-3.5 rounded border-slate-300 accent-black cursor-pointer"
            />
            <span className="text-black font-normal">Work from home</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="employmentAny"
              checked={!filters.fullTime && !filters.partTime && !filters.workFromHome}
              onChange={() => setFilters(p => ({ ...p, fullTime: false, partTime: false, workFromHome: false }))}
              className="w-3.5 h-3.5 rounded border-slate-300 accent-black cursor-pointer"
            />
            <span className="text-black font-normal">Any</span>
          </label>
        </div>
      </div>

      {/* Gender */}
      <div className="mb-4 pt-1">
        <span className="block text-[13px] font-normal text-black mb-2">
          Gender
        </span>
        <div className="space-y-1.5 text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={filters.gender === 'Male'}
              onChange={handleChange}
              className="w-3.5 h-3.5 border-slate-300 accent-black cursor-pointer"
            />
            <span className="text-black font-normal">Male</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={filters.gender === 'Female'}
              onChange={handleChange}
              className="w-3.5 h-3.5 border-slate-300 accent-black cursor-pointer"
            />
            <span className="text-black font-normal">Female</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="Any"
              checked={!filters.gender || filters.gender === 'Any'}
              onChange={handleChange}
              className="w-3.5 h-3.5 border-slate-300 accent-black cursor-pointer"
            />
            <span className="text-black font-normal">Any</span>
          </label>
        </div>
      </div>

      {/* Location */}
      <div className="mb-2 pt-1">
        <label htmlFor="location" className="block text-[13px] font-normal text-black mb-1.5">
          Location
        </label>
        <div className="relative">
          <select
            id="location"
            name="location"
            value={filters.location || ''}
            onChange={handleChange}
            className="w-full h-8 px-2.5 pr-7 rounded-[6px] border border-slate-300 bg-white text-[13px] text-black appearance-none focus:border-slate-500 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">Select</option>
            <optgroup label="Tier 1 Cities">
              {TIER_1_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </optgroup>
            <optgroup label="Tier 2 Cities">
              {TIER_2_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </optgroup>
            <optgroup label="States">
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </optgroup>
            <optgroup label="Other">
              <option value="Remote">Work from home / Remote</option>
            </optgroup>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

    </aside>
  );
}
