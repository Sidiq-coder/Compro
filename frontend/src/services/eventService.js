import { api } from './api';

/**
 * Event API Service
 */
export const eventService = {
  /**
   * Get all events
   */
  async getAll(params = {}) {
    return api.get('/events', params);
  },

  /**
   * Get event by ID
   */
  async getById(id) {
    return api.get(`/events/${id}`);
  },

  /**
   * Create new event
   */
  async create(eventData) {
    return api.post('/events', eventData);
  },

  /**
   * Update event
   */
  async update(id, eventData) {
    return api.put(`/events/${id}`, eventData);
  },

  /**
   * Delete event
   */
  async delete(id) {
    return api.delete(`/events/${id}`);
  },

  /**
   * Upload event image
   */
  async uploadImage(eventId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.upload(`/events/${eventId}/image`, formData);
  },

  /**
   * Get event participants
   */
  async getParticipants(eventId) {
    return api.get(`/events/${eventId}/participants`);
  },

  /**
   * Register for event
   */
  async register(eventId, registrationData) {
    return api.post(`/events/${eventId}/register`, registrationData);
  },

  /**
   * Get event categories
   */
  async getCategories() {
    return api.get('/events/categories');
  },

  /**
   * Get event types
   */
  async getEventTypes() {
    return api.get('/events/types');
  }
};
