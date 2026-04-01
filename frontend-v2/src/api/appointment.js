import api from './instance';

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
