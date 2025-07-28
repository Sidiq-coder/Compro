import React from 'react';
import { Input } from './Input';

const SearchFilter = ({ 
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filterValue = '',
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = 'Semua Tipe',
  showSearchIcon = true,
  additionalFilters = [],
  className = '',
  searchClassName = 'w-64',
  filterClassName = ''
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          className={`${searchClassName} ${showSearchIcon ? 'pl-10' : ''}`}
        />
        {showSearchIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        )}
      </div>

      {/* Main Filter Dropdown */}
      {filterOptions.length > 0 && (
        <select 
          value={filterValue}
          onChange={onFilterChange}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${filterClassName}`}
        >
          <option value="">{filterPlaceholder}</option>
          {filterOptions.map((option, index) => (
            <option key={index} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      )}

      {/* Additional Filter Dropdowns */}
      {additionalFilters.map((filter, index) => (
        <select 
          key={index}
          value={filter.value}
          onChange={filter.onChange}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${filter.className || ''}`}
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((option, optIndex) => (
            <option key={optIndex} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default SearchFilter;
