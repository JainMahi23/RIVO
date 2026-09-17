import apiClient, { ENABLE_FALLBACK } from './apiClient';

const fallbackMarket = {
  summary: {
    description: 'Semi-urban commercial cluster with high footfall during morning & evening hours.',
    population: 20800,
    radiusKm: 3,
    nearbyBusinessCount: 12,
    avgHouseholdSize: 4.6,
    nearbyBusinesses: [
      { name: 'Palampur Farmers Co-op', type: 'Agriculture', distanceKm: 0.4 },
      { name: 'Gupta General Merchant', type: 'Kirana', distanceKm: 0.8 },
      { name: 'Shiva Machinery Store', type: 'Hardware', distanceKm: 1.2 },
    ],
  },
  demand: {
    series: [
      { label: 'Mon', value: 65 },
      { label: 'Tue', value: 85 },
      { label: 'Wed', value: 75 },
      { label: 'Thu', value: 110 },
      { label: 'Fri', value: 95 },
      { label: 'Sat', value: 140 },
      { label: 'Sun', value: 160 },
    ],
  },
  competitors: {
    competitors: [
      { name: 'General Kirana Stores', count: 5, risk: 'Medium' },
      { name: 'Agro-Inputs & Seeds', count: 2, risk: 'Low' },
      { name: 'Hardware & Tools', count: 3, risk: 'Low' },
      { name: 'Garments & Tailoring', count: 2, risk: 'Low' },
    ],
  },
  businessTypes: ['Kirana & Agro-Store', 'Cold-Press Oil Unit', 'Solar Service Hub', 'Dairy Collection Point'],
};

const marketAPI = {
  getLocationSummary: async (assessmentId, { lat, lng }) => {
    try {
      return await apiClient.get(`/market/${assessmentId}/location`, { params: { lat, lng } });
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { summary: fallbackMarket.summary, isFallback: true };
      }
      throw err;
    }
  },

  getDemandScore: async (assessmentId) => {
    try {
      return await apiClient.get(`/market/${assessmentId}/demand`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { series: fallbackMarket.demand.series, isFallback: true };
      }
      throw err;
    }
  },

  getCompetitorDensity: async (assessmentId) => {
    try {
      return await apiClient.get(`/market/${assessmentId}/competitors`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { competitors: fallbackMarket.competitors.competitors, isFallback: true };
      }
      throw err;
    }
  },

  getNearbyBusinessTypes: async (assessmentId) => {
    try {
      return await apiClient.get(`/market/${assessmentId}/business-types`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { businessTypes: fallbackMarket.businessTypes, isFallback: true };
      }
      throw err;
    }
  },
};

export default marketAPI;
