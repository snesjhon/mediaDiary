import styled from "styled-components";
import Box from "./Box";
import { flexbox, compose } from "styled-system";

const Flex = styled(Box)`
  display: flex;
  ${compose(flexbox)}
`;

export default Flex;
