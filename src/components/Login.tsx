import { Box, Button, Heading, Square, Text, VStack } from "@chakra-ui/react";
import { setCookie } from "nookies";
import React from "react";
import fuego from "../fuego/fuego";

function Login(): JSX.Element {
  return (
    <Square h="100vh" w="100vw">
      <Box p="10" border="1px solid" borderColor="gray.500" borderRadius="md">
        <Box mb={10}>
          <Heading size="md" mb={2}>
            Sign in to mediaDiary
          </Heading>
          <Text size="sm" color="gray.500" fontSize="sm">
            Get a free account, no credit card required
          </Text>
        </Box>
        <VStack align="stretch" spacing={4}>
          <Button onClick={login} variant="outline">
            Sign In with Google
          </Button>
          <Button variant="outline">Sign In with Twitter</Button>
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
    </Square>
  );

  function login() {
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

export default Login;
