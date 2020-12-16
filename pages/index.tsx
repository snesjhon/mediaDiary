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
} from "@chakra-ui/react";
import "firebase/auth";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { useEffect, useState } from "react";
import LogoIcon from "../src/components/icons/LogoIcon";
import Layout from "../src/components/layouts/Layout";
import MdLoader from "../src/components/md/MdLoader";
import useLogin from "../src/hooks/useLogin";
import fuego from "../src/interfaces/fuego";
import fuegoAdmin from "../src/interfaces/fuegoAdmin";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  // If token present then redirect
  try {
    const token = await fuegoAdmin.auth().verifyIdToken(cookies.fuegoToken);
    if (token) {
      return {
        redirect: {
          permanent: false,
          destination: "/home",
        },
      };
    }
  } catch {
    if (cookies.fuegoPending) {
      return {
        props: {
          fuegoPending: cookies.fuegoPending,
        },
      };
    }
  }
  return {
    props: {
      fuegoPending: false,
    },
  };
};

function App({
  fuegoPending,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const login = useLogin();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (fuegoPending) {
      destroyCookie(undefined, "fuegoPending");
      fuego
        .auth()
        .getRedirectResult()
        .then(async ({ user }) => {
          if (user !== null) {
            const value = await user.getIdToken();
            setCookie(null, "fuegoToken", value, {
              maxAge: 24 * 60 * 60,
              path: "/",
            });
            router.push("/home");
          }
        });
    }
  }, [fuegoPending, router]);

  if (fuegoPending) {
    return <MdLoader />;
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
                  onClick={() => setShowModal(true)}
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
              onClick={() => setShowModal(true)}
            >
              Sign Up
            </Button>
          </Box>
        </Layout>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
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
                  <Button onClick={login}>Sign In with Google</Button>
                  <Button>Sign In with Twitter</Button>
                </VStack>
                <br />
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </>
    );
  }
}

export default App;
