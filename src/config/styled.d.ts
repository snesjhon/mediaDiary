// import original module declarations
import "styled-components";
import { Style } from "./types";

declare module "styled-components" {
  export interface DefaultTheme extends Style {}
}
