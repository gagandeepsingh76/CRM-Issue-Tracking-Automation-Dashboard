import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
    </BrowserRouter>
  );
};

export default AppRouter;
