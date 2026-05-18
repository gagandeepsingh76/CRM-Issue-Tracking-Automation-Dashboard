import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

const AccessDenied = () => {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="text-sm font-semibold uppercase tracking-wide">
        Access restricted
      </p>
      <h2 className="mt-2 text-2xl font-bold">You cannot open this module.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6">
        This route is protected by role metadata from your authenticated
        backend session.
      </p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-5 inline-flex rounded-md bg-amber-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800"
      >
        Return to dashboard
      </Link>
    </section>
  );
};

export default AccessDenied;
