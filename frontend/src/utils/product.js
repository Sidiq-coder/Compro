/**
 * Product calculation utilities
 * Service functions for product statistics and calculations
 */

/**
 * Calculate product statistics
 * @param {Array} products - Array of product objects
 * @returns {Object} Product statistics
 */
export const calculateProductStats = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalStock: 0,
      outOfStockProducts: 0,
      lowStockProducts: 0,
      totalValue: 0,
      averagePrice: 0
    };
  }

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const inactiveProducts = products.filter(p => p.status === 'inactive').length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStockProducts = products.filter(p => (p.stock || 0) === 0).length;
  const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts : 0;

  return {
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalStock,
    outOfStockProducts,
    lowStockProducts,
    totalValue,
    averagePrice
  };
};

/**
 * Calculate category-wise product statistics
 * @param {Array} products - Array of product objects
 * @returns {Array} Category-wise statistics
 */
export const calculateProductCategoryStats = (products) => {
  if (!Array.isArray(products)) return [];

  const categoryMap = {};
  
  products.forEach(product => {
    const category = product.category || 'Lainnya';
    
    if (!categoryMap[category]) {
      categoryMap[category] = {
        name: category,
        count: 0,
        totalStock: 0,
        totalValue: 0,
        activeCount: 0,
        products: []
      };
    }
    
    categoryMap[category].count += 1;
    categoryMap[category].totalStock += product.stock || 0;
    categoryMap[category].totalValue += (product.price || 0) * (product.stock || 0);
    if (product.status === 'active') categoryMap[category].activeCount += 1;
    categoryMap[category].products.push(product);
  });

  return Object.values(categoryMap).sort((a, b) => b.count - a.count);
};

/**
 * Get products that need attention (low stock, out of stock, etc.)
 * @param {Array} products - Array of product objects
 * @returns {Object} Products that need attention
 */
export const getProductsNeedingAttention = (products) => {
  if (!Array.isArray(products)) {
    return {
      outOfStock: [],
      lowStock: [],
      inactive: [],
      highValue: []
    };
  }

  const outOfStock = products.filter(p => (p.stock || 0) === 0);
  const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
  const inactive = products.filter(p => p.status === 'inactive');
  const averageValue = products.length > 0 
    ? products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0) / products.length 
    : 0;
  const highValue = products.filter(p => ((p.price || 0) * (p.stock || 0)) > averageValue * 2);

  return {
    outOfStock,
    lowStock,
    inactive,
    highValue
  };
};
