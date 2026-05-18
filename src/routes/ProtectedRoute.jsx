import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import AccessDenied from "../components/common/AccessDenied";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import { useAuthStore } from "../store/authStore";
import { ALL_ROLES, canAccessRoute } from "../utils/roles";
import { ROUTES } from "./paths";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (!hasHydrated) {
    return <LoadingPlaceholder label="Restoring secure session..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  if (!canAccessRoute(user?.role, allowedRoles)) {
    return <AccessDenied />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  allowedRoles: ALL_ROLES,
};

export default ProtectedRoute;
