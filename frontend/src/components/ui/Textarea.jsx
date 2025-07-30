import React from 'react';

/**
 * Textarea - Reusable textarea component dengan styling yang konsisten
 */
const Textarea = ({
  label,
  value = '',
  onChange,
  placeholder = '',
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
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

      {/* Textarea Input */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm text-sm resize-vertical
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 text-gray-900 placeholder-gray-400'
          }
        `}
        {...props}
      />

      {/* Character count */}
      {maxLength && (
        <div className="flex justify-between items-center">
          {/* Error/Helper Text */}
          <div className="flex-1">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
          
          {/* Character Count */}
          <p className={`text-xs ${
            value.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {value.length}/{maxLength}
          </p>
        </div>
      )}

      {/* Error/Helper Text (without character count) */}
      {!maxLength && (
        <>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </>
      )}
    </div>
  );
};

export default Textarea;
