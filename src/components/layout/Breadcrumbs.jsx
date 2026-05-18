import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

const Breadcrumbs = ({ currentRoute }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <Link
        to={ROUTES.DASHBOARD}
        className="font-medium text-gray-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
      >
        Home
      </Link>
      <span className="text-gray-300 dark:text-slate-600" aria-hidden="true">
        /
      </span>
      <span className="truncate font-medium text-gray-900 dark:text-slate-100">
        {currentRoute.title}
      </span>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  currentRoute: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default Breadcrumbs;
