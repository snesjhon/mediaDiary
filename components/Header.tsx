import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/core";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import LogoIcon from "./Icons/LogoIcon";

function Header() {
  const router = useRouter();
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
      <Container maxWidth={{ base: "xl", md: "lg" }}>
        <Flex w="100%" h="100%" py={2} align="center" justify="space-between">
          <Flex align="center">
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              mr={3}
              size="sm"
              variant="outline"
            />
            <LogoIcon boxSize={5} mr={1} />
            <Link href="/" passHref>
              <Text fontSize="md" color="purple.700" fontWeight="medium">
                mediaDiary
              </Text>
            </Link>
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

          <Flex maxW="720px" align="center">
            <Button
              size="sm"
              rightIcon={<AddIcon boxSize={2} />}
              colorScheme="purple"
              onClick={() =>
                router.push("/?search=true", "/search", { shallow: true })
              }
            >
              Add Media
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Header;
