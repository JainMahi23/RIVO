import apiClient, { ENABLE_FALLBACK } from './apiClient';
import mlAPI from './mlAPI';

const aiAPI = {
  sendMessage: async (assessmentId, message, history = []) => {
    try {
      // First try calling ML microservices endpoint if available
      return await mlAPI.chatInference(assessmentId, message, history);
    } catch {
      try {
        return await apiClient.post('/ai/chat', { assessmentId, message, history });
      } catch (err) {
        if (ENABLE_FALLBACK || err.isOffline) {
          return {
            reply: `You asked: "${message}". Based on your assessment in Palampur, your business model shows a strong 84% feasibility rating with high demand in your catchment area.`,
            suggestedPrompts: [
              'How to apply for PMEGP subsidy?',
              'What is my payback period?',
              'How to reduce initial working capital risk?',
            ],
            isFallback: true,
          };
        }
        throw err;
      }
    }
  },

  getSuggestedPrompts: async (assessmentId) => {
    try {
      return await apiClient.get(`/ai/${assessmentId}/suggested-prompts`);
    } catch (err) {
      if (ENABLE_FALLBACK || err.isOffline) {
        return {
          prompts: [
            'Explain my Feasibility Score',
            'Which government scheme gives highest subsidy?',
            'What are my key financial risks?',
            'How to calculate my break-even monthly sales?',
          ],
          isFallback: true,
        };
      }
      throw err;
    }
  },
};

export default aiAPI;
