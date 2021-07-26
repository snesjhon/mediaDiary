import { MoonAltIcon } from "@/icons";
import { MdLogo } from "@/md";
import { useIsBreakpoint } from "@/utils";
import { AddIcon, HamburgerIcon, SearchIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  onOpen: () => void;
  searchString: string;
  handleSearch: (val: string) => void;
}
function ContentToolbar({
  handleSearch,
  onOpen,
  searchString,
}: Props): JSX.Element {
  const isMd = useIsBreakpoint("md");
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

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
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="purple.500" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search Your Media"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchString}
                    type="search"
                  />
                </InputGroup>
                <IconButton
                  onClick={toggleColorMode}
                  aria-label="Theme Switcher"
                  icon={
                    colorMode === "light" ? (
                      <MoonAltIcon color="purple.500" />
                    ) : (
                      <SunIcon />
                    )
                  }
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
                  onClick={() => router.push("/add")}
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
