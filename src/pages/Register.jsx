import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

const Register = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          Create workspace access
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-950">
          Register account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Registration UI is staged for validation and API integration.
        </p>
      </div>

      <form className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="register-name"
            className="text-sm font-medium text-gray-700"
          >
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Gagandeep Singh"
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Create password"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-semibold text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
