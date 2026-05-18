import { notificationService } from '../services/notificationService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const notificationController = {
  async list(req, res) {
    const { items, meta } = await notificationService.list(req.user.id, req.query);
    sendSuccess(res, items, 'Notifications loaded successfully.', 200, meta);
  },

  async markRead(req, res) {
    const notification = await notificationService.markRead(
      req.user.id,
      req.params.id,
    );
    sendSuccess(res, notification, 'Notification marked as read.');
  },

  async markAllRead(req, res) {
    const result = await notificationService.markAllRead(req.user.id);
    sendSuccess(res, result, 'Notifications marked as read.');
  },
};
