import React from 'react';

/**
 * Select - Reusable dropdown select component
 * Mendukung single dan multi-select dengan styling yang konsisten
 */
const Select = ({
  label,
  value = '',
  onChange,
  options = [],
  placeholder = 'Pilih...',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Input */}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 text-gray-900 placeholder-gray-400'
          }
        `}
        {...props}
      >
        {/* Placeholder option */}
        <option value="" disabled>
          {placeholder}
        </option>
        
        {/* Options */}
        {options.map((option) => {
          // Support for string array or object array
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
