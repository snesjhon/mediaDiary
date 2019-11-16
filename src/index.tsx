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
import { myTheme } from "./config/theme";
import { ThemeProvider } from "styled-components";
import { StoreProvider } from "./config/store";
import Main from "./Main";

import "./styles/reset.css";
import "./styles/github.css";
import "./styles/global.css";

ReactDOM.render(
  <StoreProvider>
    <ThemeProvider theme={myTheme}>
      <Main />
    </ThemeProvider>
  </StoreProvider>,
  document.querySelector("#app")
);
