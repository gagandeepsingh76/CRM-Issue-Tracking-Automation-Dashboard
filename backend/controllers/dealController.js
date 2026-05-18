import { dealService } from '../services/dealService.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const dealController = {
  async list(req, res) {
    const { items, meta } = await dealService.list(req.query);
    sendSuccess(res, items, 'Deals loaded successfully.', 200, meta);
  },

  async pipeline(req, res) {
    const pipeline = await dealService.pipeline();
    sendSuccess(res, pipeline, 'Deal pipeline loaded successfully.');
  },

  async create(req, res) {
    const deal = await dealService.create(req.body, req.user);
    sendCreated(res, deal, 'Deal created successfully.');
  },

  async getById(req, res) {
    const deal = await dealService.getById(req.params.id);
    sendSuccess(res, deal, 'Deal loaded successfully.');
  },

  async update(req, res) {
    const deal = await dealService.update(req.params.id, req.body);
    sendSuccess(res, deal, 'Deal updated successfully.');
  },

  async updateStage(req, res) {
    const deal = await dealService.updateStage(req.params.id, req.body);
    sendSuccess(res, deal, 'Deal stage updated successfully.');
  },

  async remove(req, res) {
    const deal = await dealService.remove(req.params.id);
    sendSuccess(res, deal, 'Deal archived successfully.');
  },
};
