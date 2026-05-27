import axios from 'axios';

export const API_URL_FALLBACK = 'http://localhost:8000';

export const API_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
  window.API_URL ||
  API_URL_FALLBACK;

export const apiClient = axios.create({
  baseURL: API_URL,
});

// Attach access token from localStorage if available
apiClient.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    const token = stored?.access;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});
