import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import JobFiltersSidebar from './JobFiltersSidebar';
import { API_BASE_URL } from '../config';

// Fallback dummy listings matching reference image
const MOCK_LISTINGS = [
  {
    _id: 'mock-detail-1',
    title: 'Graphic Designer',
    companyName: 'TCS',
    location: 'Bangalore',
    isFeatured: true,
    description: 'Are you a visual storyteller who is passionate about transforming great ideas into captivating designs? Do you have a keen eye for detail, color, and typography, and thrive working at the intersection of strategy and creativity? Then you might be the one we\'re looking for.',
    contactEmail: 'xyz@gmail.com',
    contactPhone: '+91 0123456789',
    contactWhatsapp: '+91 0123456789',
    companyWebsite: 'www.tcmnbgd.com'
  },
  {
    _id: 'mock-list-1',
    title: 'Graphic Designer',
    companyName: 'TCS',
    location: 'Bangalore',
    isFeatured: true
  },
  {
    _id: 'mock-list-2',
    title: 'Plumber',
    companyName: 'ABC',
    location: 'Delhi',
    isFeatured: false
  },
  {
    _id: 'mock-list-3',
    title: 'Plumber',
    companyName: 'ABC',
    location: 'Delhi',
    isFeatured: false
  },
  {
    _id: 'mock-list-4',
    title: 'Plumber',
    companyName: 'ABC',
    location: 'Delhi',
    isFeatured: false
  },
  {
    _id: 'mock-list-5',
    title: 'Plumber',
    companyName: 'ABC',
    location: 'Delhi',
    isFeatured: false
  },
  {
    _id: 'mock-list-6',
    title: 'Plumber',
    companyName: 'ABC',
    location: 'Delhi',
    isFeatured: false
  },
  {
    _id: 'mock-list-7',
    title: 'Plumber',
    companyName: 'ABC',
    location: 'Delhi',
    isFeatured: false
  },
  {
    _id: 'mock-list-8',
    title: 'Plumber',
    companyName: 'ABC',
    location: 'Delhi',
    isFeatured: false
  }
];

export default function BrowseGrid({ 
  searchQuery, 
  selectedCategory = 'job', 
  location, 
  minPrice, 
  refreshTrigger,
  initialExpandedId
}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Job Filters matching sidebar
  const [jobFilters, setJobFilters] = useState({
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

  const [expandedCardId, setExpandedCardId] = useState(initialExpandedId || 'mock-detail-1');

  useEffect(() => {
    if (initialExpandedId) {
      setExpandedCardId(initialExpandedId);
    }
  }, [initialExpandedId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const fetchListings = async () => {
      try {
        let url = `${API_BASE_URL}/api/listings?category=job&limit=30`;
        const params = new URLSearchParams();

        const finalQuery = jobFilters.q || searchQuery || '';
        const finalLocation = jobFilters.location || location || '';
        const finalMinPrice = jobFilters.minSalary || minPrice || '';

        if (finalQuery.trim() !== '') params.append('q', finalQuery);
        if (finalLocation.trim() !== '') params.append('location', finalLocation);
        if (finalMinPrice.toString().trim() !== '') {
          params.append('minPrice', finalMinPrice.toString().replace(/,/g, ''));
        }
        if (jobFilters.maxSalary) {
          params.append('maxPrice', jobFilters.maxSalary.toString().replace(/,/g, ''));
        }
        if (jobFilters.occupationCategory) {
          params.append('occupationCategory', jobFilters.occupationCategory);
        }
        if (jobFilters.fullTime) params.append('employmentType', 'Full-time');
        if (jobFilters.partTime) params.append('employmentType', 'Part-time');
        if (jobFilters.workFromHome) params.append('workFromHome', 'true');
        if (jobFilters.gender && jobFilters.gender !== 'Any') {
          params.append('gender', jobFilters.gender);
        }

        const queryString = params.toString();
        if (queryString) {
          url += `&${queryString}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (active) {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setListings(data.data);
            setExpandedCardId(data.data[0]._id);
          } else {
            setListings(MOCK_LISTINGS);
            setExpandedCardId(MOCK_LISTINGS[0]._id);
          }
        }
      } catch (err) {
        if (active) {
          setListings(MOCK_LISTINGS);
          setExpandedCardId(MOCK_LISTINGS[0]._id);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchListings();
    }, 200);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [searchQuery, selectedCategory, location, minPrice, refreshTrigger, jobFilters]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 lg:gap-8 items-start select-none font-sans">
      
      {/* Left Sidebar Filters */}
      <JobFiltersSidebar 
        filters={jobFilters} 
        setFilters={setJobFilters} 
        onApply={() => {}} 
      />

      {/* Right Column: Feed of Listings Cards */}
      <div className="flex-1 w-full space-y-3.5">
        {loading ? (
          <div className="space-y-3.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-24 bg-slate-100 rounded-[14px] border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          listings.map((item, index) => {
            const isFirst = index === 0;
            const isCurrentlyExpanded = expandedCardId === item._id || (isFirst && !expandedCardId);

            return (
              <ListingCard 
                key={item._id || index}
                listing={item}
                forceExpanded={isCurrentlyExpanded}
                onSelect={(clicked) => {
                  setExpandedCardId(prev => prev === clicked._id ? null : clicked._id);
                }}
              />
            );
          })
        ) : (
          <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-2xl">
            No listings match your current filters.
          </div>
        )}
      </div>

    </div>
  );
}
