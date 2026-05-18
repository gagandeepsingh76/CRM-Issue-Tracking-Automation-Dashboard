import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import LoadingPlaceholder from "../components/common/LoadingPlaceholder";
import RouteMetadata from "../components/common/RouteMetadata";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";
import NotFound from "../pages/NotFound";
import { ROUTES } from "./paths";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { protectedRoutes, publicRoutes } from "./routeConfig";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <RouteMetadata />
      <Suspense fallback={<LoadingPlaceholder label="Loading module..." />}>
        <Routes>
          <Route element={<PublicLayout />}>
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PublicRoute>{route.element}</PublicRoute>}
              />
            ))}
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path={ROUTES.ROOT}
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute allowedRoles={route.allowedRoles}>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
