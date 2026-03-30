import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyEmail: (data) => api.post('/api/auth/verify-email', data),
  resendOtp: (email) => api.post('/api/auth/resend-otp', { email }),
  me: () => api.get('/api/auth/status'),
  updateLocation: (coords) => api.put('/api/auth/location', coords),
};

// ── USER ────────────────────────────────────────────────
export const userApi = {
  updateProfile: (data) => api.put('/api/user/profile', data),
  getProfile: () => api.get('/api/user/profile'),
};

// ── DISEASE PREDICTION ────────────────────────────────
export const diseaseApi = {
  predictHeart: (data) => api.post('/api/user/service/disease/heart-predict', data),
  predictDiabetes: (data) => api.post('/api/user/service/disease/diabetes', data),
  predictSkin: (data) => api.post('/api/user/service/disease/skin', data),
  getHistory: () => api.get('/api/user/service/disease/history'),
};

// ── APPOINTMENTS ──────────────────────────────────────
export const appointmentApi = {
  book: (data) => api.post('/api/user/service/appointment/create-appointment', data),
  getUserList: () => api.get('/api/user/service/appointment/my-appointment'),
  getHistoryList: () => api.get('/api/user/service/appointment/history'),
  getAppointment: (id) => api.get(`/api/user/service/appointment/appointment/${id}`),
  getAvailableSlots: (docId, date) => api.get(`/api/user/service/appointment/doctor/${docId}/available-slots?date=${date}`),
  getDoctors: () => api.get('/api/user/service/appointment/get-doctors'),
  getDoctorById: (id) => api.get(`/api/user/service/appointment/get-doctors/${id}`),
  cancelAppointment: (data) => api.put('/api/user/service/appointment/cancelappointment', data),

  getAnalytics: () => api.get('/api/doctor/service/appointment/getAnalytics'),
  getDoctorList: (status) => api.get('/api/doctor/service/appointment/myappointments', { params: status && status !== 'all' ? { status } : {} }),
  getAppointmentDetail: (id) => api.get(`/api/doctor/service/appointment/myappointments/${id}`),
  getDoctorHistory: (status) => api.get('/api/doctor/service/appointment/history', { params: status && status !== 'all' ? { status } : {} }),
  getDoctorHistoryDetail: (id) => api.get(`/api/doctor/service/appointment/history/${id}`),
  updateStatus: (id, status, remark) => api.put(`/api/doctor/service/appointment/stuatus/${id}`, { status, ...(remark ? { cancellationRemark: remark } : {}) }),
};

// ── BLOOD DONATION ────────────────────────────────────
export const bloodApi = {
  register: (data) => api.post('/api/user/blood-donation/register', data),
  getDonors: () => api.get('/api/user/blood-donation/donors'),
};

// ── HEALTHCARE CAMPS ──────────────────────────────────
export const campApi = {
  getAll: () => api.get('/api/user/service/camp'),
  getById: (id) => api.get(`/api/user/service/camp/${id}`),
  register: (id) => api.post(`/api/user/service/camp/${id}/register`),
};

// ── NEARBY ────────────────────────────────────────────
export const nearbyApi = {
  find: (params) => api.get('/api/user/nearby', { params }),
};

// ── CHATBOT ───────────────────────────────────────────
export const chatbotApi = {
  send: (message) => api.post('/api/user/service/chatbot/chat', { message }),
};

// ── USER SETTINGS ───────────────────────────────────────
export const userSettingsApi = {
  getContext: () => api.get('/api/user/context'),
  getSettings: () => api.get('/api/user/settings'),
  updateGeneral: (data) => api.put('/api/user/settings/general', data),
  updateAppearance: (data) => api.put('/api/user/settings/appearance', data),
  updateNotification: (data) => api.put('/api/user/settings/notification', data),
};

// ── DOCTOR ────────────────────────────────────────────
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


// ── HOSPITAL ──────────────────────────────────────────
export const hospitalApi = {
  // Status & Onboarding
  getStatus:     ()     => api.get('/api/hospital/status'),
  getContext:    ()     => api.get('/api/hospital/context'),
  getProfile:    ()     => api.get('/api/hospital/profile'),
  updateProfile: (data) => api.put('/api/hospital/profile', data),
  
  // New Onboarding Flow endpoints
  createProfile:   (data) => api.post('/api/hospital/profile/create', data),
  uploadDocuments: (form) => api.post('/api/hospital/profile/documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  submitApproval:  ()     => api.post('/api/hospital/createapproval', {}),

  // Blood Donation Requests
  createBloodRequest: (data) => api.post('/api/hospital/blood-donation', data),
  getBloodRequests:   ()     => api.get('/api/hospital/blood-donation'),
  deleteBloodRequest: (id)   => api.delete(`/api/hospital/blood-donation/${id}`),

  // Healthcare Camps
  createCamp:       (form) => api.post('/api/hospital/camp/create', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getCamps:         ()     => api.get('/api/hospital/camp/camps'),
  getCampById:      (id)   => api.get(`/api/hospital/camp/camps/${id}`),
  updateCamp:       (id, data) => api.put(`/api/hospital/camp/camps/${id}`, data),
  updateCampStatus: (id, status) => api.put(`/api/hospital/camp/camps/${id}/status`, { status }),
  deleteCamp:       (id)   => api.delete(`/api/hospital/camps/${id}`), // Optional fallback if delete is needed later.
};

// ── GOOGLE CALENDAR ────────────────────────────────
export const googleApi = {
  connect: () => api.get('/api/user/settings/google/connect'),
  disconnect: () => api.post('/api/user/settings/google/disconnect')
};