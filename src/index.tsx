/*
 * ENTRY
 * ---
 * The entry point at which we direct webpack into our codebase.
 * Look at Main.jsx to see how we layout the routes and views.
 *
 * We have to include styles before the app starts so we can keep order
 */

import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@material-ui/core/styles";
import { StoreProvider } from "easy-peasy";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { store } from "./config/store";
import theme from "./config/theme";
import Main from "./Main";

let themeObj = createMuiTheme(theme);
themeObj = responsiveFontSizes(themeObj);

ReactDOM.render(
  <StoreProvider store={store}>
    <ThemeProvider theme={themeObj}>
      <CssBaseline />
      <Main />
    </ThemeProvider>
  </StoreProvider>,
  document.querySelector("#app")
);
