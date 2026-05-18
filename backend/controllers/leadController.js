import { leadService } from '../services/leadService.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const leadController = {
  async list(req, res) {
    const { items, meta } = await leadService.list(req.query);
    sendSuccess(res, items, 'Leads loaded successfully.', 200, meta);
  },

  async create(req, res) {
    const lead = await leadService.create(req.body, req.user);
    sendCreated(res, lead, 'Lead created successfully.');
  },

  async getById(req, res) {
    const lead = await leadService.getById(req.params.id);
    sendSuccess(res, lead, 'Lead loaded successfully.');
  },

  async update(req, res) {
    const lead = await leadService.update(req.params.id, req.body);
    sendSuccess(res, lead, 'Lead updated successfully.');
  },

  async updateStatus(req, res) {
    const lead = await leadService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, lead, 'Lead status updated successfully.');
  },

  async remove(req, res) {
    const lead = await leadService.remove(req.params.id);
    sendSuccess(res, lead, 'Lead archived successfully.');
  },
};
