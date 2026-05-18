import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-slate-950">
      <section className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
          The route you opened is not part of the CRM workspace.
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="mt-6 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
