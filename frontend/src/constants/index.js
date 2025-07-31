// Application constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Application Constants
export const APP_NAME = 'Compro Profile';
export const APP_VERSION = '1.0.0';

// Route Constants
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services', // Keep old route for backward compatibility
  PRODUCTS: '/products', // New public products page
  PUBLIC_ARTICLES: '/public-articles', // Public articles (different from dashboard)
  PUBLIC_EVENTS: '/public-events', // Public events (different from dashboard) 
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  ADD_USER: '/pengguna/tambah',
  ADD_EVENT: '/events/tambah',
  DEPARTMENT: '/dashboard/department',
  DIVISI: '/dashboard/divisi',
  KEUANGAN: '/dashboard/keuangan',
  PRODUK: '/dashboard/produk',
  PRODUCT_DETAIL: '/dashboard/products/:id',
  ABSENSI: '/dashboard/absensi',
  PENGATURAN: '/dashboard/pengaturan',
  ARTICLES: '/dashboard/articles', // Dashboard articles (for logged in users)
  EVENTS: '/dashboard/events', // Dashboard events (for logged in users)
  PROFILE: '/profile',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'theme_preference',
};

// Theme Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50],
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
};

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  PASSWORD_MIN_LENGTH: 8,
};

// Status Constants
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};
