import styled from "styled-components";
import {
  system,
  compose,
  typography,
  TypographyProps,
  AlignItemsProps
} from "styled-system";
import Box, { BoxProps } from "./Box";

interface TextProps extends BoxProps, TypographyProps, AlignItemsProps {
  textTransform?: string;
}

const Text = styled(Box)<TextProps>`
  ${system({
    textTransform: {
      property: "textTransform"
    }
  })}
  ${compose(typography)}
`;

export default Text;
