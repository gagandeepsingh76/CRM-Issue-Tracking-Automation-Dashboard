import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../routes/paths";
import { useAuthStore } from "../store/authStore";
import { ALL_ROLES, AUTH_ROLES, formatRole } from "../utils/roles";

const demoAccounts = [
  {
    label: "Admin",
    email: "admin@crm.local",
    role: AUTH_ROLES.ADMIN,
  },
  {
    label: "Manager",
    email: "manager@crm.local",
    role: AUTH_ROLES.MANAGER,
  },
  {
    label: "Employee",
    email: "employee@crm.local",
    role: AUTH_ROLES.EMPLOYEE,
  },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const isLoading = status === "loading";
  const redirectTo = location.state?.from?.pathname ?? ROUTES.DASHBOARD;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@crm.local",
      password: "Password@123",
      role: AUTH_ROLES.ADMIN,
    },
  });

  const selectDemoAccount = (account) => {
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", "Password@123", { shouldValidate: true });
    setValue("role", account.role, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Login successful.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

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
          Use one of the seeded backend accounts or any account registered
          through the API.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {demoAccounts.map((account) => (
          <button
            key={account.email}
            type="button"
            className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => selectDemoAccount(account)}
          >
            {account.label}
          </button>
        ))}
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
            aria-invalid={Boolean(errors.email)}
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          ) : null}
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
            aria-invalid={Boolean(errors.password)}
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
            })}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="login-role"
            className="text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="login-role"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register("role", { required: "Role is required." })}
          >
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Backend permissions come from the authenticated user record.
          </p>
        </div>

        {authError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {authError}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
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
