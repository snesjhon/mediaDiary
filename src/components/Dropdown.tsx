import * as React from "react";
import * as ReactDOM from "react-dom";
import { Children } from "react";
import Box from "./Box";
import styled from "styled-components";

const DropdownContent = styled(({ showDropdown, extend, ...rest }) => (
  <Box {...rest} />
))`
  display: ${props => (props.showDropdown ? "block" : "none")};
  position: absolute;
  right: 0;
  z-index: 300;
  top: 45px;
  box-shadow: 0 5px 20px 0 rgba(21, 27, 38, 0.08);
  border: 1px solid var(--border-primary);
  background-color: var(--bg-secondary);
  width: ${props => (props.extend ? `calc(100% * ${props.extend})` : "100%")};
`;

const DropdownItem = styled(Box)`
  cursor: pointer;
  border-bottom: 1px solid var(--border-primary);
  &:last-child {
    border-bottom: transparent;
  }
  &:hover {
    cursor: pointer;
    color: var(--orange);
    background-color: var(--bg-secondary);
  }
`;

const DropdownClose = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 101;
  cursor: pointer;
`;

interface Portal {
  children: React.ReactNode;
}
const Portal = ({ children }: Portal) => {
  return ReactDOM.createPortal(children, document.body);
};

interface Dropdown {
  showDropdown: Boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  extend?: number;
}
const Dropdown = ({
  showDropdown,
  setShowDropdown,
  extend,
  children
}: Dropdown) => {
  return (
    <>
      <DropdownContent showDropdown={showDropdown} extend={extend}>
        {Children.map(children, child => (
          <DropdownItem>{child}</DropdownItem>
        ))}
      </DropdownContent>
      {showDropdown && (
        <Portal>
          <DropdownClose onClick={() => setShowDropdown(false)} />
        </Portal>
      )}
    </>
  );
};

export default Dropdown;
