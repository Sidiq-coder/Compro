/**
 * Currency formatting utilities
 * Utility functions for formatting currency values in Indonesian Rupiah
 */

/**
 * Format number to Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const defaultOptions = {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.NumberFormat('id-ID', formatOptions).format(Math.abs(amount));
};

/**
 * Format number to Indonesian Rupiah without currency symbol
 * @param {number} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount) => {
  return new Intl.NumberFormat('id-ID').format(Math.abs(amount));
};

/**
 * Format currency with sign (+ for positive, - for negative)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency with sign
 */
export const formatCurrencyWithSign = (amount) => {
  const formatted = formatCurrency(amount);
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
};

/**
 * Format compact currency (K, M, B for thousands, millions, billions)
 * @param {number} amount - The amount to format
 * @returns {string} Compact formatted currency
 */
export const formatCompactCurrency = (amount) => {
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000000) {
    return `Rp ${(absAmount / 1000000000).toFixed(1)}B`;
  } else if (absAmount >= 1000000) {
    return `Rp ${(absAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `Rp ${(absAmount / 1000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount);
  }
};

/**
 * Parse currency string back to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') return 0;
  
  // Remove currency symbol, dots, and spaces
  const cleanString = currencyString
    .replace(/Rp\s?/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim();
    
  return parseFloat(cleanString) || 0;
};
