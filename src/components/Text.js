import styled from "styled-components";
import {
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
  system,
  compose
} from "styled-system";
import Box from "./Box";

const Text = styled(Box)`
  ${system({
    textTransform: {
      property: "text-transform"
    }
  })}
  ${compose(
    fontFamily,
    fontWeight,
    textAlign,
    lineHeight,
    letterSpacing
  )}
`;

export default Text;
