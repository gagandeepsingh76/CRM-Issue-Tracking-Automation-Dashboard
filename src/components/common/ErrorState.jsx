import PropTypes from "prop-types";

const ErrorState = ({ message, onRetry }) => {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
      role="alert"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">{message}</p>
        {onRetry ? (
          <button
            type="button"
            className="rounded-md border border-red-200 bg-white px-3 py-2 font-semibold text-red-700 transition hover:bg-red-100"
            onClick={onRetry}
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
};

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

ErrorState.defaultProps = {
  onRetry: null,
};

export default ErrorState;
