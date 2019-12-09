/**
 * INPUT COMPONENT
 * ---
 * A simple input component
 *
 * Resources
 * - https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315
 */

import * as React from "react";
import { forwardRef } from "react";
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
  color: var(--text-primary);
`;

type InputProps = {
  type?: string;
  placeholder?: string;
  defaultValue?: string | number | string[] | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type InputRef = HTMLInputElement;

const Input = forwardRef<InputRef, InputProps>((props, ref) => (
  <InputWrapper
    ref={ref}
    as="input"
    px={3}
    py={2}
    type={props.type ? props.type : "text"}
    defaultValue={props.defaultValue && props.defaultValue}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
