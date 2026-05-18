import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={isDarkMode}
      className="inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-800"
      onClick={toggleTheme}
    >
      {isDarkMode ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;
