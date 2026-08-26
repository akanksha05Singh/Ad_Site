import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 300px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #475569;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #2563eb;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: white;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: white;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  cursor: pointer;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: #1d4ed8;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  cursor: pointer;
  
  &:hover {
    color: #ef4444;
  }
`;

export default function JobFiltersSidebar({ filters, setFilters, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleCheckboxChange = (field) => (e) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const handleSelectChange = (field) => (e) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleInputChange = (field) => (e) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const clearFilters = () => {
    const empty = { 
      q: '', location: '', minSalary: '', maxSalary: '', salaryType: 'Per Annum',
      state: '', occupationCategory: '', fullTime: false, partTime: false, workFromHome: false 
    };
    setLocalFilters(empty);
    setFilters(empty);
  };

  const handleApply = () => {
    setFilters(localFilters);
    if (onApply) onApply(localFilters);
  };

  return (
    <SidebarContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: '#0f172a' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="6" r="3"></circle>
            <line x1="4" y1="6" x2="11" y2="6"></line>
            <line x1="17" y1="6" x2="20" y2="6"></line>
            
            <circle cx="8" cy="12" r="3"></circle>
            <line x1="4" y1="12" x2="5" y2="12"></line>
            <line x1="11" y1="12" x2="20" y2="12"></line>
            
            <circle cx="16" cy="18" r="3"></circle>
            <line x1="4" y1="18" x2="13" y2="18"></line>
            <line x1="19" y1="18" x2="20" y2="18"></line>
          </svg>
        </div>
        <ClearButton onClick={clearFilters}>Clear all</ClearButton>
      </div>

      <FilterSection>
        <FilterTitle>Keywords</FilterTitle>
        <Input 
          type="text" 
          placeholder="e.g. Software Engineer" 
          value={localFilters.q || ''} 
          onChange={handleInputChange('q')} 
        />
      </FilterSection>



      <FilterSection>
        <FilterTitle>Salary Range</FilterTitle>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <Input 
            type="number" 
            placeholder="Min (₹)" 
            value={localFilters.minSalary || ''} 
            onChange={handleInputChange('minSalary')} 
          />
          <Input 
            type="number" 
            placeholder="Max (₹)" 
            value={localFilters.maxSalary || ''} 
            onChange={handleInputChange('maxSalary')} 
          />
        </div>
        <Select value={localFilters.salaryType || 'Per Annum'} onChange={handleSelectChange('salaryType')}>
          <option value="Per Annum">Per Annum</option>
          <option value="Per Month">Per Month</option>
        </Select>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Location</FilterTitle>
        <Select value={localFilters.state || ''} onChange={handleSelectChange('state')}>
          <option value="">All States</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
          <option value="Assam">Assam</option>
          <option value="Bihar">Bihar</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Goa">Goa</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Haryana">Haryana</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Manipur">Manipur</option>
          <option value="Meghalaya">Meghalaya</option>
          <option value="Mizoram">Mizoram</option>
          <option value="Nagaland">Nagaland</option>
          <option value="Odisha">Odisha</option>
          <option value="Punjab">Punjab</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Sikkim">Sikkim</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Telangana">Telangana</option>
          <option value="Tripura">Tripura</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Uttarakhand">Uttarakhand</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Delhi NCR">Delhi NCR</option>
        </Select>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Occupation</FilterTitle>
        <Select value={localFilters.occupationCategory || ''} onChange={handleSelectChange('occupationCategory')}>
          <option value="">All Occupations</option>
          <option value="Engineers">Engineers</option>
          <option value="Designers">Designers</option>
          <option value="Management">Management</option>
          <option value="Sales">Sales</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="IT & Software">IT & Software</option>
          <option value="Other">Other</option>
        </Select>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Employment Type</FilterTitle>
        <CheckboxGroup>
          <CheckboxLabel>
            <CheckboxInput 
              type="checkbox" 
              checked={localFilters.fullTime} 
              onChange={handleCheckboxChange('fullTime')} 
            />
            Full-time
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckboxInput 
              type="checkbox" 
              checked={localFilters.partTime} 
              onChange={handleCheckboxChange('partTime')} 
            />
            Part-time
          </CheckboxLabel>
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Work Environment</FilterTitle>
        <CheckboxGroup>
          <CheckboxLabel>
            <CheckboxInput 
              type="checkbox" 
              checked={localFilters.workFromHome} 
              onChange={handleCheckboxChange('workFromHome')} 
            />
            Work from home
          </CheckboxLabel>
        </CheckboxGroup>
      </FilterSection>

      <Button onClick={handleApply}>Apply Filters</Button>
    </SidebarContainer>
  );
}
