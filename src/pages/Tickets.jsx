import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import Modal from "../components/common/Modal";
import ModulePage from "../components/common/ModulePage";
import { useToast } from "../hooks/useToast";
import { useCrmStore } from "../store/crmStore";
import { formatEnum } from "../utils/crmFormat";
import { compactPayload } from "../utils/formPayload";

const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const emptyTicketForm = {
  subject: "",
  description: "",
  status: "OPEN",
  priority: "MEDIUM",
  requesterName: "",
  requesterEmail: "",
  customerId: "",
  assignedToId: "",
};

const Tickets = () => {
  const toast = useToast();
  const tickets = useCrmStore((state) => state.tickets);
  const customers = useCrmStore((state) => state.customers.items);
  const users = useCrmStore((state) => state.users.items);
  const loadTickets = useCrmStore((state) => state.loadTickets);
  const loadCustomers = useCrmStore((state) => state.loadCustomers);
  const loadUsers = useCrmStore((state) => state.loadUsers);
  const createTicket = useCrmStore((state) => state.createTicket);
  const updateTicket = useCrmStore((state) => state.updateTicket);
  const updateTicketPriority = useCrmStore(
    (state) => state.updateTicketPriority,
  );
  const deleteTicket = useCrmStore((state) => state.deleteTicket);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [form, setForm] = useState(emptyTicketForm);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const ticketItems = tickets.items;
  const isLoading = tickets.status === "loading";

  const metrics = useMemo(() => {
    const open = ticketItems.filter((ticket) =>
      ["OPEN", "IN_PROGRESS"].includes(ticket.status),
    ).length;
    const highPriority = ticketItems.filter((ticket) =>
      ["HIGH", "URGENT"].includes(ticket.priority),
    ).length;
    const resolved = ticketItems.filter((ticket) =>
      ["RESOLVED", "CLOSED"].includes(ticket.status),
    ).length;
    const urgent = ticketItems.filter(
      (ticket) => ticket.priority === "URGENT",
    ).length;

    return [
      { label: "Open", value: open, helper: "Needs support action" },
      { label: "High priority", value: highPriority, helper: "Escalation queue" },
      { label: "Resolved", value: resolved, helper: "Completed work" },
      { label: "Urgent", value: urgent, helper: "Immediate attention" },
    ];
  }, [ticketItems]);

  const fetchTickets = useCallback((filters = {}) =>
    loadTickets({ limit: 20, ...filters }).catch(() => {
      toast.error("Unable to load tickets.");
    }), [loadTickets, toast]);

  useEffect(() => {
    fetchTickets();
    loadCustomers({ limit: 100 }).catch(() => {
      toast.error("Unable to load customers for tickets.");
    });
    loadUsers().catch(() => {
      toast.error("Unable to load assignment users.");
    });
  }, [fetchTickets, loadCustomers, loadUsers, toast]);

  const openCreateModal = () => {
    setEditingTicket(null);
    setForm(emptyTicketForm);
    setIsModalOpen(true);
  };

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setForm({
      subject: ticket.subject ?? "",
      description: ticket.description ?? "",
      status: ticket.status ?? "OPEN",
      priority: ticket.priority ?? "MEDIUM",
      requesterName: ticket.requesterName ?? "",
      requesterEmail: ticket.requesterEmail ?? "",
      customerId: ticket.customerId ?? "",
      assignedToId: ticket.assignedToId ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
    setForm(emptyTicketForm);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchTickets({
      search: search.trim() || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      page: 1,
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = compactPayload(form);
      if (editingTicket) {
        await updateTicket(editingTicket.id, payload);
        toast.success("Ticket updated.");
      } else {
        await createTicket(payload);
        toast.success("Ticket created.");
      }
      closeModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (ticket, status) => {
    try {
      await updateTicket(ticket.id, { status });
      toast.success("Ticket status updated.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePriorityChange = async (ticket, priority) => {
    try {
      await updateTicketPriority(ticket.id, priority);
      toast.success("Ticket priority updated.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (ticket) => {
    if (!window.confirm(`Archive ${ticket.subject}?`)) {
      return;
    }

    try {
      await deleteTicket(ticket.id);
      toast.success("Ticket archived.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ModulePage
      title="Tickets"
      description="Support queue connected to real ticket priority, status, customer, and owner data."
      actions={[
        { label: "New ticket", onClick: openCreateModal },
        { label: "Refresh", onClick: () => fetchTickets(), disabled: isLoading },
      ]}
      metrics={metrics}
    >
      <div className="space-y-5">
        <form
          className="grid gap-3 lg:grid-cols-[1fr_170px_170px_auto]"
          onSubmit={handleFilterSubmit}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search subject, description, requester, or email"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All statuses</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatEnum(status)}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {formatEnum(priority)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Apply
          </button>
        </form>

        {isLoading ? (
          <LoadingPlaceholder label="Loading tickets..." />
        ) : tickets.status === "error" ? (
          <ErrorState
            message={tickets.error}
            onRetry={() => fetchTickets(tickets.filters)}
          />
        ) : ticketItems.length === 0 ? (
          <EmptyState
            title="No tickets found"
            message="Create a ticket or adjust the current filters."
            actionLabel="New ticket"
            onAction={openCreateModal}
          />
        ) : (
          <div className="space-y-3">
            {ticketItems.map((ticket) => (
              <div
                key={ticket.id}
                className="grid gap-3 rounded-md border border-gray-200 p-4 lg:grid-cols-[1.4fr_160px_160px_auto]"
              >
                <div>
                  <p className="font-semibold text-gray-950">{ticket.subject}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {ticket.customer?.name ?? ticket.requesterEmail ?? "No customer"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {ticket.description}
                  </p>
                </div>
                <select
                  value={ticket.status}
                  onChange={(event) =>
                    handleStatusChange(ticket, event.target.value)
                  }
                  className="h-10 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {TICKET_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatEnum(status)}
                    </option>
                  ))}
                </select>
                <select
                  value={ticket.priority}
                  onChange={(event) =>
                    handlePriorityChange(ticket, event.target.value)
                  }
                  className="h-10 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {formatEnum(priority)}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    onClick={() => openEditModal(ticket)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="h-10 rounded-md border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    onClick={() => handleDelete(ticket)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen ? (
        <Modal
          title={editingTicket ? "Edit ticket" : "New ticket"}
          onClose={closeModal}
        >
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Subject
              <input
                required
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Description
              <textarea
                required
                name="description"
                rows="4"
                value={form.description}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {TICKET_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatEnum(status)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Priority
              <select
                name="priority"
                value={form.priority}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {formatEnum(priority)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Requester name
              <input
                name="requesterName"
                value={form.requesterName}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Requester email
              <input
                name="requesterEmail"
                type="email"
                value={form.requesterEmail}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Customer
              <select
                name="customerId"
                value={form.customerId}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">No customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Owner
              <select
                name="assignedToId"
                value={form.assignedToId}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Assign to me</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button
                type="button"
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save ticket"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </ModulePage>
  );
};

export default Tickets;
