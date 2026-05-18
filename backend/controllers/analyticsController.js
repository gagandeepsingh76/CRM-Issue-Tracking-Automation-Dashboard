import { analyticsService } from '../services/analyticsService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const analyticsController = {
  async summary(req, res) {
    const summary = await analyticsService.dashboardSummary();
    sendSuccess(res, summary, 'Dashboard summary loaded successfully.');
  },

  async pipeline(req, res) {
    const summary = await analyticsService.pipelineSummary();
    sendSuccess(res, summary, 'Pipeline analytics loaded successfully.');
  },

  async tickets(req, res) {
    const summary = await analyticsService.ticketSummary();
    sendSuccess(res, summary, 'Ticket analytics loaded successfully.');
  },
};
