import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./toastContext";

const TOAST_TTL = 3500;

const toastStyles = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950 dark:text-emerald-100",
  error:
    "border-red-200 bg-red-50 text-red-950 dark:border-red-900/70 dark:bg-red-950 dark:text-red-100",
  info:
    "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900/70 dark:bg-blue-950 dark:text-blue-100",
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    const nextToast = {
      id,
      type: "info",
      ...toast,
    };

    setToasts((currentToasts) => [...currentToasts, nextToast]);
    window.setTimeout(() => dismissToast(id), TOAST_TTL);
  }, [dismissToast]);

  const value = useMemo(
    () => ({
      showToast,
      success: (message) => showToast({ message, type: "success" }),
      error: (message) => showToast({ message, type: "error" }),
      info: (message) => showToast({ message, type: "info" }),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${toastStyles[toast.type]}`}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{toast.message}</p>
              <button
                type="button"
                className="text-current opacity-70 transition hover:opacity-100"
                onClick={() => dismissToast(toast.id)}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastProvider;
