import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./config/theme";
import { ThemeProvider } from "styled-components";
import { StoreProvider } from "./config/store";

import "./styles/reset.css";
import "./styles/github.css";
import "./styles/global.css";

ReactDOM.render(
  <StoreProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StoreProvider>,
  document.getElementById("root")
);

// const GlobalStyle = createGlobalStyle`
//   body {
//     background-color: ${props => (props.bg ? props.bg : "black")};
//   }
//   .markdown-body  {
//     color: primary !important; // Nooo
//   }
// `;
// <GlobalStyle bg="white" />
// import { createGlobalStyle } from "styled-components";
