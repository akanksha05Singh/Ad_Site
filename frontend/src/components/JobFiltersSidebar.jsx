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

  const clearFilters = () => {
    const empty = { state: '', occupationCategory: '', fullTime: false, partTime: false, workFromHome: false };
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
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>Filters</h2>
        <ClearButton onClick={clearFilters}>Clear all</ClearButton>
      </div>

      <FilterSection>
        <FilterTitle>Place</FilterTitle>
        <Select value={localFilters.state || ''} onChange={handleSelectChange('state')}>
          <option value="">All States</option>
          <option value="Oslo">Oslo</option>
          <option value="Agder">Agder</option>
          <option value="Akershus">Akershus</option>
          <option value="Buskerud">Buskerud</option>
          <option value="Finnmark">Finnmark</option>
          <option value="Innlandet">Innlandet</option>
          <option value="Møre og Romsdal">Møre og Romsdal</option>
          <option value="Nordland">Nordland</option>
          <option value="Rogaland">Rogaland</option>
          <option value="Telemark">Telemark</option>
          <option value="Troms">Troms</option>
          <option value="Trøndelag">Trøndelag</option>
          <option value="Vestfold">Vestfold</option>
          <option value="Vestland">Vestland</option>
          <option value="Østfold">Østfold</option>
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
