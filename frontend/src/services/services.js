import { api } from './api';

/**
 * Users service
 */
export const userService = {
  async getUsers(params = {}) {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  async getUserStats() {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user stats');
    }
  }
};

/**
 * Articles service
 */
export const articlesService = {
  async getArticles(params = {}) {
    try {
      const response = await api.get('/articles', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get articles');
    }
  },

  async getArticleById(id) {
    try {
      const response = await api.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get article');
    }
  },

  async createArticle(articleData) {
    try {
      const response = await api.post('/articles', articleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create article');
    }
  },

  async updateArticle(id, articleData) {
    try {
      const response = await api.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update article');
    }
  },

  async deleteArticle(id) {
    try {
      const response = await api.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete article');
    }
  },

  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/articles/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },

  async getArticleStats() {
    try {
      const response = await api.get('/articles/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get article stats');
    }
  }
};

/**
 * Events service
 */
export const eventsService = {
  async getEvents(params = {}) {
    try {
      const response = await api.get('/events', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get events');
    }
  },

  async getEventById(id) {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get event');
    }
  },

  async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },

  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },

  async deleteEvent(id) {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },

  async getEventStats() {
    try {
      const response = await api.get('/events/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get event stats');
    }
  }
};

/**
 * Products service
 */
export const productService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products');
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get product');
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  async getProductCategories() {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get categories');
    }
  },

  async getProductStats() {
    try {
      const response = await api.get('/products/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get product stats');
    }
  }
};

/**
 * Departments service
 */
export const departmentService = {
  async getDepartments(params = {}) {
    try {
      const response = await api.get('/departments', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get departments');
    }
  },

  async getDepartmentStats() {
    try {
      const response = await api.get('/departments/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get department stats');
    }
  },

  async getDepartmentById(id) {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get department');
    }
  },

  async createDepartment(departmentData) {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create department');
    }
  },

  async updateDepartment(id, departmentData) {
    try {
      const response = await api.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update department');
    }
  },

  async deleteDepartment(id) {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete department');
    }
  }
};

/**
 * Divisions service
 */
export const divisionService = {
  async getDivisions(params = {}) {
    try {
      const response = await api.get('/divisions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get divisions');
    }
  },

  async getDivisionById(id) {
    try {
      const response = await api.get(`/divisions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get division');
    }
  },

  async createDivision(divisionData) {
    try {
      const response = await api.post('/divisions', divisionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create division');
    }
  },

  async updateDivision(id, divisionData) {
    try {
      const response = await api.put(`/divisions/${id}`, divisionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update division');
    }
  },

  async deleteDivision(id) {
    try {
      const response = await api.delete(`/divisions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete division');
    }
  }
};

/**
 * Finance service
 */
export const financeService = {
  async getFinancialSummary() {
    try {
      const response = await api.get('/finance/summary');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get financial summary');
    }
  },

  async getFinancialTransactions(params = {}) {
    try {
      const response = await api.get('/finance/transactions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get transactions');
    }
  },

  async createTransaction(transactionData) {
    try {
      const response = await api.post('/finance/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create transaction');
    }
  },

  async updateTransaction(id, transactionData) {
    try {
      const response = await api.put(`/finance/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update transaction');
    }
  },

  async deleteTransaction(id) {
    try {
      const response = await api.delete(`/finance/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete transaction');
    }
  }
};

/**
 * Attendance service
 */
export const attendanceService = {
  async getAttendance(params = {}) {
    try {
      const response = await api.get('/attendances', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get attendance');
    }
  },

  async createAttendance(attendanceData) {
    try {
      const response = await api.post('/attendances', attendanceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create attendance');
    }
  },

  async updateAttendance(id, attendanceData) {
    try {
      const response = await api.put(`/attendances/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update attendance');
    }
  },

  async getAttendanceReport(eventId, params = {}) {
    try {
      const response = await api.get(`/attendances/report/${eventId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get attendance report');
    }
  },

  async exportAttendanceReport(eventId, format = 'excel') {
    try {
      const response = await api.get(`/attendances/export/${eventId}`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to export attendance report');
    }
  }
};
