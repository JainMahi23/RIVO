import apiClient, { ENABLE_FALLBACK } from './apiClient';

const fallbackUser = {
  id: 'u_101',
  name: 'Ramesh Kumar',
  mobile: '9876543210',
  village: 'Palampur',
  district: 'Kangra',
  state: 'Himachal Pradesh',
  language: 'en',
  businessType: 'Kirana & Agro-Store',
};

const authAPI = {
  requestOtp: async (mobile) => {
    try {
      return await apiClient.post('/auth/otp/request', { mobile });
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { message: 'OTP 123456 generated (Fallback Mode enabled)', isFallback: true };
      }
      throw err;
    }
  },

  verifyOtp: async (mobile, otp) => {
    try {
      return await apiClient.post('/auth/otp/verify', { mobile, otp });
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { user: { ...fallbackUser, mobile }, token: 'mock-jwt-token-123', isFallback: true };
      }
      throw err;
    }
  },

  loginWithPassword: async (identifier, password) => {
    try {
      return await apiClient.post('/auth/login', { identifier, password });
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { user: { ...fallbackUser, name: identifier || 'Ramesh Kumar' }, token: 'mock-jwt-token-123', isFallback: true };
      }
      throw err;
    }
  },

  register: async (payload) => {
    try {
      return await apiClient.post('/auth/register', payload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { user: { ...fallbackUser, name: payload.fullName || payload.name, mobile: payload.mobile, village: payload.village }, token: 'mock-jwt-token-123', isFallback: true };
      }
      throw err;
    }
  },

  logout: async () => {
    try {
      return await apiClient.post('/auth/logout');
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { message: 'Logged out successfully' };
      }
      throw err;
    }
  },

  me: async () => {
    try {
      return await apiClient.get('/auth/me');
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { user: fallbackUser, isFallback: true };
      }
      throw err;
    }
  },

  updateProfile: async (payload) => {
    try {
      return await apiClient.patch('/auth/profile', payload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { user: { ...fallbackUser, ...payload }, isFallback: true };
      }
      throw err;
    }
  },
};

export default authAPI;
