import styled from "styled-components";
import Box, { BoxProps } from "./Box";
import { flexbox, FlexboxProps, compose } from "styled-system";

interface FlexProps extends BoxProps, FlexboxProps {}

const Flex = styled(Box)<FlexProps>`
  display: flex;
  ${compose(flexbox)}
`;

export default Flex;
