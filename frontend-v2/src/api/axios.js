import api from './instance';
import { authApi } from './auth';
import { userApi, diseaseApi, nearbyApi, chatbotApi, userSettingsApi, googleApi } from './user';
import { doctorApi } from './doctor';
import { hospitalApi } from './hospital';
import { appointmentApi } from './appointment';
import { donorApi, bloodRequestApi } from './blood';
import { campApi } from './camp';

export default api;

export {
  authApi,
  userApi,
  diseaseApi,
  appointmentApi,
  donorApi,
  bloodRequestApi,
  campApi,
  nearbyApi,
  chatbotApi,
  userSettingsApi,
  doctorApi,
  hospitalApi,
  googleApi
};