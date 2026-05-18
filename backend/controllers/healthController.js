import { env } from '../config/env.js';
import { healthService } from '../services/healthService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const healthController = {
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
