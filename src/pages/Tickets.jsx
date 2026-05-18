import ModulePage from "../components/common/ModulePage";

const Tickets = () => {
  return (
    <ModulePage
      title="Tickets"
      description="Prepare support operations with ticket priority, ownership, SLA status, and resolution tracking placeholders."
      actions={["New ticket", "Triage queue"]}
      metrics={[
        { label: "Open", value: "37", helper: "Awaiting response" },
        { label: "High priority", value: "9", helper: "Escalation queue" },
        { label: "Resolved", value: "112", helper: "Last 30 days" },
        { label: "SLA met", value: "93%", helper: "Mock service level" },
      ]}
    >
      <div className="divide-y divide-gray-200">
        {["Login issue", "Billing question", "Integration request"].map(
          (ticket) => (
            <div key={ticket} className="flex justify-between gap-4 py-3">
              <span className="font-medium text-gray-900">{ticket}</span>
              <span className="text-sm text-gray-500">Open</span>
            </div>
          ),
        )}
      </div>
    </ModulePage>
  );
};

export default Tickets;
