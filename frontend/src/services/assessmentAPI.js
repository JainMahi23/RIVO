import apiClient, { ENABLE_FALLBACK } from './apiClient';

const fallbackAssessment = {
  id: 'asmt_01',
  completion: 85,
  businessName: 'Palampur Agro-Store & Kirana',
  businessType: 'Kirana & Agro-Store',
  createdAt: new Date().toISOString(),
  personal: {
    fullName: 'Ramesh Kumar',
    mobile: '9876543210',
    village: 'Palampur',
    district: 'Kangra',
    state: 'Himachal Pradesh',
    experienceYears: '5',
    category: 'OBC',
  },
  business: {
    businessType: 'Kirana & Agro-Store',
    lat: 32.1109,
    lng: 76.5363,
    address: 'Main Market Road, Near Panchayat Ghar, Palampur',
    initialInvestment: 350000,
    expectedMonthlyRevenue: 120000,
    expectedMonthlyExpense: 75000,
    loanRequired: 250000,
  },
};

const assessmentAPI = {
  list: async () => {
    try {
      return await apiClient.get('/assessments');
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { assessments: [fallbackAssessment], isFallback: true };
      }
      throw err;
    }
  },

  getActive: async () => {
    try {
      return await apiClient.get('/assessments/active');
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { assessment: fallbackAssessment, isFallback: true };
      }
      throw err;
    }
  },

  getById: async (id) => {
    try {
      return await apiClient.get(`/assessments/${id}`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { assessment: { ...fallbackAssessment, id }, isFallback: true };
      }
      throw err;
    }
  },

  create: async (payload) => {
    try {
      return await apiClient.post('/assessments', payload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        const newAsmt = {
          ...fallbackAssessment,
          id: `asmt_${Date.now()}`,
          businessName: payload.business?.businessType || 'New Business Assessment',
          ...payload,
        };
        return { assessment: newAsmt, isFallback: true };
      }
      throw err;
    }
  },

  updateStep: async (id, step, payload) => {
    try {
      return await apiClient.patch(`/assessments/${id}/steps/${step}`, payload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        const updated = {
          ...fallbackAssessment,
          id,
          [step]: payload,
        };
        return { assessment: updated, isFallback: true };
      }
      throw err;
    }
  },

  submit: async (id) => {
    try {
      return await apiClient.post(`/assessments/${id}/submit`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { assessment: { ...fallbackAssessment, id, completion: 100, status: 'SUBMITTED' }, isFallback: true };
      }
      throw err;
    }
  },
};

export default assessmentAPI;
