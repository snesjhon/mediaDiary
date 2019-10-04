import styled from "styled-components";
import Box from "./Box";
import { grid, compose } from "styled-system";

const Grid = styled(Box)`
  display: ${props => (props.gridItem ? undefined : "grid")};
  ${compose(grid)}
`;

export default Grid;
