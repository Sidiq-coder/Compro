import { api } from './api.js';

/**
 * Product service for API calls
 */
export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', params);
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      // Add product fields to FormData
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.upload('/products', formData);
      return response;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const formData = new FormData();
      
      // Add product fields to FormData
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.upload(`/products/${id}`, formData);
      return response;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  // Get product categories
  getProductCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response;
    } catch (error) {
      console.error('Get product categories error:', error);
      throw error;
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await api.get('/products/stats');
      return response;
    } catch (error) {
      console.error('Get product stats error:', error);
      throw error;
    }
  }
};

/**
 * Order service for API calls
 */
export const orderService = {
  // Get all orders (admin)
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', params);
      return response;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  // Create new order (public)
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Update order status (admin)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Delete order (admin)
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response;
    } catch (error) {
      console.error('Get order stats error:', error);
      throw error;
    }
  }
};

/**
 * Finance service for API calls
 */
export const financeService = {
  // Get financial summary
  getFinancialSummary: async (params = {}) => {
    try {
      const response = await api.get('/finance/summary', params);
      return response;
    } catch (error) {
      console.error('Get financial summary error:', error);
      throw error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/finance/analytics/revenue', params);
      return response;
    } catch (error) {
      console.error('Get revenue analytics error:', error);
      throw error;
    }
  },

  // Get top performing products
  getTopProducts: async (params = {}) => {
    try {
      const response = await api.get('/finance/products/top', params);
      return response;
    } catch (error) {
      console.error('Get top products error:', error);
      throw error;
    }
  },

  // Get expense summary
  getExpenseSummary: async () => {
    try {
      const response = await api.get('/finance/expenses/summary');
      return response;
    } catch (error) {
      console.error('Get expense summary error:', error);
      throw error;
    }
  },

  // Get financial transactions
  getFinancialTransactions: async (params = {}) => {
    try {
      const response = await api.get('/finance/transactions', params);
      return response;
    } catch (error) {
      console.error('Get financial transactions error:', error);
      throw error;
    }
  }
};
