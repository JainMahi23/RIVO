import axios from 'axios';

export const BASE_API_URL = import.meta.env.VITE_API_URL || '/api';
export const BASE_ML_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000/api/v1/ml';
export const ENABLE_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

// Main REST API Client (Auth, Assessment CRUD, Schemes, Reports)
const apiClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Dedicated ML / AI Inference Client (Demand Forecast, Feasibility Scoring, Scheme Ranking, LLM Chat)
export const mlClient = axios.create({
  baseURL: BASE_ML_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach Authorization Token if available in localStorage
const attachAuthToken = (config) => {
  const token = localStorage.getItem('rivo_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiClient.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
mlClient.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));

// Unified response handling & error normalization
const handleSuccess = (response) => response.data;
const handleError = (error) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.detail ||
    (status === undefined
      ? 'Network error — backend service unavailable.'
      : `API Error (${status}): ${error.message}`);

  if (status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rivo:unauthorized'));
  }

  return Promise.reject({ status, message, raw: error, isOffline: !error.response });
};

apiClient.interceptors.response.use(handleSuccess, handleError);
mlClient.interceptors.response.use(handleSuccess, handleError);

/**
 * Health check helpers to probe backend and ML microservice connectivity.
 */
export async function checkBackendHealth() {
  try {
    const res = await axios.get(`${BASE_API_URL}/health`, { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function checkMLHealth() {
  try {
    const res = await axios.get(`${BASE_ML_URL}/health`, { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

export default apiClient;
