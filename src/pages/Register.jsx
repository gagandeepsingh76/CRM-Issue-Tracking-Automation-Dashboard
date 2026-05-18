import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../routes/paths";
import { useAuthStore } from "../store/authStore";
import { ALL_ROLES, AUTH_ROLES } from "../utils/roles";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const registerAccount = useAuthStore((state) => state.register);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const isLoading = status === "loading";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: AUTH_ROLES.EMPLOYEE,
    },
  });

  const onSubmit = async (values) => {
    try {
      await registerAccount(values);
      toast.success("Account created.");
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

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

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
            aria-invalid={Boolean(errors.name)}
            {...register("name", {
              required: "Full name is required.",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters.",
              },
            })}
          />
          {errors.name ? (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          ) : null}
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
            aria-invalid={Boolean(errors.password)}
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
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
            htmlFor="register-role"
            className="text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="register-role"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register("role", { required: "Role is required." })}
          >
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
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
          {isLoading ? "Creating account..." : "Register"}
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
