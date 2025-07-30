import { clsx } from 'clsx';

// Re-export Excel export utilities
export * from './excelExport';

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

/**
 * Calculate sales statistics from products data
 * @param {Array} products - Array of product objects with sales data
 * @returns {Object} Sales statistics
 */
export function calculateSalesStats(products) {
  if (!products || products.length === 0) {
    return {
      totalSales: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      topSellingProduct: null,
      salesGrowth: 0
    };
  }

  const totalSales = products.reduce((sum, product) => sum + (product.sold || 0), 0);
  const totalRevenue = products.reduce((sum, product) => sum + (product.revenue || 0), 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Find top selling product
  const topSellingProduct = products.reduce((top, product) => {
    return (product.sold || 0) > (top?.sold || 0) ? product : top;
  }, null);

  // Mock sales growth (in real app, this would compare with previous period)
  const salesGrowth = 12.5; // +12.5%

  return {
    totalSales,
    totalRevenue,
    averageOrderValue,
    topSellingProduct,
    salesGrowth
  };
}
