// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      orange: string;
      blue: string;
      "bg-primary": string;
      "bg-secondary": string;
      "border-primary": string;
      "border-secondary": string;
    };
  }
}
