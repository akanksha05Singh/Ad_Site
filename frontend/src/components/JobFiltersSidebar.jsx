import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 300px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #cbd5e1;
  flex-shrink: 0;
  height: calc(100vh - 120px);
  position: sticky;
  top: 100px;
  overflow-y: auto;

  /* Custom subtle scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
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
    let value = e.target.value;
    
    // Auto-format numbers with commas for salary fields
    if (field === 'minSalary' || field === 'maxSalary') {
      const rawValue = value.replace(/,/g, '');
      if (rawValue === '' || !isNaN(rawValue)) {
        value = rawValue ? Number(rawValue).toLocaleString('en-IN') : '';
      } else {
        return; // Ignore non-numeric input
      }
    }

    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    const empty = { 
      q: '', location: '', minSalary: '', maxSalary: '', salaryType: 'Per Annum',
      state: '', occupationCategory: '', fullTime: false, partTime: false, workFromHome: false,
      gender: ''
    };
    setLocalFilters(empty);
    setFilters(empty);
  };

  const handleApply = () => {
    const filtersToApply = { ...localFilters };
    
    if (filtersToApply.minSalary) {
      const minVal = Number(filtersToApply.minSalary.replace(/,/g, ''));
      if (minVal > 0 && minVal < 1000) {
        filtersToApply.minSalary = '1,000';
        setLocalFilters(prev => ({ ...prev, minSalary: '1,000' }));
      }
    }
    
    setFilters(filtersToApply);
    if (onApply) onApply(filtersToApply);
  };

  return (
    <SidebarContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input 
            type="text" 
            placeholder="Min (₹)" 
            value={localFilters.minSalary || ''} 
            onChange={handleInputChange('minSalary')} 
          />
          <Input 
            type="text" 
            placeholder="Max (₹)" 
            value={localFilters.maxSalary || ''} 
            onChange={handleInputChange('maxSalary')} 
          />
        </div>
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
            Work from Home
          </CheckboxLabel>
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Gender</FilterTitle>
        <CheckboxGroup>
          <CheckboxLabel>
            <input 
              type="radio"
              name="gender"
              value="Male"
              checked={localFilters.gender === 'Male'}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, gender: e.target.value }))}
              style={{ marginRight: '8px' }}
            />
            Male (1)
          </CheckboxLabel>
          <CheckboxLabel>
            <input 
              type="radio"
              name="gender"
              value="Female"
              checked={localFilters.gender === 'Female'}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, gender: e.target.value }))}
              style={{ marginRight: '8px' }}
            />
            Female (2)
          </CheckboxLabel>
          <CheckboxLabel>
            <input 
              type="radio"
              name="gender"
              value=""
              checked={!localFilters.gender || localFilters.gender === ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, gender: e.target.value }))}
              style={{ marginRight: '8px' }}
            />
            Any
          </CheckboxLabel>
        </CheckboxGroup>
      </FilterSection>

      <Button onClick={handleApply}>Apply Filters</Button>
    </SidebarContainer>
  );
}
