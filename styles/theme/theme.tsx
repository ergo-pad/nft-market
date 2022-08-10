import { createTheme } from "@mui/material/styles";

export const LightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fff",
      paper: "#ddd",
    },
    text: {
      primary: '#000',
      secondary: '#333',
    },
    primary: {
      main: "#9FD2DB",
    },
    secondary: {
      main: "#FC9E4F",
    },
  },
});

export const DarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0E1421",
      paper: "#0E1421",
    },
    text: {
      primary: '#fff',
      secondary: '#ccc',
    },
    primary: {
      main: "#9FD2DB",
    },
    secondary: {
      main: "#FC9E4F",
    },
  },
});