import { useMDDispatch } from "@/config";
import { MdLogo } from "@/md";
import { useIsBreakpoint } from "@/utils";
import { AddIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";

function ContentToolbar({ onOpen }: { onOpen: () => void }): JSX.Element {
  const isMd = useIsBreakpoint("md");
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useMDDispatch();
  return (
    <>
      <Box
        as="header"
        pos="fixed"
        top="0"
        zIndex="2"
        bg={colorMode === "light" ? "white" : "gray.800"}
        left="0"
        right="0"
        borderBottomWidth="1px"
        width="full"
      >
        <Container maxWidth={{ md: "container.lg" }}>
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
              <HStack spacing="2">
                <IconButton
                  onClick={toggleColorMode}
                  aria-label="Theme Switcher"
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  size="sm"
                  variant="outline"
                />
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
    </>
  );
}

export default ContentToolbar;
