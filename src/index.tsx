/*
 * ENTRY
 * ---
 * The entry point at which we direct webpack into our codebase.
 * Look at Main.jsx to see how we layout the routes and views.
 *
 * We have to include styles before the app starts so we can keep order
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
// import { myTheme } from "./config/theme";
// import { ThemeProvider } from "styled-components";
import { StoreProvider } from "easy-peasy";
import { store } from "./config/store";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Main from "./Main";

// import "./styles/reset.css";
// import "./styles/global.css";
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#85D7FF",
      main: "#03b021",
      dark: "#009EEB"
    },
    secondary: {
      light: "#29EB7F",
      main: "#ff8001",
      dark: "#13CE66"
    },
    text: {
      primary: "#445567"
      // secondary: "#2d3440"
    }
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    fontWeightRegular: 400
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 800,
      lg: 1280,
      xl: 1920
    }
  }
});

ReactDOM.render(
  <StoreProvider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Main />
    </ThemeProvider>
  </StoreProvider>,
  document.querySelector("#app")
);
