import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Box from "./Box";

const Overlay = styled(Box)`
  display: ${props => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 25;
  opacity: 0.5;
  background-color: ${props => props.theme.colors["bg-primary"]};
`;

const Presentation = styled(Box)`
  display: ${props => (props.isOpen ? "flex" : "none")};
  flex-direction: ${props => (props.isOpen ? "column" : "")};
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: ${props => props.theme.colors["bg-primary"]};
  border: 1px solid #d1d5da;
  border-radius: 3px;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.05);
`;

const Portal = props => {
  return ReactDOM.createPortal(props.children, document.body);
};

const Modal = props => {
  const { children, isOpen, handleClose, ...rest } = props;

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => (document.documentElement.style.overflow = "");
  });

  return (
    <Portal>
      <Overlay isOpen={isOpen} onClick={handleClose} />
      <Presentation
        isOpen={isOpen}
        p={4}
        width={["3vw", "10vw", "45vw"]}
        {...rest}
      >
        {children}
      </Presentation>
    </Portal>
  );
};

export default Modal;
