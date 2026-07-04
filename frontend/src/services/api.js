import axios from 'axios';

// Centralized Axios instance for all API calls
// withCredentials ensures HTTP-only cookies (JWT) are sent with requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;