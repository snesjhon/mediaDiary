import type { ModalProps } from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import React from "react";
import MdLogo from "../md/MdLogo";

function LayoutModal({
  children,
  onClose,
  isOpen,
  size,
  title,
}: PropsWithChildren<unknown> & {
  onClose: ModalProps["onClose"];
  isOpen: ModalProps["isOpen"];
  size: ModalProps["size"];
  title: string;
}): JSX.Element {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size={size}
      trapFocus={false}
    >
      <ModalOverlay sx={{ zIndex: 2 }}>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <MdLogo title={title} />
          </ModalHeader>
          <ModalBody pt={0} pb={6}>
            {children}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export default LayoutModal;
