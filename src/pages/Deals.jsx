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

const PROGRESS_WIDTH_CLASS_BY_PERCENT = {
  0: "w-0",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-[20%]",
  25: "w-1/4",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-[40%]",
  45: "w-[45%]",
  50: "w-1/2",
  55: "w-[55%]",
  60: "w-[60%]",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-3/4",
  80: "w-[80%]",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-full",
};

const getProgressWidthClass = (value) => {
  const numericValue = Number(value ?? 0);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  const normalizedValue = Math.max(0, Math.min(safeValue, 100));
  const bucket = Math.ceil(normalizedValue / 5) * 5;

  return PROGRESS_WIDTH_CLASS_BY_PERCENT[bucket];
};

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
            <div key={stage.stage} className="rounded-md border border-gray-200 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-sm font-semibold text-gray-950 dark:text-white">
                {formatEnum(stage.stage)}
              </p>
              <p className="mt-2 text-lg font-bold text-gray-950 dark:text-white">
                {formatCurrency(stage.value)}
              </p>
              <div className="mt-3 h-2 rounded-full bg-gray-100 dark:bg-slate-800">
                <div
                  className={`h-2 rounded-full bg-blue-600 ${getProgressWidthClass(stage.averageProbability)}`}
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
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
          />
          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
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
                className="grid gap-3 rounded-md border border-gray-200 p-4 dark:border-slate-800 dark:bg-slate-900/60 lg:grid-cols-[1.4fr_160px_180px_auto]"
              >
                <div>
                  <p className="font-semibold text-gray-950 dark:text-white">{deal.title}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {deal.customer?.name ?? "No customer"} -{" "}
                    {formatDate(deal.expectedCloseDate)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {formatCurrency(deal.value)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Progress
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-slate-800">
                    <div
                      className={`h-2 rounded-full bg-blue-600 ${getProgressWidthClass(deal.probability)}`}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                    {formatPercent(deal.probability)}
                  </p>
                </div>
                <select
                  value={deal.stage}
                  onChange={(event) => handleStageChange(deal, event.target.value)}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
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
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => openEditModal(deal)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="h-10 rounded-md border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/40"
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
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Title
              <input
                required
                name="title"
                value={form.title}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Value
              <input
                required
                name="value"
                type="number"
                min="0"
                value={form.value}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Customer
              <select
                required
                name="customerId"
                value={form.customerId}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Stage
              <select
                name="stage"
                value={form.stage}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              >
                {DEAL_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {formatEnum(stage)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Probability
              <input
                name="probability"
                type="number"
                min="0"
                max="100"
                value={form.probability}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Expected close date
              <input
                name="expectedCloseDate"
                type="date"
                value={form.expectedCloseDate}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
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
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200 sm:col-span-2">
              Notes
              <textarea
                name="notes"
                rows="3"
                value={form.notes}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
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
