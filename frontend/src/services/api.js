import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred';
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error('An unexpected error occurred.'));
    }
  }
);

// Auth API
export const authAPI = {
  generateNonce: (walletAddress) => 
    api.post('/auth/nonce', { walletAddress }),
  
  verifySignature: (walletAddress, signature) => 
    api.post('/auth/verify', { walletAddress, signature }),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (profileData) => 
    api.put('/auth/profile', profileData),
  
  logout: () => 
    api.post('/auth/logout')
};

// Projects API
export const projectsAPI = {
  getProjects: (params = {}) => 
    api.get('/projects', { params }),
  
  getProject: (projectId) => 
    api.get(`/projects/${projectId}`),
  
  createProject: (projectData) => 
    api.post('/projects', projectData),
  
  updateProject: (projectId, updateData) => 
    api.put(`/projects/${projectId}`, updateData),
  
  getUserProjects: () => 
    api.get('/projects/user/my-projects'),
  
  getProjectStats: () => 
    api.get('/projects/stats/project-stats'),
  
  verifyProject: (projectId) => 
    api.patch(`/projects/${projectId}/verify`),
  
  deleteProject: (projectId) => 
    api.delete(`/projects/${projectId}`)
};

// Market API
export const marketAPI = {
  getMarketOverview: () => 
    api.get('/market/overview'),
  
  getActiveListings: () => 
    api.get('/market/listings'),
  
  listCredits: (amount, pricePerCredit) => 
    api.post('/market/list', { amount, pricePerCredit }),
  
  purchaseCredits: (listingId, totalPrice) => 
    api.post(`/market/purchase/${listingId}`, { totalPrice }),
  
  getUserPortfolio: () => 
    api.get('/market/portfolio'),
  
  getUserTransactions: (params = {}) => 
    api.get('/market/transactions', { params }),
  
  getUserListings: () => 
    api.get('/market/user/listings'),
  
  cancelListing: (listingId) => 
    api.delete(`/market/listings/${listingId}`),
  
  getTradingVolume: (timeframe = '7d') => 
    api.get('/market/volume', { params: { timeframe } })
};

// Analytics API
export const analyticsAPI = {
  getPerformanceMetrics: (days = 30) => 
    api.get('/analytics/performance', { params: { days } }),
  
  getEnvironmentalImpact: () => 
    api.get('/analytics/environmental-impact'),
  
  getUserAnalytics: () => 
    api.get('/analytics/user'),
  
  getTradingAnalytics: (timeframe = '7d') => 
    api.get('/analytics/trading', { params: { timeframe } }),
  
  generateMetrics: () => 
    api.post('/analytics/generate-metrics')
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;