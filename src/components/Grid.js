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
import t from "prop-types";

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

Grid.propTypes = {
  gridGap: t.string,
  gridRowGap: t.string,
  gridColumnGap: t.string,
  gridColumn: t.string,
  gridRow: t.string,
  gridArea: t.string,
  gridAutoFlow: t.string,
  gridAutoRows: t.string,
  gridAutoColumns: t.string,
  gridTemplateRows: t.string,
  gridTemplateColumns: t.string,
  gridTemplateAreas: t.string
};

export default Grid;
