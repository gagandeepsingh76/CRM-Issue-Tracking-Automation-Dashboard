import { Outlet, useLocation } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import ThemeToggle from "../components/common/ThemeToggle";

const PublicLayout = () => {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-950">
      <a href="#auth-content" className="skip-link">
        Skip to authentication form
      </a>
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section
          id="auth-content"
          className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="w-full max-w-md">
            <div className="mb-4 flex justify-end">
              <ThemeToggle />
            </div>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </div>
        </section>

        <aside className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between dark:bg-black">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              CRM Operations
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              One workspace for customers, revenue, and support.
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-300">
              Secure authentication, live CRM data, analytics, and production
              deployment controls are connected end to end.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
            <div>
              <p className="text-2xl font-bold text-white">9</p>
              <p>Modules</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p>User roles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p>Pipeline view</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default PublicLayout;
