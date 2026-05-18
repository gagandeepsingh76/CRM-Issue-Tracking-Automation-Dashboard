import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import Modal from "../components/common/Modal";
import ModulePage from "../components/common/ModulePage";
import { useToast } from "../hooks/useToast";
import { useCrmStore } from "../store/crmStore";
import {
  formatCurrency,
  formatDate,
  formatEnum,
  formatPercent,
} from "../utils/crmFormat";
import { compactPayload } from "../utils/formPayload";

const DEAL_STAGES = [
  "PROSPECTING",
  "QUALIFICATION",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const emptyDealForm = {
  title: "",
  value: "",
  stage: "PROSPECTING",
  probability: "10",
  expectedCloseDate: "",
  customerId: "",
  assignedToId: "",
  notes: "",
};

const Deals = () => {
  const toast = useToast();
  const deals = useCrmStore((state) => state.deals);
  const customers = useCrmStore((state) => state.customers.items);
  const users = useCrmStore((state) => state.users.items);
  const pipelineAnalytics = useCrmStore((state) => state.pipelineAnalytics);
  const loadDeals = useCrmStore((state) => state.loadDeals);
  const loadCustomers = useCrmStore((state) => state.loadCustomers);
  const loadUsers = useCrmStore((state) => state.loadUsers);
  const loadPipelineAnalytics = useCrmStore(
    (state) => state.loadPipelineAnalytics,
  );
  const createDeal = useCrmStore((state) => state.createDeal);
  const updateDeal = useCrmStore((state) => state.updateDeal);
  const updateDealStage = useCrmStore((state) => state.updateDealStage);
  const deleteDeal = useCrmStore((state) => state.deleteDeal);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [form, setForm] = useState(emptyDealForm);
  const [editingDeal, setEditingDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const dealItems = deals.items;
  const isLoading = deals.status === "loading";

  const metrics = useMemo(() => {
    const pipelineValue = dealItems
      .filter((deal) => !["WON", "LOST"].includes(deal.stage))
      .reduce((sum, deal) => sum + Number(deal.value ?? 0), 0);
    const wonValue = dealItems
      .filter((deal) => deal.stage === "WON")
      .reduce((sum, deal) => sum + Number(deal.value ?? 0), 0);
    const averageProbability = dealItems.length
      ? dealItems.reduce((sum, deal) => sum + Number(deal.probability ?? 0), 0) /
        dealItems.length
      : 0;
    const stalled = dealItems.filter((deal) =>
      ["PROSPECTING", "QUALIFICATION"].includes(deal.stage),
    ).length;

    return [
      {
        label: "Pipeline",
        value: formatCurrency(pipelineValue),
        helper: "Open deal value",
      },
      { label: "Won", value: formatCurrency(wonValue), helper: "Closed won" },
      {
        label: "Forecast",
        value: formatPercent(averageProbability),
        helper: "Average probability",
      },
      { label: "Early stage", value: stalled, helper: "Needs action" },
    ];
  }, [dealItems]);

  const fetchDeals = useCallback((filters = {}) =>
    loadDeals({ limit: 20, ...filters }).catch(() => {
      toast.error("Unable to load deals.");
    }), [loadDeals, toast]);

  const refreshPipeline = useCallback(() =>
    loadPipelineAnalytics().catch(() => {
      toast.error("Unable to load pipeline analytics.");
    }), [loadPipelineAnalytics, toast]);

  useEffect(() => {
    fetchDeals();
    refreshPipeline();
    loadCustomers({ limit: 100 }).catch(() => {
      toast.error("Unable to load customers for deals.");
    });
    loadUsers().catch(() => {
      toast.error("Unable to load assignment users.");
    });
  }, [fetchDeals, loadCustomers, loadUsers, refreshPipeline, toast]);

  const openCreateModal = () => {
    setEditingDeal(null);
    setForm(emptyDealForm);
    setIsModalOpen(true);
  };

  const openEditModal = (deal) => {
    setEditingDeal(deal);
    setForm({
      title: deal.title ?? "",
      value: deal.value ?? "",
      stage: deal.stage ?? "PROSPECTING",
      probability: deal.probability ?? "10",
      expectedCloseDate: deal.expectedCloseDate
        ? deal.expectedCloseDate.slice(0, 10)
        : "",
      customerId: deal.customerId ?? "",
      assignedToId: deal.assignedToId ?? "",
      notes: deal.notes ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
    setForm(emptyDealForm);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchDeals({
      search: search.trim() || undefined,
      stage: stageFilter || undefined,
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
      const payload = compactPayload({
        ...form,
        expectedCloseDate: form.expectedCloseDate
          ? new Date(`${form.expectedCloseDate}T00:00:00.000Z`).toISOString()
          : "",
      });
      if (editingDeal) {
        await updateDeal(editingDeal.id, payload);
        toast.success("Deal updated.");
      } else {
        await createDeal(payload);
        toast.success("Deal created.");
      }
      refreshPipeline();
      closeModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStageChange = async (deal, stage) => {
    const probability = stage === "WON" ? 100 : stage === "LOST" ? 0 : undefined;

    try {
      await updateDealStage(deal.id, compactPayload({ stage, probability }));
      refreshPipeline();
      toast.success("Deal stage updated.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (deal) => {
    if (!window.confirm(`Archive ${deal.title}?`)) {
      return;
    }

    try {
      await deleteDeal(deal.id);
      refreshPipeline();
      toast.success("Deal archived.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ModulePage
      title="Deals"
      description="Monitor live pipeline stages, expected revenue, close dates, and owner accountability."
      actions={[
        { label: "Add deal", onClick: openCreateModal },
        { label: "Refresh", onClick: () => fetchDeals(), disabled: isLoading },
      ]}
      metrics={metrics}
    >
      <div className="space-y-5">
        <div className="grid gap-3 lg:grid-cols-6">
          {(pipelineAnalytics.data ?? []).map((stage) => (
            <div key={stage.stage} className="rounded-md border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-950">
                {formatEnum(stage.stage)}
              </p>
              <p className="mt-2 text-lg font-bold text-gray-950">
                {formatCurrency(stage.value)}
              </p>
              <div className="mt-3 h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${Math.min(stage.averageProbability, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <form
          className="grid gap-3 md:grid-cols-[1fr_180px_auto]"
          onSubmit={handleFilterSubmit}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search deal title or customer"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All stages</option>
            {DEAL_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {formatEnum(stage)}
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
          <LoadingPlaceholder label="Loading deals..." />
        ) : deals.status === "error" ? (
          <ErrorState
            message={deals.error}
            onRetry={() => fetchDeals(deals.filters)}
          />
        ) : dealItems.length === 0 ? (
          <EmptyState
            title="No deals found"
            message="Create a deal or adjust the current filters."
            actionLabel="Add deal"
            onAction={openCreateModal}
          />
        ) : (
          <div className="space-y-3">
            {dealItems.map((deal) => (
              <div
                key={deal.id}
                className="grid gap-3 rounded-md border border-gray-200 p-4 lg:grid-cols-[1.4fr_160px_180px_auto]"
              >
                <div>
                  <p className="font-semibold text-gray-950">{deal.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {deal.customer?.name ?? "No customer"} -{" "}
                    {formatDate(deal.expectedCloseDate)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {formatCurrency(deal.value)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Progress
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {formatPercent(deal.probability)}
                  </p>
                </div>
                <select
                  value={deal.stage}
                  onChange={(event) => handleStageChange(deal, event.target.value)}
                  className="h-10 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {DEAL_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {formatEnum(stage)}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    onClick={() => openEditModal(deal)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="h-10 rounded-md border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    onClick={() => handleDelete(deal)}
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
        <Modal title={editingDeal ? "Edit deal" : "Add deal"} onClose={closeModal}>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-gray-700">
              Title
              <input
                required
                name="title"
                value={form.title}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Value
              <input
                required
                name="value"
                type="number"
                min="0"
                value={form.value}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Customer
              <select
                required
                name="customerId"
                value={form.customerId}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Stage
              <select
                name="stage"
                value={form.stage}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {DEAL_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {formatEnum(stage)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Probability
              <input
                name="probability"
                type="number"
                min="0"
                max="100"
                value={form.probability}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Expected close date
              <input
                name="expectedCloseDate"
                type="date"
                value={form.expectedCloseDate}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
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
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Notes
              <textarea
                name="notes"
                rows="3"
                value={form.notes}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
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
                {isSaving ? "Saving..." : "Save deal"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </ModulePage>
  );
};

export default Deals;
