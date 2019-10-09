import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Box from "./Box";

const Overlay = styled(Box)`
  display: ${props => (props.isOpen ? "block" : "none")};
  position: fixed;
  padding-top: 50px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 25;
  opacity: 0.5;
  background-color:  ${props => props.theme.colors.borderGray};
`;

const Presentation = styled(Box)`
  display: ${props => (props.isOpen ? "flex" : "none")};
  flex-direction: ${props => (props.isOpen ? "column" : "")};
  position: fixed;
  top: 50%;
  left: 50%;
  /* transform: ${props =>
    (props.typeProp && "translateX(-50%)") || "translate(-50%, -50%)"}; */
    transform: translateX(-50%);
  width: auto;
  border-radius: 1.12em;
  z-index: 50;
  background: ${props => props.theme.bg.primary};
  color: gray;
  border: 1px solid ${props => props.theme.colors.borderGray};
  box-shadow:  0px 0px 5px 5px rgba(0, 0, 0, 0.05);
`;

const Portal = props => {
  return ReactDOM.createPortal(props.children, document.body);
};

const Modal = props => {
  const { children, isOpen, handleClose } = props;
  return (
    <Portal>
      <Overlay isOpen={isOpen} onClick={handleClose}/>
      <Presentation isOpen={isOpen}>{children}</Presentation>
    </Portal>
  );
};

export default Modal;
