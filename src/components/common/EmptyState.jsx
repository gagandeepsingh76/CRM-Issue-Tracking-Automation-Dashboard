import PropTypes from "prop-types";

const EmptyState = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-800">
      <p className="text-base font-semibold text-gray-950">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

EmptyState.defaultProps = {
  actionLabel: "",
  onAction: null,
};

export default EmptyState;
