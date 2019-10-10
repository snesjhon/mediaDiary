import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./config/theme";
import { ThemeProvider } from "styled-components";
import { StoreProvider } from "./config/store";

import "../node_modules/github-markdown-css/github-markdown.css";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => (props.bg ? props.bg : "black")};
  }
  .markdown-body  {
    color: primary !important; // Nooo
  }
`;

ReactDOM.render(
  <StoreProvider>
    <ThemeProvider theme={theme}>
      <GlobalStyle bg="white" />
      <App />
    </ThemeProvider>
  </StoreProvider>,
  document.getElementById("root")
);
