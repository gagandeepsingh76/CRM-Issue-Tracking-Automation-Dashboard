import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { env } from "../../config/env";
import { protectedRoutes, publicRoutes } from "../../routes/routeConfig";

const routes = [...publicRoutes, ...protectedRoutes];

const setMeta = (attribute, value, content) => {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, value);
    document.head.append(meta);
  }

  meta.setAttribute("content", content);
};

const RouteMetadata = () => {
  const location = useLocation();

  useEffect(() => {
    const route = routes.find((item) => item.path === location.pathname);
    const title = route ? `${route.title} | ${env.appName}` : env.appName;
    const description =
      route?.description ??
      "Production-ready CRM SaaS dashboard for customer, revenue, and support operations.";

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "application-name", env.appName);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
  }, [location.pathname]);

  return null;
};

export default RouteMetadata;
