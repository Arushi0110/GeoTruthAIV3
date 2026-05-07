import axios from "axios";

// ✅ Create axios instance
const API = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});


// ✅ Optional: request interceptor (future-proof for token auth)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Enhanced response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error.message || 'An unexpected API error occurred';
    console.error("API Error [Global Interceptor]:", errorMessage);
    
    // Dispatch custom event to trigger global UI notifications
    window.dispatchEvent(new CustomEvent('api-error', { detail: { message: errorMessage } }));
    
    return Promise.reject(new Error(errorMessage));
  }
);

// ✅ Your existing function (unchanged feature)
export const predictNews = async (data) => {
  const res = await API.post("/predict", data);
  return res.data;
};

export const verifyNews = async (data) => {
  const res = await API.post("/verify", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export default API;
