import PropTypes from "prop-types";

const LoadingPlaceholder = ({ label }) => {
  return (
    <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-7 w-56 animate-pulse rounded bg-gray-200" />
        <p className="mt-4 text-sm text-gray-500">{label}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-lg border border-gray-100 bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
};

LoadingPlaceholder.propTypes = {
  label: PropTypes.string,
};

LoadingPlaceholder.defaultProps = {
  label: "Loading workspace...",
};

export default LoadingPlaceholder;
