import api from './instance';

export const userApi = {
  updateProfile: (data) => api.put('/api/user/profile', data),
  getProfile: () => api.get('/api/user/profile'),
};

export const diseaseApi = {
  predictHeart: (data) => api.post('/api/user/service/disease/heart-predict', data),
  predictDiabetes: (data) => api.post('/api/user/service/disease/diabetes', data),
  predictSkin: (data) => api.post('/api/user/service/disease/skin', data),
  getHistory: () => api.get('/api/user/service/disease/history'),
};

export const nearbyApi = {
  find: (params) => api.get('/api/user/nearby', { params }),
};

export const chatbotApi = {
  send: (message) => api.post('/api/user/service/chatbot/chat', { message }),
};

export const userSettingsApi = {
  getContext: () => api.get('/api/user/context'),
  getSettings: () => api.get('/api/user/settings'),
  updateGeneral: (data) => api.put('/api/user/settings/general', data),
  updateAppearance: (data) => api.put('/api/user/settings/appearance', data),
  updateNotification: (data) => api.put('/api/user/settings/notification', data),
};

export const googleApi = {
  connect: () => api.get('/api/user/settings/google/connect'),
  disconnect: () => api.post('/api/user/settings/google/disconnect')
};
