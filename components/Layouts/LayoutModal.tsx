import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

function LayoutModal({ children }: PropsWithChildren<unknown>): JSX.Element {
  const router = useRouter();
  return (
    <Modal
      isOpen={true}
      onClose={() => router.push("/home")}
      scrollBehavior="inside"
      size="sm"
      trapFocus={false}
    >
      <ModalOverlay px={4} sx={{ zIndex: 2 }}>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pt={6}>{children}</ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export default LayoutModal;
