import api from './instance';

export const hospitalApi = {
  getStatus:     ()     => api.get('/api/hospital/status'),
  getContext:    ()     => api.get('/api/hospital/context'),
  getProfile:    ()     => api.get('/api/hospital/profile'),
  updateProfile: (data) => api.put('/api/hospital/profile', data),
  
  createProfile:   (data) => api.post('/api/hospital/profile/create', data),
  uploadDocuments: (form) => api.post('/api/hospital/profile/documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  submitApproval:  ()     => api.post('/api/hospital/createapproval', {}),

  createCamp:       (form) => api.post('/api/hospital/camp/create', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getCamps:         ()     => api.get('/api/hospital/camp/camps'),
  getCampById:      (id)   => api.get(`/api/hospital/camp/camps/${id}`),
  updateCamp:       (id, data) => api.put(`/api/hospital/camp/camps/${id}`, data),
  updateCampStatus: (id, status) => api.put(`/api/hospital/camp/camps/${id}/status`, { status })
};
