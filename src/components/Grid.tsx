import styled from "styled-components";
import Box, { BoxProps } from "./Box";
import {
  grid,
  compose,
  alignItems,
  alignContent,
  justifyItems,
  justifyContent,
  GridProps,
  AlignItemsProps
} from "styled-system";

interface GridCmptProps extends BoxProps, GridProps, AlignItemsProps {
  gridItem?: boolean;
}

const Grid = styled(Box)<GridCmptProps>`
  display: ${props => (props.gridItem ? undefined : "grid")};
  ${compose(grid, alignItems, alignContent, justifyItems, justifyContent)}
`;

export default Grid;
