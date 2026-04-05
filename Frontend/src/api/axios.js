import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log('🔑 Token from localStorage:', token ? 'EXISTS' : 'MISSING');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header set');
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  return config;
});

// Log response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token may be invalid or expired');
      console.log('Current token:', localStorage.getItem('token'));
    }
    return Promise.reject(error);
  }
);

export default API;
