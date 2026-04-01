import api from './instance';

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyEmail: (data) => api.post('/api/auth/verify-email', data),
  resendOtp: (email) => api.post('/api/auth/resend-otp', { email }),
  me: () => api.get('/api/auth/status'),
  updateLocation: (coords) => api.put('/api/auth/location', coords),
};
