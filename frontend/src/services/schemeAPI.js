import apiClient, { ENABLE_FALLBACK } from './apiClient';

const fallbackSchemes = [
  {
    id: 'pmegp',
    name: 'PMEGP — Prime Minister Employment Generation Programme',
    category: 'Central Subsidy Scheme',
    matchPercent: 94,
    description: 'Credit-linked margin money subsidy program for rural and urban micro-enterprises.',
    subsidy: '25% - 35%',
    maxLoan: '₹25,00,000',
    reasons: [
      'Fits rural manufacturing and trading ceiling cap',
      'Eligible for 35% margin money subsidy in rural areas',
      'Requires 8th pass qualification for projects above ₹10L',
    ],
    documents: ['Aadhaar Card', 'Project DPR', 'EDP Training Certificate', 'Caste/Category Certificate'],
    applicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
  },
  {
    id: 'mudra_kishore',
    name: 'MUDRA Scheme (Kishore Category)',
    category: 'Collateral-Free Loan',
    matchPercent: 88,
    description: 'Government scheme providing collateral-free loans for non-corporate small business enterprises.',
    subsidy: '7% Interest Subvention (in specific states)',
    maxLoan: '₹5,00,000',
    reasons: [
      'No collateral requirement or third-party guarantee',
      'Fast-track approval for working capital and machinery purchase',
    ],
    documents: ['Identity Proof', 'Address Proof', 'Business License', 'Bank Statements (6 months)'],
    applicationUrl: 'https://www.mudra.org.in/',
  },
  {
    id: 'standup_india',
    name: 'Stand-Up India Scheme',
    category: 'Women & SC/ST Entrepreneurship',
    matchPercent: 82,
    description: 'Bank loans between 10 Lakhs and 1 Crore to SC/ST or Women borrowers for setting up greenfield enterprises.',
    subsidy: 'Low Margin Money Requirement (15%)',
    maxLoan: '₹1,00,00,000',
    reasons: [
      'Tailored for greenfield enterprise creation',
      'Composite loan covering equipment and working capital',
    ],
    documents: ['Applicant Category Proof', 'Project Plan DPR', 'Land/Lease Document'],
    applicationUrl: 'https://www.standupmitra.in/',
  },
];

const schemeAPI = {
  getMatches: async (assessmentId) => {
    try {
      return await apiClient.get(`/schemes/${assessmentId}/matches`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { schemes: fallbackSchemes, isFallback: true };
      }
      throw err;
    }
  },

  getSchemeDetail: async (schemeId) => {
    try {
      return await apiClient.get(`/schemes/${schemeId}`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        const found = fallbackSchemes.find((s) => s.id === schemeId) || fallbackSchemes[0];
        return { scheme: found, isFallback: true };
      }
      throw err;
    }
  },

  applyToScheme: async (assessmentId, schemeId, payload) => {
    try {
      return await apiClient.post(`/schemes/${assessmentId}/${schemeId}/apply`, payload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return {
          success: true,
          applicationId: `APP_${Date.now()}`,
          message: `Application submitted successfully for ${schemeId.toUpperCase()}`,
          isFallback: true,
        };
      }
      throw err;
    }
  },
};

export default schemeAPI;
