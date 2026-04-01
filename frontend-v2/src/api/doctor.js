import api from './instance';

export const doctorApi = {
  getContext: () => api.get('/api/doctor/context'),
  getProfile: () => api.get('/api/doctor/profile'),
  createProfile: (data) => api.post('/api/doctor/profile/create', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProfile: (data) => api.put('/api/doctor/profile/update', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleBooking: (enabled) => api.put('/api/doctor/profile/isBookingEnabled', { isBookingEnabled: enabled }),
  updateSettings: (data) => api.put('/api/doctor/settings', data),
  uploadProfilePhoto: (form) => api.put('/api/doctor/profile/uploadimage', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  sendMessage: (data) => api.post('/api/doctor/chat/send', data),
  getMessages: (id) => api.get(`/api/doctor/chat/${id}`),
};
