import { clsx } from 'clsx';

// Re-export currency utilities
export * from './currency';

// Re-export financial utilities  
export * from './financial';

// Re-export product utilities
export * from './product';

// Re-export organization utilities
export * from './organization';

// Re-export table configuration utilities
export * from './tableConfig.jsx';

/**
 * Utility function to merge class names using clsx
 * @param {...(string|object|Array)} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Utility function to format date
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: 'id-ID')
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'id-ID') {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
}

/**
 * Utility function to format date with time
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: 'id-ID')
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(date, locale = 'id-ID') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Utility function to capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility function to generate random ID
 * @returns {string} Random ID
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
