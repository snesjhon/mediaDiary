import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";
function LayoutModal({ children }: PropsWithChildren<{}>) {
  const router = useRouter();
  return (
    <Modal
      isOpen={true}
      onClose={() => router.push("/home")}
      scrollBehavior="inside"
      size="full"
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
