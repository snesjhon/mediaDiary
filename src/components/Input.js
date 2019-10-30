import React, { forwardRef } from "react";
import Box from "./Box";
import styled from "styled-components";

const InputWrapper = styled(Box)`
  display: block;
  width: 100%;
  appearance: none;
  font-size: inherit;
  line-height: inherit;
  border: 1px solid var(--border-primary);
  background-color: transparent;
  outline: none;
`;

const Input = forwardRef((props, ref) => (
  <InputWrapper
    ref={ref}
    as="input"
    px={3}
    py={2}
    type={props.type ? props.type : "text"}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
