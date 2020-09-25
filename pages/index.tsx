import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import LogoIcon from "../components/Icons/LogoIcon";
import Layout from "../components/Layout";
import useUser from "../utils/useUser";

function App() {
  const { user } = useUser();
  const router = useRouter();

  if (user) {
    router.push("/home");
    return null;
  } else {
    return (
      <>
        <Box as="header" bg="white" width="full">
          <Container maxWidth={{ base: "xl", md: "lg" }}>
            <Flex
              w="100%"
              h="100%"
              py={2}
              align="center"
              justify="space-between"
            >
              <Flex align="center">
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
                  colorScheme="purple"
                  variant="outline"
                  onClick={() =>
                    router.push("/?view=signin", "/auth/signin", {
                      shallow: true,
                    })
                  }
                >
                  Sign In
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Box>
        <Layout>
          <Box>
            <Heading>Keep track of your favorite Movies</Heading>
            <br />
            <Text fontSize="xl">
              MediaDiary is a media logging platform that helps you keep track
              of when you watched or listened to your favorite media.
            </Text>
            <Button
              colorScheme="purple"
              mt="24px"
              onClick={() => router.push("/?view=signup", "/auth/signup")}
            >
              Sign Up
            </Button>
          </Box>
        </Layout>
        {router.query.view === "signup" && (
          <Modal isOpen={true} onClose={() => router.push("/")}>
            <ModalOverlay>
              <ModalContent>
                <ModalCloseButton />
                <ModalHeader textAlign="center">
                  <LogoIcon boxSize={5} />
                </ModalHeader>
                <ModalBody>
                  <Heading size="md" mb={4}>
                    Create Your Account
                  </Heading>
                  <VStack align="stretch" spacing={4}>
                    <Button onClick={loginWithGoogle}>
                      Sign Up with Google
                    </Button>
                    <Button>Sign Up with Twitter</Button>
                  </VStack>
                  <br />
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        )}
        {router.query.view === "signin" && (
          <Modal isOpen={true} onClose={() => router.push("/")}>
            <ModalOverlay>
              <ModalContent>
                <ModalCloseButton />
                <ModalHeader textAlign="center">
                  <LogoIcon boxSize={5} />
                </ModalHeader>
                <ModalBody>
                  <Heading size="md" mb={4}>
                    Signin
                  </Heading>
                  <VStack align="stretch" spacing={4}>
                    <Button onClick={loginWithGoogle}>
                      Sign In with Google
                    </Button>
                    <Button>Sign In with Twitter</Button>
                  </VStack>
                  <br />
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        )}
      </>
    );
  }
  function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        Cookies.set("authPending", "true");
        firebase.auth().signInWithRedirect(provider);
      });
  }
}

export default App;
