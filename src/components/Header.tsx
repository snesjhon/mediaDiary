import { AddIcon, HamburgerIcon, MoonIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useMDDispatch } from "../config/store";
import useIsBreakpoint from "../hooks/useIsBreakpoint";
import Filters from "./Filters";
import FiltersIcon from "./icons/FiltersIcon";
import MdLogo from "./md/MdLogo";
import Sidebar from "./sidebar/Sidebar";

function Header(): JSX.Element {
  const isMd = useIsBreakpoint("md");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    isOpen: menuIsOpen,
    onClose: menuOnClose,
    onOpen: menuOnOpen,
  } = useDisclosure();
  const dispatch = useMDDispatch();
  return (
    <>
      <Box
        as="header"
        pos="fixed"
        top="0"
        zIndex="1"
        bg={colorMode === "light" ? "white" : "gray.800"}
        left="0"
        right="0"
        borderBottomWidth="1px"
        width="full"
      >
        <Container maxWidth={{ base: "xl", md: "lg" }}>
          <Flex w="100%" h="100%" py={2} align="center" justify="space-between">
            <Flex align="center" pl={isMd ? 4 : undefined}>
              {!isMd && (
                <IconButton
                  aria-label="Menu"
                  icon={<HamburgerIcon />}
                  mr={3}
                  size="sm"
                  variant="outline"
                  onClick={onOpen}
                />
              )}
              <MdLogo title="mediaDiary" href="/home" />
            </Flex>
            <Flex maxW="720px" align="center">
              <HStack as="nav" spacing="2">
                <IconButton
                  onClick={toggleColorMode}
                  aria-label="Theme Switcher"
                  icon={<MoonIcon />}
                  size="sm"
                  variant="ghost"
                  isRound
                />
                {isMd ? (
                  <Button
                    leftIcon={<FiltersIcon />}
                    border="1px solid"
                    borderColor="gray.200"
                    size="sm"
                    onClick={menuOnOpen}
                  >
                    Filters
                  </Button>
                ) : (
                  <IconButton
                    aria-label="Menu"
                    icon={<FiltersIcon />}
                    size="sm"
                    variant="outline"
                    onClick={menuOnOpen}
                    isRound
                  />
                )}
              </HStack>
              {!isMd && (
                <IconButton
                  ml={3}
                  aria-label="Add"
                  icon={<AddIcon />}
                  size="sm"
                  colorScheme="purple"
                  onClick={() =>
                    dispatch({
                      type: "state",
                      payload: { key: "view", value: "search" },
                    })
                  }
                />
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
      {!isMd && <Sidebar isOpen={isOpen} onClose={onClose} />}
      <Filters isOpen={menuIsOpen} onClose={menuOnClose} />
    </>
  );
}

export default Header;
