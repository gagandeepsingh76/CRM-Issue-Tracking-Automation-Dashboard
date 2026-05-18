import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

const Login = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-950">
          Login to CRM Suite
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          This form is ready for JWT authentication in Phase 4.
        </p>
      </div>

      <form className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter password"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        New here?{" "}
        <Link to={ROUTES.REGISTER} className="font-semibold text-blue-600">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
