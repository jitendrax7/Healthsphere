import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => {
    // Some APIs return 200 OK but with success: false in the payload
    if (res.data && res.data.success === false && res.data.message) {
      window.dispatchEvent(new CustomEvent('api-toast', { 
        detail: { type: 'error', message: res.data.message } 
      }));
    }
    // Automatically trigger success toasts for endpoints that modify data
    else if (
      res.data && 
      res.data.message && 
      ['post', 'put', 'patch', 'delete'].includes(res.config.method?.toLowerCase())
    ) {
      window.dispatchEvent(new CustomEvent('api-toast', { 
        detail: { type: 'success', message: res.data.message } 
      }));
    }
    return res;
  },
  (err) => {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || err.message || 'An error occurred';

      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status >= 400 && status < 500) {
        // Dispatch toast for 400 series like 400, 403, 404
        window.dispatchEvent(new CustomEvent('api-toast', { 
          detail: { type: 'error', message } 
        }));
      } else if (status >= 500) {
        window.dispatchEvent(new CustomEvent('api-toast', { 
          detail: { type: 'error', message: 'Server currently unavailable. Please try again later.' } 
        }));
      }
    } else {
       // Network error or request timeout
       window.dispatchEvent(new CustomEvent('api-toast', { 
         detail: { type: 'error', message: 'Network error. Please check your connection.' } 
       }));
    }
    return Promise.reject(err);
  }
);

export default api;
