import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import Modal from "../components/common/Modal";
import ModulePage from "../components/common/ModulePage";
import { useToast } from "../hooks/useToast";
import { useCrmStore } from "../store/crmStore";
import { formatCurrency, formatEnum } from "../utils/crmFormat";
import { compactPayload } from "../utils/formPayload";

const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

const emptyLeadForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  source: "",
  status: "NEW",
  score: "",
  estimatedValue: "",
  assignedToId: "",
};

const Leads = () => {
  const toast = useToast();
  const leads = useCrmStore((state) => state.leads);
  const users = useCrmStore((state) => state.users.items);
  const loadLeads = useCrmStore((state) => state.loadLeads);
  const loadUsers = useCrmStore((state) => state.loadUsers);
  const createLead = useCrmStore((state) => state.createLead);
  const updateLead = useCrmStore((state) => state.updateLead);
  const updateLeadStatus = useCrmStore((state) => state.updateLeadStatus);
  const deleteLead = useCrmStore((state) => state.deleteLead);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(emptyLeadForm);
  const [editingLead, setEditingLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const leadItems = leads.items;
  const isLoading = leads.status === "loading";

  const metrics = useMemo(() => {
    const qualified = leadItems.filter(
      (lead) => lead.status === "QUALIFIED",
    ).length;
    const converted = leadItems.filter(
      (lead) => lead.status === "CONVERTED",
    ).length;
    const estimatedValue = leadItems.reduce(
      (sum, lead) => sum + Number(lead.estimatedValue ?? 0),
      0,
    );
    const conversionRate = leadItems.length
      ? `${Math.round((converted / leadItems.length) * 100)}%`
      : "0%";

    return [
      {
        label: "Leads",
        value: leads.meta?.total ?? leadItems.length,
        helper: "Loaded from PostgreSQL",
      },
      { label: "Qualified", value: qualified, helper: "Ready for sales" },
      { label: "Conversion", value: conversionRate, helper: "Current view" },
      {
        label: "Estimated value",
        value: formatCurrency(estimatedValue),
        helper: "Open lead value",
      },
    ];
  }, [leadItems, leads.meta?.total]);

  const fetchLeads = useCallback((filters = {}) =>
    loadLeads({ limit: 20, ...filters }).catch(() => {
      toast.error("Unable to load leads.");
    }), [loadLeads, toast]);

  useEffect(() => {
    fetchLeads();
    loadUsers().catch(() => {
      toast.error("Unable to load assignment users.");
    });
  }, [fetchLeads, loadUsers, toast]);

  const openCreateModal = () => {
    setEditingLead(null);
    setForm(emptyLeadForm);
    setIsModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setForm({
      firstName: lead.firstName ?? "",
      lastName: lead.lastName ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      source: lead.source ?? "",
      status: lead.status ?? "NEW",
      score: lead.score ?? "",
      estimatedValue: lead.estimatedValue ?? "",
      assignedToId: lead.assignedToId ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
    setForm(emptyLeadForm);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchLeads({
      search: search.trim() || undefined,
      status: statusFilter || undefined,
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
      if (editingLead) {
        await updateLead(editingLead.id, payload);
        toast.success("Lead updated.");
      } else {
        await createLead(payload);
        toast.success("Lead created.");
      }
      closeModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (lead, status) => {
    try {
      await updateLeadStatus(lead.id, status);
      toast.success("Lead status updated.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAssignmentChange = async (lead, assignedToId) => {
    try {
      await updateLead(lead.id, compactPayload({ assignedToId }));
      toast.success("Lead assignment updated.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Archive ${lead.firstName} ${lead.lastName}?`)) {
      return;
    }

    try {
      await deleteLead(lead.id);
      toast.success("Lead archived.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ModulePage
      title="Leads"
      description="Track live lead status, ownership, source, value, and assignment workflows from the backend."
      actions={[
        { label: "Create lead", onClick: openCreateModal },
        { label: "Refresh", onClick: () => fetchLeads(), disabled: isLoading },
      ]}
      metrics={metrics}
    >
      <div className="space-y-5">
        <form
          className="grid gap-3 md:grid-cols-[1fr_180px_auto]"
          onSubmit={handleFilterSubmit}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, company, or source"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatEnum(status)}
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
          <LoadingPlaceholder label="Loading leads..." />
        ) : leads.status === "error" ? (
          <ErrorState
            message={leads.error}
            onRetry={() => fetchLeads(leads.filters)}
          />
        ) : leadItems.length === 0 ? (
          <EmptyState
            title="No leads found"
            message="Create a lead or adjust the current filters."
            actionLabel="Create lead"
            onAction={openCreateModal}
          />
        ) : (
          <div className="space-y-3">
            {leadItems.map((lead) => (
              <div
                key={lead.id}
                className="grid gap-3 rounded-md border border-gray-200 p-4 dark:border-slate-800 dark:bg-slate-900/60 lg:grid-cols-[1.3fr_180px_180px_auto]"
              >
                <div>
                  <p className="font-semibold text-gray-950 dark:text-white">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {lead.company ?? lead.email ?? "No company"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                    {formatCurrency(lead.estimatedValue)} estimated value
                  </p>
                </div>
                <select
                  value={lead.status}
                  onChange={(event) =>
                    handleStatusChange(lead, event.target.value)
                  }
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatEnum(status)}
                    </option>
                  ))}
                </select>
                <select
                  value={lead.assignedToId ?? ""}
                  onChange={(event) =>
                    handleAssignmentChange(lead, event.target.value)
                  }
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => openEditModal(lead)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="h-10 rounded-md border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/40"
                    onClick={() => handleDelete(lead)}
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
        <Modal title={editingLead ? "Edit lead" : "Create lead"} onClose={closeModal}>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              First name
              <input
                required
                name="firstName"
                value={form.firstName}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Last name
              <input
                required
                name="lastName"
                value={form.lastName}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Company
              <input
                name="company"
                value={form.company}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Source
              <input
                name="source"
                value={form.source}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Score
              <input
                name="score"
                type="number"
                min="0"
                max="100"
                value={form.score}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Estimated value
              <input
                name="estimatedValue"
                type="number"
                min="0"
                value={form.estimatedValue}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatEnum(status)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Owner
              <select
                name="assignedToId"
                value={form.assignedToId}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
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
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save lead"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </ModulePage>
  );
};

export default Leads;
