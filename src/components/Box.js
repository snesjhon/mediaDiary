import styled from "styled-components";
import {
  space,
  color,
  typography,
  layout,
  border,
  compose,
  system,
  position
} from "styled-system";

const Box = styled.div`
  ${system({
    cursor: {
      property: "cursor"
    }
  })}
  ${compose(
    space,
    color,
    typography,
    layout,
    border,
    position
  )}
`;

export default Box;
