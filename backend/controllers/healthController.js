import { env } from '../config/env.js';
import { healthService } from '../services/healthService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const healthController = {
  root(req, res) {
    res.status(200).json({
      success: true,
      message: 'CRM Backend API Running',
      environment: env.nodeEnv,
    });
  },

  apiHealth(req, res) {
    res.status(200).json({
      success: true,
      status: 'healthy',
      service: 'crm-dashboard-backend',
    });
  },

  live(req, res) {
    sendSuccess(res, {
      ...healthService.live(),
      environment: env.nodeEnv,
    });
  },

  async ready(req, res) {
    sendSuccess(res, {
      ...(await healthService.ready()),
      environment: env.nodeEnv,
    });
  },
};
