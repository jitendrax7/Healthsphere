import api from './instance';

export const donorApi = {
  register:           (data)         => api.post('/api/donor/register', data),
  getProfile:         ()             => api.get('/api/donor/profile'),
  setAvailability:    (isAvailable)  => api.patch('/api/donor/availability', { isAvailable }),
  setPrivacy:         (isAnonymous)  => api.patch('/api/donor/privacy', { isAnonymous }),
  getInvites:         (page = 1)     => api.get('/api/donor/invites', { params: { page } }),
  respondInvite:      (inviteId, status) => api.post('/api/donor/respond', { inviteId, status }),
  getHistory:         (page = 1)     => api.get('/api/donor/history', { params: { page } }),
  getNotifications:   (page = 1)     => api.get('/api/donor/notifications', { params: { page } }),
  markNotifRead:      (notificationId) => api.patch('/api/donor/notifications/read', { notificationId }),
};

export const bloodRequestApi = {
  create:       (data)   => api.post('/api/blood/request', data),
  list:         (status) => api.get('/api/blood/request', { params: status ? { status } : {} }),
  getDonors:    (id)     => api.get(`/api/blood/request/${id}/donors`),
  close:        (id)     => api.patch(`/api/blood/request/${id}/close`),
  updateStatus: (data)   => api.patch('/api/blood/request/status', data),
  invite:       (data)   => api.post('/api/blood/invite', data),
  cancelInvite: (inviteId) => api.patch('/api/blood/invite/cancel', { inviteId }),
  community:    (params) => api.get('/api/blood/community', { params }),
};
