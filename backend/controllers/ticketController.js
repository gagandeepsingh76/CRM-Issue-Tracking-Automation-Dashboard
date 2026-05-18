import { ticketService } from '../services/ticketService.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const ticketController = {
  async list(req, res) {
    const { items, meta } = await ticketService.list(req.query);
    sendSuccess(res, items, 'Tickets loaded successfully.', 200, meta);
  },

  async create(req, res) {
    const ticket = await ticketService.create(req.body, req.user);
    sendCreated(res, ticket, 'Ticket created successfully.');
  },

  async getById(req, res) {
    const ticket = await ticketService.getById(req.params.id);
    sendSuccess(res, ticket, 'Ticket loaded successfully.');
  },

  async update(req, res) {
    const ticket = await ticketService.update(req.params.id, req.body);
    sendSuccess(res, ticket, 'Ticket updated successfully.');
  },

  async updatePriority(req, res) {
    const ticket = await ticketService.updatePriority(req.params.id, req.body.priority);
    sendSuccess(res, ticket, 'Ticket priority updated successfully.');
  },

  async remove(req, res) {
    const ticket = await ticketService.remove(req.params.id);
    sendSuccess(res, ticket, 'Ticket closed and archived successfully.');
  },
};
