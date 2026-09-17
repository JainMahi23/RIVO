import { mlClient, ENABLE_FALLBACK } from './apiClient';

/**
 * RIVO Machine Learning & AI Microservices Client
 * 
 * Target base URL: VITE_ML_API_URL (Default: http://localhost:8000/api/v1/ml)
 * Interfaces directly with ML model pipelines for feasibility prediction,
 * footfall/demand forecasting, scheme recommendation ranking, and LLM chat.
 */

const fallbackMLData = {
  feasibility: {
    overallScore: 84,
    marketScore: 79,
    financialScore: 88,
    modelConfidence: 0.92,
    swot: {
      strengths: [
        'High population catchment density within 3 km',
        'Low competition for specialized agro-inputs',
        'Strong debt-service coverage ratio (DSCR > 1.8)',
      ],
      weaknesses: [
        'Seasonal cash flow variations in Q1 & Q2',
        'Initial working capital buffer required for inventory',
      ],
      opportunities: [
        'PMEGP 25-35% margin money subvention eligible',
        'High demand for organic fertilizers & local logistics',
      ],
      threats: [
        'Monsoon dependence on raw agricultural crop yields',
        'Fluctuating wholesale distributor pricing',
      ],
    },
    recommendations: [
      'Maintain at least 45 days of working capital buffer.',
      'Apply for PMEGP loan subsidy before Q3 cutoff.',
      'Introduce digital payments (UPI QR) to improve credit visibility.',
    ],
  },
  demandForecast: {
    catchmentPopulation: 20800,
    estimatedDailyFootfall: 145,
    demandIntensityIndex: 8.4,
    series: [
      { label: 'Mon', value: 65, forecast: 70 },
      { label: 'Tue', value: 92, forecast: 88 },
      { label: 'Wed', value: 78, forecast: 82 },
      { label: 'Thu', value: 110, forecast: 115 },
      { label: 'Fri', value: 105, forecast: 108 },
      { label: 'Sat', value: 140, forecast: 142 },
      { label: 'Sun', value: 155, forecast: 160 },
    ],
    competitorDensity: [
      { name: 'General stores', count: 5, SaturationRisk: 'Medium' },
      { name: 'Farm supply shops', count: 2, SaturationRisk: 'Low' },
      { name: 'Tailoring / Garments', count: 3, SaturationRisk: 'Low' },
    ],
  },
  rankedSchemes: [
    {
      id: 'pmegp',
      name: 'PMEGP (Prime Minister Employment Generation Programme)',
      category: 'Central Subsidy Scheme',
      matchPercent: 94,
      subsidy: '25% - 35% Margin Money',
      maxLoan: '₹25,00,000',
      confidenceScore: 0.95,
      reasons: [
        'Project location falls in rural/semi-urban district',
        'First-time micro-enterprise applicant',
        'High financial viability score',
      ],
    },
    {
      id: 'mudra_kishore',
      name: 'Pradhan Mantri MUDRA Yojana (Kishore Tier)',
      category: 'Collateral-Free Loan',
      matchPercent: 88,
      subsidy: 'Interest Subvention Available',
      maxLoan: '₹5,00,000',
      confidenceScore: 0.89,
      reasons: [
        'Requested capital requirement fits Kishore band (₹50k - ₹5L)',
        'Zero collateral security required',
      ],
    },
    {
      id: 'standup_india',
      name: 'Stand-Up India Scheme',
      category: 'Greenfield Enterprise Credit',
      matchPercent: 82,
      subsidy: 'Composite Loan (75% of Project Cost)',
      maxLoan: '₹1,00,00,000',
      confidenceScore: 0.84,
      reasons: [
        'Applicable for greenfield trading & service enterprises',
      ],
    },
  ],
  aiReply: (msg) => ({
    reply: `Based on Rivo's ML model assessment for your location, your feasibility score of 84% reflects strong local footfall (est. 145 daily visits) and low competition for your category. To address your question "${msg}", we recommend leveraging the PMEGP subsidy which covers up to 35% of capital expenditure.`,
    suggestedPrompts: [
      'How do I calculate my PMEGP subsidy?',
      'What are the main risks for my business?',
      'How to lower initial inventory costs?',
    ],
  }),
};

const mlAPI = {
  /**
   * Predict overall feasibility score, financial health, and SWOT analysis.
   * POST /ml/feasibility/predict
   */
  predictFeasibility: async (assessmentData) => {
    try {
      return await mlClient.post('/feasibility/predict', assessmentData);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        console.warn('[ML API Offline] Returning fallback Feasibility prediction model result.');
        return { success: true, data: fallbackMLData.feasibility, isFallback: true };
      }
      throw err;
    }
  },

  /**
   * Forecast footfall, population catchment, and demand index based on location coordinates.
   * POST /ml/market/demand-forecast
   */
  forecastDemand: async (locationPayload) => {
    try {
      return await mlClient.post('/market/demand-forecast', locationPayload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        console.warn('[ML API Offline] Returning fallback Market Demand forecast model result.');
        return { success: true, data: fallbackMLData.demandForecast, isFallback: true };
      }
      throw err;
    }
  },

  /**
   * Rank government loan schemes using ML recommendation model.
   * POST /ml/schemes/rank
   */
  rankSchemes: async (profilePayload) => {
    try {
      return await mlClient.post('/schemes/rank', profilePayload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        console.warn('[ML API Offline] Returning fallback Scheme Ranking model result.');
        return { success: true, schemes: fallbackMLData.rankedSchemes, isFallback: true };
      }
      throw err;
    }
  },

  /**
   * Send chat message to AI LLM Inference engine.
   * POST /ml/ai/chat
   */
  chatInference: async (assessmentId, message, history = []) => {
    try {
      return await mlClient.post('/ai/chat', { assessmentId, message, history });
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        console.warn('[ML API Offline] Returning fallback AI inference response.');
        return { success: true, ...fallbackMLData.aiReply(message), isFallback: true };
      }
      throw err;
    }
  },
};

export default mlAPI;
