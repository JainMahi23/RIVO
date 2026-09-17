import apiClient, { ENABLE_FALLBACK } from './apiClient';

const fallbackFinance = {
  overallScore: 86,
  financialScore: 88,
  marketScore: 82,
  metrics: {
    initialInvestment: 350000,
    expectedMonthlyRevenue: 120000,
    expectedMonthlyExpense: 75000,
    monthlyNetProfit: 45000,
    paybackPeriodMonths: 8,
    breakEvenUnitsPerMonth: 210,
    recommendedLoanAmount: 250000,
    debtServiceCoverageRatio: 2.14,
  },
  swot: {
    strengths: ['Low fixed operational overhead', 'Healthy gross margin (> 35%)'],
    weaknesses: ['Vulnerable to seasonal agricultural cycles'],
    opportunities: ['PMEGP subsidy covers 35% margin money'],
    threats: ['Local credit extension defaults'],
  },
};

const financeAPI = {
  calculate: async (assessmentId, payload) => {
    try {
      return await apiClient.post(`/finance/${assessmentId}/calculate`, payload);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        const rev = Number(payload.expectedMonthlyRevenue || 120000);
        const exp = Number(payload.expectedMonthlyExpense || 75000);
        const inv = Number(payload.initialInvestment || 350000);
        const profit = rev - exp;
        return {
          result: {
            assessmentId,
            initialInvestment: inv,
            expectedMonthlyRevenue: rev,
            expectedMonthlyExpense: exp,
            monthlyNetProfit: profit,
            paybackPeriodMonths: profit > 0 ? Math.ceil(inv / profit) : 'N/A',
            computedAt: new Date().toISOString(),
          },
          isFallback: true,
        };
      }
      throw err;
    }
  },

  getFeasibility: async (assessmentId) => {
    try {
      return await apiClient.get(`/finance/${assessmentId}/feasibility`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return { report: fallbackFinance, isFallback: true };
      }
      throw err;
    }
  },

  getReports: async (assessmentId) => {
    try {
      return await apiClient.get(`/finance/${assessmentId}/reports`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return {
          reports: [
            { id: 'feasibility', name: 'Executive Feasibility Report', date: new Date().toLocaleDateString() },
            { id: 'market', name: 'Market Saturation & Footfall Analysis', date: new Date().toLocaleDateString() },
            { id: 'financial', name: '5-Year Cash Flow Projections', date: new Date().toLocaleDateString() },
            { id: 'pmegp_dpr', name: 'PMEGP Detailed Project Report (DPR)', date: new Date().toLocaleDateString() },
          ],
          isFallback: true,
        };
      }
      throw err;
    }
  },

  downloadReport: async (assessmentId, reportId) => {
    try {
      return await apiClient.get(`/finance/${assessmentId}/reports/${reportId}/download`, {
        responseType: 'blob',
      });
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        // Build a mock text/pdf blob for local preview testing
        const content = `RIVO Report [${reportId.toUpperCase()}] for Assessment: ${assessmentId}\nGenerated: ${new Date().toISOString()}`;
        return new Blob([content], { type: 'text/plain' });
      }
      throw err;
    }
  },
};

export default financeAPI;
