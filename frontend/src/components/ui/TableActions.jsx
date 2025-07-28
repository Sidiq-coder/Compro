import React from 'react';
import { Button } from './Button';
import { SearchBarFilter } from './SearchBarFilter';

/**
 * TableActions - Reusable component untuk search, filter, dan add button
 * Digunakan di semua halaman yang memiliki tabel untuk konsistensi UI/UX
 */
const TableActions = ({
  // Search props
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  
  // Filter props  
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "Semua",
  showFilter = true,
  
  // Add button props
  onAdd,
  addButtonText = "Tambah Data",
  addButtonIcon = "➕",
  showAddButton = true,
  
  // Custom styling
  className = "",
  searchClassName = "w-64",
  
  // Additional props
  disabled = false,
  children
}) => {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <SearchBarFilter
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          filterValue={filterValue}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
          filterPlaceholder={filterPlaceholder}
          searchClassName={searchClassName}
          showFilter={showFilter}
          disabled={disabled}
          className="flex items-center space-x-4"
        />
        {children}
      </div>
      
      {/* Add Button Section */}
      {showAddButton && (
        <Button 
          onClick={onAdd}
          disabled={disabled}
          className="flex items-center space-x-2"
        >
          <span>{addButtonIcon}</span>
          <span>{addButtonText}</span>
        </Button>
      )}
    </div>
  );
};

export { TableActions };
