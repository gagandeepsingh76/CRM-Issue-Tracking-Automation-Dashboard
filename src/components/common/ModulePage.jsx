import PropTypes from "prop-types";

const ModulePage = ({ title, description, metrics, actions, children }) => {
  const normalizeAction = (action) =>
    typeof action === "string" ? { label: action } : action;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
            CRM Module
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        {actions.length ? (
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:justify-end">
            {actions.map((action) => {
              const normalizedAction = normalizeAction(action);

              return (
                <button
                  key={normalizedAction.label}
                  type="button"
                  className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-800"
                  onClick={normalizedAction.onClick}
                  disabled={normalizedAction.disabled}
                >
                  {normalizedAction.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              {metric.helper}
            </p>
          </article>
        ))}
      </div>

      <section
        aria-label={`${title} workspace`}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900"
      >
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
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      helper: PropTypes.string.isRequired,
    }),
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
      }),
    ]),
  ),
  children: PropTypes.node.isRequired,
};

ModulePage.defaultProps = {
  actions: [],
};

export default ModulePage;
