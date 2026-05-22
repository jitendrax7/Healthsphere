import api from './instance';

export const campApi = {
  getAll: (params) => api.get('/api/user/service/camp', { params }),
  getById: (id) => api.get(`/api/user/service/camp/${id}`),
  register: (id) => api.post(`/api/user/service/camp/${id}/register`),
};
