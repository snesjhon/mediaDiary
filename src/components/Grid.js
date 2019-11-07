import styled from "styled-components";
import Box from "./Box";
import {
  grid,
  compose,
  alignItems,
  alignContent,
  justifyItems,
  justifyContent
} from "styled-system";

const Grid = styled(Box)`
  display: ${props => (props.gridItem ? undefined : "grid")};
  ${compose(
    grid,
    alignItems,
    alignContent,
    justifyItems,
    justifyContent
  )}
`;

export default Grid;
