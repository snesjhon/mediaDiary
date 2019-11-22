import { DefaultTheme } from "styled-components";
import { Style } from "./types";

const myTheme: DefaultTheme & Style = {
  colors: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    orange: "var(--orange)",
    blue: "var(--blue)",
    "bg-primary": "var(--bg-primary)",
    "bg-secondary": "var(--bg-secondary)",
    "border-primary": "var(--border-primary)",
    "border-secondary": "var(--border-secondary)"
  }
};

export { myTheme };
