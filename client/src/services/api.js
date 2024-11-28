import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Keyword API
export const keywords = {
  analyze: (seedKeyword) => api.post('/keywords/analyze', { seed_keyword: seedKeyword }),
  save: (keywords, projectId) => api.post('/keywords/save', { keywords, projectId }),
};

// Content API
export const content = {
  generate: (data) => api.post('/content/generate', data),
  optimize: (data) => api.post('/content/optimize', data),
};

// Credits API
export const credits = {
  getBalance: () => api.get('/credits/balance'),
  purchase: (amount) => api.post('/credits/purchase', { amount }),
  getHistory: () => api.get('/credits/history'),
};

// Dashboard API
export const dashboard = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentSearches: () => api.get('/dashboard/recent-searches'),
};

// Admin API
export const admin = {
  giftCredits: (data) => api.post('/admin/gift-credits', data),
  getGiftingStats: () => api.get('/admin/gifting-stats'),
};

export default {
  auth,
  keywords,
  content,
  credits,
  dashboard,
  admin,
};
