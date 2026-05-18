import { userService } from '../services/userService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const userController = {
  async list(req, res) {
    const users = await userService.list(req.query);
    sendSuccess(res, users, 'Users loaded successfully.');
  },
};
