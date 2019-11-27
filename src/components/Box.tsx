import styled from "styled-components";
import {
  space,
  color,
  typography,
  layout,
  border,
  compose,
  system,
  position,
  SpaceProps,
  ColorProps,
  TypographyProps,
  LayoutProps,
  BorderProps,
  PositionProps
} from "styled-system";

export interface BoxProps
  extends SpaceProps,
    ColorProps,
    TypographyProps,
    LayoutProps,
    BorderProps,
    PositionProps {
  cursor?: string;
  color?:
    | string
    | "primary"
    | "secondary"
    | "orange"
    | "blue"
    | "bg-primary"
    | "bg-secondary"
    | "border-primary"
    | "border-secondary";
}

const Box = styled.div<BoxProps>`
  ${system({
    cursor: {
      property: "cursor"
    }
  })}
  ${compose(space, color, typography, layout, border, position)}
`;

export default Box;