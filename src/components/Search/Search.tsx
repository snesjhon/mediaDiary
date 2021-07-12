import { useMDDispatch, useMDState } from "@/config";
import useIsBreakpoint from "@/utils/useIsBreakpoint";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import MdLogo from "../md/MdLogo";
import { SearchContent } from "./components";

export default function Search(): JSX.Element {
  const refInput = useRef<HTMLInputElement>(null);
  const dispatch = useMDDispatch();
  const { view } = useMDState();
  const isMd = useIsBreakpoint("md");
  return (
    <Modal
      isOpen={view === "search"}
      onClose={() => dispatch({ type: "close" })}
      scrollBehavior="inside"
      size={isMd ? "xl" : "sm"}
      initialFocusRef={refInput}
    >
      <ModalOverlay sx={{ zIndex: 2 }}>
        <ModalContent maxHeight="50vh" my={{ base: 2, sm: "3.75rem" }}>
          <ModalCloseButton />
          <ModalHeader>
            <MdLogo title="Search" />
          </ModalHeader>
          <ModalBody pt={0} pb={6}>
            {view === "search" && <SearchContent refInput={refInput} />}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
