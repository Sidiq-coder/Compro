import { api } from './api';
import dashboardService from './dashboardService';

export { dashboardService };

/**
 * Authentication service
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    
    // Backend returns data wrapped in { success, data, message }
    const { data } = response;
    
    if (data.accessToken) {
      localStorage.setItem('auth_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
      if (data.user) {
        localStorage.setItem('user_data', JSON.stringify(data.user));
      }
    }
    
    return data;
  },

  /**
   * Register user
   */
  async register(userData) {
    return api.post('/auth/register', userData);
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  },

  /**
   * Refresh token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    return api.get('/auth/me');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get user data from localStorage
   */
  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
};

/**
 * Articles service
 */
export const articlesService = {
  /**
   * Get all articles
   */
  async getArticles(params = {}) {
    return api.get('/articles', params);
  },

  /**
   * Get article by ID
   */
  async getArticle(id) {
    return api.get(`/articles/${id}`);
  },

  /**
   * Create article
   */
  async createArticle(articleData) {
    return api.post('/articles', articleData);
  },

  /**
   * Update article
   */
  async updateArticle(id, articleData) {
    return api.put(`/articles/${id}`, articleData);
  },

  /**
   * Delete article
   */
  async deleteArticle(id) {
    return api.delete(`/articles/${id}`);
  },
};

/**
 * Events service
 */
export const eventsService = {
  /**
   * Get all events
   */
  async getEvents(params = {}) {
    return api.get('/events', params);
  },

  /**
   * Get event by ID
   */
  async getEvent(id) {
    return api.get(`/events/${id}`);
  },

  /**
   * Create event
   */
  async createEvent(eventData) {
    return api.post('/events', eventData);
  },

  /**
   * Update event
   */
  async updateEvent(id, eventData) {
    return api.put(`/events/${id}`, eventData);
  },

  /**
   * Delete event
   */
  async deleteEvent(id) {
    return api.delete(`/events/${id}`);
  },
};

/**
 * Contact service
 */
export const contactService = {
  /**
   * Send contact message
   */
  async sendMessage(messageData) {
    return api.post('/contact', messageData);
  },
};

/**
 * Exporting eventService
 */
export { eventService } from './eventService';

/**
 * Exporting product, order, and finance services
 */
export { productService, orderService, financeService } from './productService';
