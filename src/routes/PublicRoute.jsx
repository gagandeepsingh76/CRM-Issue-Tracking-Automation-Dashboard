import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import { useAuthStore } from "../store/authStore";
import { ROUTES } from "./paths";

const PublicRoute = ({ children }) => {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isRestoringSession = useAuthStore((state) => state.isRestoringSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (!hasHydrated || isRestoringSession) {
    return <LoadingPlaceholder label="Checking session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
