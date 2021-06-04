import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import MdLogo from "../md/MdLogo";

export default function LayoutHeader(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
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
      <Container maxWidth={{ md: "container.lg" }}>
        <Flex w="100%" h="100%" py={2} align="center" justify="space-between">
          <Flex align="center">
            <MdLogo title="mediaDiary" href="/" />
          </Flex>
          <Flex maxW="720px" align="center">
            <HStack spacing={{ base: 0, sm: 3 }}>
              <IconButton
                onClick={toggleColorMode}
                aria-label="Theme Switcher"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                variant="ghost"
              />
              <Button
                colorScheme="purple"
                variant="ghost"
                onClick={() => router.push("/register?type=login")}
              >
                Login
              </Button>
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={() => router.push("/register?type=signup")}
              >
                Sign Up
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
