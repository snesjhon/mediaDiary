import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect } from "react";
import styled from "styled-components";
import Box from "./Box";

const Overlay = styled(({ isOpen, ...rest }) => <Box {...rest} />)`
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

const Presentation = styled(({ isOpen, ...rest }) => <Box {...rest} />)`
  display: ${props => (props.isOpen ? "flex" : "none")};
  flex-direction: ${props => (props.isOpen ? "column" : "")};
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: ${props => props.theme.colors["bg-primary"]};
  border: 1px solid #d1d5da;
  border-radius: 3px;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
`;

interface Portal {
  children: React.ReactNode;
}

const Portal = (props: Portal) => {
  return ReactDOM.createPortal(props.children, document.body);
};

interface Modal extends React.HTMLAttributes<HTMLElement> {
  isOpen: Boolean;
  handleClose: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  extend?: number;
}

const Modal = ({ children, isOpen, handleClose, ...rest }: Modal) => {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  });

  return (
    <Portal>
      <Overlay isOpen={isOpen} onClick={handleClose} />
      <Presentation
        isOpen={isOpen}
        p={4}
        width={[1, "10vw", "45vw"]}
        maxHeight={["90vh", "40vh"]}
        top={["5vh", "30%"]}
        {...rest}
      >
        {children}
      </Presentation>
    </Portal>
  );
};

export default Modal;
