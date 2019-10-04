import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./config/theme";
import { ThemeProvider } from "styled-components";

import "../node_modules/github-markdown-css/github-markdown.css";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
