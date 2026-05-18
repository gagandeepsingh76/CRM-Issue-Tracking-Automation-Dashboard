import { create } from "zustand";
import {
  analyticsService,
  customerService,
  dealService,
  leadService,
  notificationService,
  ticketService,
  userService,
} from "../services/crmApiService";

const collectionState = {
  items: [],
  meta: null,
  filters: {},
  status: "idle",
  error: null,
};

const requestState = {
  data: null,
  status: "idle",
  error: null,
};

const getErrorMessage = (error) => error.message ?? "Request failed.";

const replaceItem = (items, item) =>
  items.map((currentItem) => (currentItem.id === item.id ? item : currentItem));

const removeItem = (items, id) =>
  items.filter((currentItem) => currentItem.id !== id);

const asCollectionLoading = (slice, filters) => ({
  ...slice,
  filters,
  status: "loading",
  error: null,
});

const asCollectionSuccess = (slice, result) => ({
  ...slice,
  items: result.data,
  meta: result.meta,
  status: "success",
  error: null,
});

const asCollectionError = (slice, error) => ({
  ...slice,
  status: "error",
  error: getErrorMessage(error),
});

export const useCrmStore = create((set, get) => ({
  customers: { ...collectionState },
  leads: { ...collectionState },
  deals: { ...collectionState },
  tickets: { ...collectionState },
  notifications: { ...collectionState, meta: { unread: 0 } },
  users: {
    items: [],
    status: "idle",
    error: null,
  },
  dashboard: { ...requestState },
  pipelineAnalytics: { ...requestState, data: [] },
  ticketAnalytics: { ...requestState, data: null },

  loadCustomers: async (filters = {}) => {
    const nextFilters = { ...get().customers.filters, ...filters };
    set((state) => ({
      customers: asCollectionLoading(state.customers, nextFilters),
    }));

    try {
      const result = await customerService.list(nextFilters);
      set((state) => ({
        customers: asCollectionSuccess(state.customers, result),
      }));
      return result;
    } catch (error) {
      set((state) => ({
        customers: asCollectionError(state.customers, error),
      }));
      throw error;
    }
  },

  createCustomer: async (payload) => {
    const customer = await customerService.create(payload);
    set((state) => ({
      customers: {
        ...state.customers,
        items: [customer, ...state.customers.items],
      },
    }));
    return customer;
  },

  updateCustomer: async (id, payload) => {
    const customer = await customerService.update(id, payload);
    set((state) => ({
      customers: {
        ...state.customers,
        items: replaceItem(state.customers.items, customer),
      },
    }));
    return customer;
  },

  deleteCustomer: async (id) => {
    const previousItems = get().customers.items;
    set((state) => ({
      customers: {
        ...state.customers,
        items: removeItem(state.customers.items, id),
      },
    }));

    try {
      return await customerService.remove(id);
    } catch (error) {
      set((state) => ({
        customers: { ...state.customers, items: previousItems },
      }));
      throw error;
    }
  },

  loadLeads: async (filters = {}) => {
    const nextFilters = { ...get().leads.filters, ...filters };
    set((state) => ({ leads: asCollectionLoading(state.leads, nextFilters) }));

    try {
      const result = await leadService.list(nextFilters);
      set((state) => ({ leads: asCollectionSuccess(state.leads, result) }));
      return result;
    } catch (error) {
      set((state) => ({ leads: asCollectionError(state.leads, error) }));
      throw error;
    }
  },

  createLead: async (payload) => {
    const lead = await leadService.create(payload);
    set((state) => ({
      leads: { ...state.leads, items: [lead, ...state.leads.items] },
    }));
    return lead;
  },

  updateLead: async (id, payload) => {
    const lead = await leadService.update(id, payload);
    set((state) => ({
      leads: { ...state.leads, items: replaceItem(state.leads.items, lead) },
    }));
    return lead;
  },

  updateLeadStatus: async (id, status) => {
    const previousItems = get().leads.items;
    set((state) => ({
      leads: {
        ...state.leads,
        items: state.leads.items.map((lead) =>
          lead.id === id ? { ...lead, status } : lead,
        ),
      },
    }));

    try {
      const lead = await leadService.updateStatus(id, status);
      set((state) => ({
        leads: { ...state.leads, items: replaceItem(state.leads.items, lead) },
      }));
      return lead;
    } catch (error) {
      set((state) => ({
        leads: { ...state.leads, items: previousItems },
      }));
      throw error;
    }
  },

  deleteLead: async (id) => {
    const previousItems = get().leads.items;
    set((state) => ({
      leads: { ...state.leads, items: removeItem(state.leads.items, id) },
    }));

    try {
      return await leadService.remove(id);
    } catch (error) {
      set((state) => ({ leads: { ...state.leads, items: previousItems } }));
      throw error;
    }
  },

  loadDeals: async (filters = {}) => {
    const nextFilters = { ...get().deals.filters, ...filters };
    set((state) => ({ deals: asCollectionLoading(state.deals, nextFilters) }));

    try {
      const result = await dealService.list(nextFilters);
      set((state) => ({ deals: asCollectionSuccess(state.deals, result) }));
      return result;
    } catch (error) {
      set((state) => ({ deals: asCollectionError(state.deals, error) }));
      throw error;
    }
  },

  createDeal: async (payload) => {
    const deal = await dealService.create(payload);
    set((state) => ({
      deals: { ...state.deals, items: [deal, ...state.deals.items] },
    }));
    return deal;
  },

  updateDeal: async (id, payload) => {
    const deal = await dealService.update(id, payload);
    set((state) => ({
      deals: { ...state.deals, items: replaceItem(state.deals.items, deal) },
    }));
    return deal;
  },

  updateDealStage: async (id, payload) => {
    const previousItems = get().deals.items;
    set((state) => ({
      deals: {
        ...state.deals,
        items: state.deals.items.map((deal) =>
          deal.id === id ? { ...deal, ...payload } : deal,
        ),
      },
    }));

    try {
      const deal = await dealService.updateStage(id, payload);
      set((state) => ({
        deals: { ...state.deals, items: replaceItem(state.deals.items, deal) },
      }));
      return deal;
    } catch (error) {
      set((state) => ({ deals: { ...state.deals, items: previousItems } }));
      throw error;
    }
  },

  deleteDeal: async (id) => {
    const previousItems = get().deals.items;
    set((state) => ({
      deals: { ...state.deals, items: removeItem(state.deals.items, id) },
    }));

    try {
      return await dealService.remove(id);
    } catch (error) {
      set((state) => ({ deals: { ...state.deals, items: previousItems } }));
      throw error;
    }
  },

  loadTickets: async (filters = {}) => {
    const nextFilters = { ...get().tickets.filters, ...filters };
    set((state) => ({
      tickets: asCollectionLoading(state.tickets, nextFilters),
    }));

    try {
      const result = await ticketService.list(nextFilters);
      set((state) => ({ tickets: asCollectionSuccess(state.tickets, result) }));
      return result;
    } catch (error) {
      set((state) => ({ tickets: asCollectionError(state.tickets, error) }));
      throw error;
    }
  },

  createTicket: async (payload) => {
    const ticket = await ticketService.create(payload);
    set((state) => ({
      tickets: { ...state.tickets, items: [ticket, ...state.tickets.items] },
    }));
    return ticket;
  },

  updateTicket: async (id, payload) => {
    const ticket = await ticketService.update(id, payload);
    set((state) => ({
      tickets: {
        ...state.tickets,
        items: replaceItem(state.tickets.items, ticket),
      },
    }));
    return ticket;
  },

  updateTicketPriority: async (id, priority) => {
    const previousItems = get().tickets.items;
    set((state) => ({
      tickets: {
        ...state.tickets,
        items: state.tickets.items.map((ticket) =>
          ticket.id === id ? { ...ticket, priority } : ticket,
        ),
      },
    }));

    try {
      const ticket = await ticketService.updatePriority(id, priority);
      set((state) => ({
        tickets: {
          ...state.tickets,
          items: replaceItem(state.tickets.items, ticket),
        },
      }));
      return ticket;
    } catch (error) {
      set((state) => ({ tickets: { ...state.tickets, items: previousItems } }));
      throw error;
    }
  },

  deleteTicket: async (id) => {
    const previousItems = get().tickets.items;
    set((state) => ({
      tickets: { ...state.tickets, items: removeItem(state.tickets.items, id) },
    }));

    try {
      return await ticketService.remove(id);
    } catch (error) {
      set((state) => ({ tickets: { ...state.tickets, items: previousItems } }));
      throw error;
    }
  },

  loadDashboardSummary: async () => {
    set({ dashboard: { data: null, status: "loading", error: null } });

    try {
      const data = await analyticsService.summary();
      set({ dashboard: { data, status: "success", error: null } });
      return data;
    } catch (error) {
      set({
        dashboard: { data: null, status: "error", error: getErrorMessage(error) },
      });
      throw error;
    }
  },

  loadPipelineAnalytics: async () => {
    set({ pipelineAnalytics: { data: [], status: "loading", error: null } });

    try {
      const data = await analyticsService.pipeline();
      set({ pipelineAnalytics: { data, status: "success", error: null } });
      return data;
    } catch (error) {
      set({
        pipelineAnalytics: {
          data: [],
          status: "error",
          error: getErrorMessage(error),
        },
      });
      throw error;
    }
  },

  loadTicketAnalytics: async () => {
    set({ ticketAnalytics: { data: null, status: "loading", error: null } });

    try {
      const data = await analyticsService.tickets();
      set({ ticketAnalytics: { data, status: "success", error: null } });
      return data;
    } catch (error) {
      set({
        ticketAnalytics: {
          data: null,
          status: "error",
          error: getErrorMessage(error),
        },
      });
      throw error;
    }
  },

  loadDealPipeline: async () => {
    const pipeline = await dealService.pipeline();
    return pipeline;
  },

  loadNotifications: async (filters = { limit: 10 }) => {
    const nextFilters = { ...get().notifications.filters, ...filters };
    set((state) => ({
      notifications: asCollectionLoading(state.notifications, nextFilters),
    }));

    try {
      const result = await notificationService.list(nextFilters);
      set((state) => ({
        notifications: asCollectionSuccess(state.notifications, result),
      }));
      return result;
    } catch (error) {
      set((state) => ({
        notifications: asCollectionError(state.notifications, error),
      }));
      throw error;
    }
  },

  markNotificationRead: async (id) => {
    const previous = get().notifications;
    set((state) => ({
      notifications: {
        ...state.notifications,
        meta: {
          ...state.notifications.meta,
          unread: Math.max((state.notifications.meta?.unread ?? 0) - 1, 0),
        },
        items: state.notifications.items.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification,
        ),
      },
    }));

    try {
      const notification = await notificationService.markRead(id);
      set((state) => ({
        notifications: {
          ...state.notifications,
          items: replaceItem(state.notifications.items, notification),
        },
      }));
      return notification;
    } catch (error) {
      set({ notifications: previous });
      throw error;
    }
  },

  markAllNotificationsRead: async () => {
    const previous = get().notifications;
    set((state) => ({
      notifications: {
        ...state.notifications,
        meta: { ...state.notifications.meta, unread: 0 },
        items: state.notifications.items.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt ?? new Date().toISOString(),
        })),
      },
    }));

    try {
      return await notificationService.markAllRead();
    } catch (error) {
      set({ notifications: previous });
      throw error;
    }
  },

  loadUsers: async (filters = {}) => {
    set((state) => ({
      users: { ...state.users, status: "loading", error: null },
    }));

    try {
      const users = await userService.list(filters);
      set({ users: { items: users, status: "success", error: null } });
      return users;
    } catch (error) {
      set((state) => ({
        users: {
          ...state.users,
          status: "error",
          error: getErrorMessage(error),
        },
      }));
      throw error;
    }
  },
}));
