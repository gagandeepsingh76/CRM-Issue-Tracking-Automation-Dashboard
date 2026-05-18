import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { protectedRoutes, publicRoutes } from "../routes/routeConfig";

const routes = [...publicRoutes, ...protectedRoutes];

export const useCurrentRoute = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    return (
      routes.find((route) =>
        matchPath({ path: route.path, end: true }, pathname),
      ) ?? { title: "CRM Dashboard" }
    );
  }, [pathname]);
};
