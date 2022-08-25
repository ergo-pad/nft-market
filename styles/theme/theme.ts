import { createTheme } from "@mui/material/styles";

export const LightTheme = createTheme({
  palette: {
    background: {
      default: "#FFFFFF",
    },
    text: {
      primary: '#000',
      secondary: '#999',
    },
    primary: {
      main: "#00868F",
    },
    secondary: {
      main: "#FF8219",
    },
  },
});

export const DarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0E141F",
    },
    text: {
      primary: '#fff',
      secondary: '#aaa',
    },
    primary: {
      main: "#9FD2DB",
    },
    secondary: {
      main: "#FC9E4F",
    },
  },
});