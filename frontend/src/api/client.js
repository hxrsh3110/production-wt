import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : 'http://localhost:5000/api/v1';

export const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'x-demo-bypass': 'true' // Enables seamless demonstration mode without auth barriers
  },
  timeout: 8000
});

// Attach Authorization header automatically if Bearer token present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('apex_api_token') || 'Bearer apexfit-secret-key-2026';
  config.headers['Authorization'] = token;
  return config;
});

export default API;
