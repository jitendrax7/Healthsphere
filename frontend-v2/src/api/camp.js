import api from './instance';

export const campApi = {
  getAll: () => api.get('/api/user/service/camp'),
  getById: (id) => api.get(`/api/user/service/camp/${id}`),
  register: (id) => api.post(`/api/user/service/camp/${id}/register`),
};
