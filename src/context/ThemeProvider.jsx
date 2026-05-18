import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext";

const STORAGE_KEY = "crm-ui-theme";
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const getPreferredTheme = () => {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (Object.values(THEMES).includes(storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getPreferredTheme);
  const isDarkMode = theme === THEMES.DARK;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [isDarkMode, theme]);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode,
      toggleTheme: () =>
        setTheme((currentTheme) =>
          currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK,
        ),
    }),
    [isDarkMode, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
