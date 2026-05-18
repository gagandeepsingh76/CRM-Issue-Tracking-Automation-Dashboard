import { authService } from '../services/authService.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const authController = {
  async register(req, res) {
    const session = await authService.register(req.body);
    sendCreated(res, session, 'Registration completed successfully.');
  },

  async login(req, res) {
    const session = await authService.login(req.body);
    sendSuccess(res, session, 'Login completed successfully.');
  },

  async me(req, res) {
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, user, 'Authenticated profile loaded.');
  },
};
