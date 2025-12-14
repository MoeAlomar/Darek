import axios from 'axios';

/**
 * Base URL for the Django backend API
 */
const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Creates an Axios instance for making API requests.
 * This instance includes the base URL and an interceptor
 * to automatically add the JWT auth token to every request.
 */
const apiService = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Axios request interceptor.
 * This function runs before each request is sent.
 * It retrieves the 'access_token' from localStorage and adds it to the
 * 'Authorization' header as a Bearer token if it exists.
 */
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default apiService;