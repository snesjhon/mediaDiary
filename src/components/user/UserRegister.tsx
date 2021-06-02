import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { setCookie } from "nookies";
import Link from "next/link";
import React from "react";
import fuego from "../../fuego/fuego";
import GoogleIcon from "../icons/GoogleIcon";
import LogoIcon from "../icons/LogoIcon";

interface Props {
  type: "login" | "signup";
}

export default function UserRegister({ type }: Props): JSX.Element {
  const mdPurple = useColorModeValue("purple.700", "purple.200");
  const typeText = type === "login" ? "Login in" : "Sign Up";
  return (
    <Box
      p="10"
      border="1px solid"
      borderColor="gray.500"
      borderRadius="md"
      bg="white"
    >
      <Box mb={10}>
        <Flex align="center" justifyContent="center">
          <LogoIcon boxSize={6} mr={1} color={mdPurple} />
          <Link href="/">
            <Text
              fontSize={{ base: "md", md: "2xl" }}
              color={mdPurple}
              fontWeight="medium"
              cursor="pointer"
            >
              mediaDiary
            </Text>
          </Link>
        </Flex>
      </Box>
      <VStack align="stretch" spacing={4}>
        <Button
          onClick={handleLogin}
          variant="outline"
          leftIcon={<GoogleIcon />}
        >
          {typeText} with Google
        </Button>
      </VStack>
      <Box textAlign="center" mt={10}>
        <Text fontSize="xs" color="gray.400">
          By continuing, you agree to mediaDiary
        </Text>
        <Text fontSize="xs" color="gray.400">
          Terms of Service, Privacy Policy
        </Text>
      </Box>
    </Box>
  );

  function handleLogin() {
    const provider = new fuego.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    fuego
      .auth()
      .setPersistence(fuego.auth.Auth.Persistence.LOCAL)
      .then(() => {
        setCookie(null, "fuegoPending", "true", {});
        fuego.auth().signInWithRedirect(provider);
      });
  }
}
