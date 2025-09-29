import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API functions
export const userAPI = {
  // Login user
  login: async (loginData) => {
    const response = await api.post('/users/login', loginData);
    return response.data;
  },
  
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  // Get user by username
  getUserByUsername: async (username) => {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  },
  
  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  // Add restaurant to favorites
  addToFavorites: async (userId, restaurantId) => {
    const response = await api.post(`/users/${userId}/favorites/${restaurantId}`);
    return response.data;
  },
  
  // Remove restaurant from favorites
  removeFromFavorites: async (userId, restaurantId) => {
    const response = await api.delete(`/users/${userId}/favorites/${restaurantId}`);
    return response.data;
  },
  
  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  // Favorites management
  getUserFavorites: async (userId) => {
    const response = await api.get(`/users/${userId}/favorites`);
    return response.data;
  },
  
  toggleFavorite: async (userId, restaurantId) => {
    console.log('API: Toggling favorite for user:', userId, 'restaurant:', restaurantId);
    try {
      const response = await api.post(`/users/${userId}/favorites/toggle`, {
        restaurantId: restaurantId
      });
      console.log('API: Toggle favorite response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Toggle favorite error:', error);
      console.error('API: Error response:', error.response?.data);
      throw error;
    }
  },
  
  addToFavorites: async (userId, restaurantId) => {
    const response = await api.post(`/users/${userId}/favorites/${restaurantId}`);
    return response.data;
  },
  
  removeFromFavorites: async (userId, restaurantId) => {
    const response = await api.delete(`/users/${userId}/favorites/${restaurantId}`);
    return response.data;
  }
};

// Review API functions
export const reviewAPI = {
  // Get all reviews
  getAllReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },
  
  // Get review by ID
  getReviewById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },
  
  // Get reviews by restaurant ID
  getReviewsByRestaurantId: async (restaurantId) => {
    const response = await api.get(`/reviews/restaurant/${restaurantId}`);
    return response.data;
  },
  
  // Get reviews by user ID
  getReviewsByUserId: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },
  
  // Get restaurant review stats
  getRestaurantReviewStats: async (restaurantId) => {
    const response = await api.get(`/reviews/restaurant/${restaurantId}/stats`);
    return response.data;
  },
  
  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  
  // Update a review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },
  
  // Delete a review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};

export default api;


