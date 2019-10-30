import React, { Children } from "react";
import ReactDOM from "react-dom";
import Box from "./Box";
import styled from "styled-components";

const DropdownContent = styled(Box)`
  display: ${props => (props.showDropdown ? "block" : "none")};
  position: absolute;
  right: 0;
  z-index: 300;
  top: 45px;
  box-shadow: 0 5px 20px 0 rgba(21, 27, 38, 0.08);
  border: 1px solid var(--border-primary);
  background-color: var(--bg-secondary);
  width: 100%;
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

const Portal = props => {
  return ReactDOM.createPortal(props.children, document.body);
};

const Dropdown = props => {
  const { showDropdown, setShowDropdown } = props;
  return (
    <>
      <DropdownContent showDropdown={showDropdown}>
        {Children.map(props.children, child => (
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
