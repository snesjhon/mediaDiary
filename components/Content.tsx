/**
 * Content
 * ---
 * This has all of the interactive between each "view"
 */

import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useMDDispatch, useMDState } from "../config/store";
import { useIsBreakpoint } from "../utils/helpers";
import Day from "./Day";
import LogoIcon from "./Icons/LogoIcon";
import LayoutDrawer from "./Layouts/LayoutDrawer";
import Log from "./Log";
import Search from "./Search";

function Content(): JSX.Element {
  const { view } = useMDState();
  const dispatch = useMDDispatch();
  const refInput = useRef<HTMLInputElement>(null);
  const isMD = useIsBreakpoint("md");
  return (
    <>
      <Modal
        isOpen={view === "search"}
        onClose={() => dispatch({ type: "view", payload: "md" })}
        scrollBehavior="inside"
        size={isMD ? "xl" : "sm"}
        initialFocusRef={refInput}
      >
        <ModalOverlay sx={{ zIndex: 2 }}>
          <ModalContent maxHeight="50vh" my={{ base: 0, sm: "3.75rem" }}>
            <ModalCloseButton />
            <ModalHeader>
              <Flex alignItems="center">
                <LogoIcon boxSize={5} mr={1} />
                <Text
                  fontSize={{ base: "md", md: "xl" }}
                  color="purple.700"
                  fontWeight="medium"
                  cursor="pointer"
                >
                  mediaDiary
                </Text>
              </Flex>
            </ModalHeader>
            <ModalBody pt={0} pb={6}>
              {view === "search" && <Search refInput={refInput} />}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <LayoutDrawer
        isOpen={view === "log" || view === "day" || view === "edit"}
        placement={isMD ? "right" : "bottom"}
      >
        {view === "log" && <Log />}
        {(view === "day" || view === "edit") && <Day />}
      </LayoutDrawer>
    </>
  );
}

export default Content;
