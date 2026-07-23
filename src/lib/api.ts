import axios from 'axios';

// Create configured Axios instance for the Express backend
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle unauthorized access automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get an Unauthorized error, we can handle redirects or clear sessions if needed
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);
