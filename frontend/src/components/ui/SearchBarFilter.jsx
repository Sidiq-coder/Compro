import React from 'react';
import { Input } from './Input';

const SearchBarFilter = ({ 
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filterValue = '',
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = 'Semua',
  additionalFilters = [],
  showSearch = true,
  showFilter = true,
  layout = 'horizontal', // 'horizontal' | 'vertical'
  className = '',
  searchClassName = '',
  filterClassName = '',
  searchIcon = true
}) => {
  const layoutClass = layout === 'vertical' ? 'flex-col space-y-4' : 'flex-row space-x-4';
  
  return (
    <div className={`flex ${layoutClass} ${className}`}>
      {/* Search Input */}
      {showSearch && (
        <div className={`relative ${searchClassName || (layout === 'vertical' ? 'w-full' : 'flex-1')}`}>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            className={searchIcon ? 'pl-10 pr-4' : ''}
          />
          {searchIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Main Filter Dropdown */}
      {showFilter && filterOptions.length > 0 && (
        <select 
          value={filterValue}
          onChange={onFilterChange}
          className={`px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 ${filterClassName || 'min-w-32'}`}
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
          className={`px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 ${filter.className || 'min-w-32'}`}
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

export { SearchBarFilter };
