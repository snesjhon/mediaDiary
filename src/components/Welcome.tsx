import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  keyframes,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { setCookie } from "nookies";
import React, { useState } from "react";
import fuego from "../fuego/fuego";
import ActivityIcon from "./icons/ActivityIcon";
import BookmarkIcon from "./icons/BookmarkIcon";
import LogoIcon from "./icons/LogoIcon";
import Layout from "./layouts/Layout";
import MdLogo from "./md/MdLogo";

const fade = keyframes`
     0%,50% {
      opacity: 0;
}
    100%{
      opacity: 1;
  }
`;

interface FeaturesObj {
  [key: string]: {
    title: string;
    description: string;
    image: string;
  };
}
const features: FeaturesObj = {
  diary: {
    title: "Diary",
    description:
      "mediaDiary revolves around your media. Both positive and negative. Add a diary.",
    image: "something",
  },
  analyze: {
    title: "Analyze",
    description:
      "The more you record the better your stats get. Over the year or years. Your data drives these charts. Find out what works for you.",
    image: "something ",
  },
  bookmarks: {
    title: "bookmarks",
    description:
      "The more you record the better your stats get. Over the year or years. Your data drives these charts. Find out what works for you.",
    image: "something ",
  },
  memories: {
    title: "memories",
    description:
      "The more you record the better your stats get. Over the year or years. Your data drives these charts. Find out what works for you.",
    image: "something ",
  },
};

function Welcome(): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const [active, setActive] = useState<keyof typeof features>("diary");
  const { colorMode, toggleColorMode } = useColorMode();

  const mdPurple = useColorModeValue("purple.700", "purple.200");
  return (
    <>
      <Layout>
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
          <Container maxWidth={{ base: "xl", md: "lg" }}>
            <Flex
              w="100%"
              h="100%"
              py={2}
              align="center"
              justify="space-between"
            >
              <Flex align="center">
                <MdLogo title="mediaDiary" href="/" />
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
              </Flex>
            </Flex>
          </Container>
        </Box>
        <Box my={{ base: 20 }}>
          <Grid
            display={{ base: "flex", lg: "grid" }}
            flexDirection={{ base: "column-reverse", lg: "initial" }}
            gridTemplateColumns={{ lg: "1fr 0.8fr" }}
            gridGap={{ lg: "7rem" }}
          >
            <Flex flexDir="column" justifyContent="center" mt={10}>
              <Heading pos="relative">
                Remember when you
                <Box as="span" pl={2}>
                  <Text
                    as="span"
                    position="absolute"
                    color="purple.500"
                    animation={`${fade} 3s alternate-reverse infinite`}
                  >
                    watched
                  </Text>
                  <Text
                    as="span"
                    color="purple.500"
                    animation={`${fade} 3s alternate infinite`}
                  >
                    heard
                  </Text>
                </Box>
                <br />
                <Text>your favorite media?</Text>
              </Heading>
              <Text fontSize="xl" my={3}>
                mediaDiary is a logging platform that helps you keep track of
                <Text as="span" fontWeight="bold">
                  {" "}
                  ALL{" "}
                </Text>
                your favorite media.
              </Text>
              <Box>
                <Button
                  colorScheme="purple"
                  mt="24px"
                  onClick={() => setShowModal(true)}
                >
                  Create an Account
                </Button>
              </Box>
            </Flex>
            <Flex justifyContent="center">
              <Image
                w={{ base: "1rem", sm: "20rem", lg: "100%" }}
                src="/home_d.png"
              />
            </Flex>
          </Grid>
        </Box>
        <Divider my={10} />
        <Center>
          <Heading size="md">mediaDiary is much simpler to use</Heading>
        </Center>
        <Grid gridTemplateColumns="1fr 1fr" gridGap="7rem" pt={20} pb={10}>
          <Box>
            <Heading size="lg">Track Everything</Heading>
            <Text>
              Are you tired of only being able to track a single piece of media?{" "}
            </Text>
          </Box>
          <Box>
            <Image src="/welcome1.png" />
          </Box>
        </Grid>
        <Divider my={10} />
        <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap={7}>
          <Box>
            <ActivityIcon boxSize={8} />
            <Text fontSize="lg" color="purple.500" fontWeight="bold">
              Analytics
            </Text>
            <Text>
              A complete overview of all of your media as you start adding and
              viewing data
            </Text>
          </Box>
          <Box>
            <BookmarkIcon boxSize={8} />
            <Text fontSize="lg" color="purple.500" fontWeight="bold" py={3}>
              Bookmarks
            </Text>
            <Text>
              A complete overview of all of your media as you start adding and
              viewing data
            </Text>
          </Box>
          <Box>
            <SunIcon boxSize={8} />
            <Text fontSize="lg" color="purple.500" fontWeight="bold">
              Dark Mode
            </Text>
            <Text>
              A complete overview of all of your media as you start adding and
              viewing data
            </Text>
          </Box>
        </Grid>
        <Divider my={10} />
        <Center>
          <Box textAlign="center">
            <Heading>Mobile Ready</Heading>
            <Text py={10} color="gray.500">
              The mediaDiary app is a Progressive Web App, so youll be able to
              install it on any OS
            </Text>
          </Box>
        </Center>
        <Grid gridTemplateColumns="1fr 1fr" bg="gray.200" py={20}>
          <div>asd</div>
          <Box>
            {Object.keys(features).map((e, i) => {
              const { title, description } = features[e];
              const current = active === e;
              return (
                <Box
                  key={title + i}
                  borderLeft={current ? "5px solid" : undefined}
                  borderColor={current ? "gray.600" : undefined}
                  p={4}
                >
                  <Heading
                    size="lg"
                    color={current ? "black" : "gray.400"}
                    onClick={() => (current ? {} : setActive(e))}
                  >
                    {title}
                  </Heading>
                  {current && <Text color="gray.500">{description}</Text>}
                </Box>
              );
            })}
          </Box>
        </Grid>
        <Grid gridTemplateColumns="1fr 1fr " py={20}>
          <Flex align="center">
            <LogoIcon boxSize={8} mr={1} color={mdPurple} />
            <Text
              fontSize={{ base: "md", md: "2xl" }}
              color={mdPurple}
              fontWeight="medium"
            >
              mediaDiary
            </Text>
          </Flex>
          <HStack spacing={8}>
            <Text>2021 RedOak Studios</Text>
            <Text>Privacy Policy</Text>
          </HStack>
        </Grid>
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
export default Welcome;
