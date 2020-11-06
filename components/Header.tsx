import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Filters from "./Filters";
import FiltersIcon from "./Icons/FiltersIcon";
import LogoIcon from "./Icons/LogoIcon";
import Sidebar from "./Sidebar";

function Header(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: menuIsOpen,
    onClose: menuOnClose,
    onOpen: menuOnOpen,
  } = useDisclosure();
  const router = useRouter();
  return (
    <>
      <Box
        as="header"
        pos="fixed"
        top="0"
        zIndex="1"
        bg="white"
        left="0"
        right="0"
        borderBottomWidth="1px"
        width="full"
      >
        <Container maxWidth={{ base: "xl", md: "lg" }}>
          <Flex w="100%" h="100%" py={2} align="center" justify="space-between">
            <Flex align="center">
              <IconButton
                aria-label="Menu"
                icon={<HamburgerIcon />}
                mr={3}
                size="sm"
                variant="outline"
                onClick={onOpen}
              />
              <LogoIcon boxSize={5} mr={1} />
              <Link href="/home">
                <Text
                  fontSize={{ base: "md", md: "xl" }}
                  color="purple.700"
                  fontWeight="medium"
                  cursor="pointer"
                >
                  mediaDiary
                </Text>
              </Link>
            </Flex>
            <Flex maxW="720px" align="center">
              <HStack as="nav" spacing="2" mr={3}>
                <IconButton
                  aria-label="Menu"
                  icon={<FiltersIcon />}
                  size="sm"
                  variant="outline"
                  onClick={menuOnOpen}
                  isRound
                />
              </HStack>
              <IconButton
                aria-label="Add"
                icon={<AddIcon />}
                size="sm"
                colorScheme="purple"
                onClick={() =>
                  router.push("/home/?search=true", "/search", {
                    shallow: true,
                  })
                }
              />
            </Flex>
          </Flex>
        </Container>
      </Box>
      {isOpen && <Sidebar isOpen={isOpen} onClose={onClose} />}
      <Filters isOpen={menuIsOpen} onClose={menuOnClose} />
    </>
  );
}

export default Header;
