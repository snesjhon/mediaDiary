import Box, { BoxProps } from "./Box";
import styled from "styled-components";
import { border, system, variant, BorderProps } from "styled-system";

interface ButtonProps extends BoxProps, BorderProps {
  hoverColor?: string;
  hoverBg?: string;
  variant?: "primary" | "secondary" | "image";
}

const Button = styled(Box)<ButtonProps>`
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
        property: "backgroundColor"
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
      },
      secondary: {
        color: "bg-secondary",
        bg: "secondary",
        px: 4,
        py: 2,
        borderRadius: 3
      },
      image: {
        bg: "tranparent",
        "& > img": {
          borderRadius: "50%"
        }
      }
    }
  })}
`;

export default Button;
