import { customerService } from '../services/customerService.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const customerController = {
  async list(req, res) {
    const { items, meta } = await customerService.list(req.query);
    sendSuccess(res, items, 'Customers loaded successfully.', 200, meta);
  },

  async create(req, res) {
    const customer = await customerService.create(req.body, req.user);
    sendCreated(res, customer, 'Customer created successfully.');
  },

  async getById(req, res) {
    const customer = await customerService.getById(req.params.id);
    sendSuccess(res, customer, 'Customer loaded successfully.');
  },

  async update(req, res) {
    const customer = await customerService.update(req.params.id, req.body);
    sendSuccess(res, customer, 'Customer updated successfully.');
  },

  async remove(req, res) {
    const customer = await customerService.remove(req.params.id);
    sendSuccess(res, customer, 'Customer archived successfully.');
  },
};
