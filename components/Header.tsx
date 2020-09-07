import React from "react";
import {
  Flex,
  chakra,
  HStack,
  Link,
  Icon,
  IconButton,
  Heading,
  Box,
  Text,
} from "@chakra-ui/core";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import LogoIcon from "./Icons/LogoIcon";

function Header() {
  return (
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
      <Flex w="100%" h="100%" p={3} align="center" justify="space-between">
        <Flex align="center">
          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
            mr={3}
            size="sm"
            variant="outline"
          />
          <LogoIcon boxSize={5} mr={1} />
          <NextLink href="/" passHref>
            <Text fontSize="md" color="purple.700" fontWeight="medium">
              mediaDiary
            </Text>
          </NextLink>
          <HStack
            as="nav"
            spacing="4"
            ml="24px"
            display={{ base: "none", md: "flex" }}
          >
            <div>asd</div>
            <div>asd</div>
            <div>asd</div>
          </HStack>
        </Flex>

        <Flex maxW="720px" align="center" color="gray.400">
          <HStack spacing="5">
            <Link isExternal aria-label="GitHub" href="/">
              asd
            </Link>
            <Link isExternal aria-label="Discord" href="/">
              asd
            </Link>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Header;
