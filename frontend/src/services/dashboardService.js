import { api } from './api';

const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get(`/dashboard/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw error;
    }
  }
};

export default dashboardService;
