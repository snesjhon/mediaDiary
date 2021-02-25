import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useMDDispatch, useMDState } from "../../config/store";
import useIsBreakpoint from "../../utils/useIsBreakpoint";
import LayoutDrawer from "../layouts/LayoutDrawer";
import MdLogo from "../md/MdLogo";
import ContentDay from "./ContentDay";
import ContentInfo from "./ContentInfo";
import ContentLog from "./ContentLog";
import ContentSearch from "./ContentSearch";

function ContentController(): JSX.Element {
  const { view } = useMDState();
  const dispatch = useMDDispatch();
  const refInput = useRef<HTMLInputElement>(null);
  const isMD = useIsBreakpoint("md");
  return (
    <>
      <Modal
        isOpen={view === "search"}
        onClose={() => dispatch({ type: "dayClose" })}
        scrollBehavior="inside"
        size={isMD ? "xl" : "sm"}
        initialFocusRef={refInput}
      >
        <ModalOverlay sx={{ zIndex: 2 }}>
          <ModalContent maxHeight="50vh" my={{ base: 2, sm: "3.75rem" }}>
            <ModalCloseButton />
            <ModalHeader>
              <MdLogo title="Search" />
            </ModalHeader>
            <ModalBody pt={0} pb={6}>
              {view === "search" && <ContentSearch refInput={refInput} />}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <LayoutDrawer
        isOpen={
          view === "log" || view === "day" || view === "edit" || view === "info"
        }
        placement="right"
      >
        {view === "info" && <ContentInfo />}
        {view === "log" && <ContentLog />}
        {(view === "day" || view === "edit") && <ContentDay />}
      </LayoutDrawer>
    </>
  );
}

export default ContentController;
