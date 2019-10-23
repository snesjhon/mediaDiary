import Box from "./Box";
import styled from "styled-components";
import { border, system, variant } from "styled-system";

const Button = styled(Box)`
  appearance: none;
  display: inline-block;
  text-align: center;
  line-height: inherit;
  text-decoration: none;
  vertical-align: middle;
  &:hover {
    cursor: pointer;
    ${system({
      hoverColor: {
        property: "color"
      },
      hoverBg: {
        property: "background-color"
      }
    })}
  }
  ${border}
  ${variant({
    variants: {
      primary: {
        color: "bg-primary",
        bg: "primary",
        px: 4,
        py: 2,
        borderRadius: 3
      }
    }
  })}
`;

export default Button;
