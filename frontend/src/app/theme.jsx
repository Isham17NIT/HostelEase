import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0FB9B1" },
    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3FE0D0" },
    background: {
      default: "#0B0F1A",
      paper: "#111827",
    },
  },
});
