import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import Modal from "../components/common/Modal";
import ModulePage from "../components/common/ModulePage";
import { useToast } from "../hooks/useToast";
import { useCrmStore } from "../store/crmStore";
import { compactPayload } from "../utils/formPayload";
import { formatCurrency, formatEnum } from "../utils/crmFormat";

const CUSTOMER_STATUSES = ["ACTIVE", "INACTIVE", "ARCHIVED"];

const emptyCustomerForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  status: "ACTIVE",
  annualValue: "",
  assignedToId: "",
};

const Customers = () => {
  const toast = useToast();
  const customers = useCrmStore((state) => state.customers);
  const users = useCrmStore((state) => state.users.items);
  const loadCustomers = useCrmStore((state) => state.loadCustomers);
  const loadUsers = useCrmStore((state) => state.loadUsers);
  const createCustomer = useCrmStore((state) => state.createCustomer);
  const updateCustomer = useCrmStore((state) => state.updateCustomer);
  const deleteCustomer = useCrmStore((state) => state.deleteCustomer);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(emptyCustomerForm);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const customerItems = customers.items;
  const isLoading = customers.status === "loading";

  const metrics = useMemo(() => {
    const activeCount = customerItems.filter(
      (customer) => customer.status === "ACTIVE",
    ).length;
    const accountValue = customerItems.reduce(
      (sum, customer) => sum + Number(customer.annualValue ?? 0),
      0,
    );
    const owners = new Set(
      customerItems.map((customer) => customer.assignedTo?.id).filter(Boolean),
    );

    return [
      {
        label: "Accounts",
        value: customers.meta?.total ?? customerItems.length,
        helper: "Loaded from PostgreSQL",
      },
      { label: "Active", value: activeCount, helper: "Engaged accounts" },
      {
        label: "Portfolio value",
        value: formatCurrency(accountValue),
        helper: "Annual value in current view",
      },
      {
        label: "Owners",
        value: owners.size,
        helper: "Assigned CRM users",
      },
    ];
  }, [customerItems, customers.meta?.total]);

  const fetchCustomers = useCallback((filters = {}) =>
    loadCustomers({ limit: 20, ...filters }).catch(() => {
      toast.error("Unable to load customers.");
    }), [loadCustomers, toast]);

  useEffect(() => {
    fetchCustomers();
    loadUsers().catch(() => {
      toast.error("Unable to load assignment users.");
    });
  }, [fetchCustomers, loadUsers, toast]);

  const openCreateModal = () => {
    setEditingCustomer(null);
    setForm(emptyCustomerForm);
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      company: customer.company ?? "",
      industry: customer.industry ?? "",
      status: customer.status ?? "ACTIVE",
      annualValue: customer.annualValue ?? "",
      assignedToId: customer.assignedToId ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setForm(emptyCustomerForm);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchCustomers({
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
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, payload);
        toast.success("Customer updated.");
      } else {
        await createCustomer(payload);
        toast.success("Customer created.");
      }
      closeModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Archive ${customer.name}?`)) {
      return;
    }

    try {
      await deleteCustomer(customer.id);
      toast.success("Customer archived.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ModulePage
      title="Customers"
      description="Centralized customer accounts with ownership, searchable account data, and backend-backed CRUD."
      actions={[
        { label: "Add customer", onClick: openCreateModal },
        {
          label: "Refresh",
          onClick: () => fetchCustomers(),
          disabled: isLoading,
        },
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
            placeholder="Search name, email, company, or industry"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
          >
            <option value="">All statuses</option>
            {CUSTOMER_STATUSES.map((status) => (
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
          <LoadingPlaceholder label="Loading customers..." />
        ) : customers.status === "error" ? (
          <ErrorState
            message={customers.error}
            onRetry={() => fetchCustomers(customers.filters)}
          />
        ) : customerItems.length === 0 ? (
          <EmptyState
            title="No customers found"
            message="Create a customer account or adjust the current filters."
            actionLabel="Add customer"
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-slate-800">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  <th className="px-3 py-3">Account</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Owner</th>
                  <th className="px-3 py-3">Value</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {customerItems.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-gray-950 dark:text-white">
                        {customer.name}
                      </p>
                      <p className="text-gray-500 dark:text-slate-400">
                        {customer.company ?? customer.email ?? "No company"}
                      </p>
                    </td>
                    <td className="px-3 py-3">{formatEnum(customer.status)}</td>
                    <td className="px-3 py-3">
                      {customer.assignedTo?.name ?? "Unassigned"}
                    </td>
                    <td className="px-3 py-3">
                      {formatCurrency(customer.annualValue)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-md border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                          onClick={() => openEditModal(customer)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/40"
                          onClick={() => handleDelete(customer)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen ? (
        <Modal
          title={editingCustomer ? "Edit customer" : "Add customer"}
          onClose={closeModal}
        >
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Name
              <input
                required
                name="name"
                value={form.name}
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
              Company
              <input
                name="company"
                value={form.company}
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
              Industry
              <input
                name="industry"
                value={form.industry}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Annual value
              <input
                name="annualValue"
                type="number"
                min="0"
                value={form.annualValue}
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
                {CUSTOMER_STATUSES.map((status) => (
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
                {isSaving ? "Saving..." : "Save customer"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </ModulePage>
  );
};

export default Customers;
