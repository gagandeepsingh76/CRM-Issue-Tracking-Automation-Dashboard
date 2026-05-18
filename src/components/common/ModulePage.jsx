import PropTypes from "prop-types";

const ModulePage = ({ title, description, metrics, actions, children }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            CRM Module
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-950">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            {description}
          </p>
        </div>

        {actions.length ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action}
                type="button"
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {action}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-gray-500">{metric.helper}</p>
          </article>
        ))}
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        {children}
      </section>
    </div>
  );
};

ModulePage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      helper: PropTypes.string.isRequired,
    }),
  ).isRequired,
  actions: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
};

ModulePage.defaultProps = {
  actions: [],
};

export default ModulePage;
