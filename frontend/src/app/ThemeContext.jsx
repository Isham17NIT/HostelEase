import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem("theme", next);
  };

  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
