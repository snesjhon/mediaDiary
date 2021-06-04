import { ExternalLinkIcon, SunIcon } from "@chakra-ui/icons";
import type { IconProps } from "@chakra-ui/react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  keyframes,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ComponentType } from "react";
import React, { useState } from "react";
import useIsBreakpoint from "../utils/useIsBreakpoint";
import ActivityIcon from "./icons/ActivityIcon";
import AlbumIcon from "./icons/AlbumIcon";
import BookmarkIcon from "./icons/BookmarkIcon";
import FilmIcon from "./icons/FilmIcon";
import TvIcon from "./icons/TvIcon";
import Layout from "./layouts/Layout";
import LayoutFooter from "./layouts/LayoutFooter";
import LayoutHeader from "./layouts/LayoutHeader";

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
    title: "Bookmarks",
    description:
      "The more you record the better your stats get. Over the year or years. Your data drives these charts. Find out what works for you.",
    image: "something ",
  },
  memories: {
    title: "Mobile",
    description:
      "The more you record the better your stats get. Over the year or years. Your data drives these charts. Find out what works for you.",
    image: "something ",
  },
};

function Welcome(): JSX.Element {
  const [active, setActive] = useState<keyof typeof features>("diary");
  const { colorMode } = useColorMode();
  const router = useRouter();

  const mdPurple = useColorModeValue("purple.700", "purple.200");
  const isMd = useIsBreakpoint("md");

  return (
    <Layout>
      <LayoutHeader />
      <Box my={{ base: 20 }}>
        <Grid
          display={{ base: "flex", lg: "grid" }}
          flexDirection={{ base: "column-reverse", lg: "initial" }}
          gridTemplateColumns={{ lg: "1fr 0.8fr" }}
          gridGap={{ lg: "7rem" }}
        >
          <Flex flexDir="column" justifyContent="center" mt={10}>
            <Heading pos="relative" size={isMd ? undefined : "lg"}>
              <Text display="flex">
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
              </Text>
              <Text>your favorite media?</Text>
            </Heading>
            <Text fontSize={{ base: "md", sm: "xl" }} my={3}>
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
                onClick={() => router.push("/register?type=signup")}
              >
                Create an Account
              </Button>
            </Box>
          </Flex>
          <Flex justifyContent="center">
            <Image
              w={{ base: "15rem", sm: "20rem", lg: "100%" }}
              src={colorMode === "light" ? "/home_w.png" : "/home_d.png"}
            />
          </Flex>
        </Grid>
      </Box>
      <Divider mt={10} />
      <Grid
        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
        gridGap={{ base: "2rem", sm: "7rem" }}
        pt={10}
        pb={10}
        alignItems="center"
      >
        <Box>
          <Heading size={isMd ? undefined : "lg"} mb={3}>
            Track Everything
          </Heading>
          <Text>
            Are you tired of only being able to track a single piece of media?{" "}
            Start tracking any of these with mediaDiary:
          </Text>
          <Box pt={5}>
            <Flex alignItems="center">
              <FilmIcon boxSize={4} color={mdPurple} />
              <Text ml={3} fontWeight="semibold">
                Movies
              </Text>
            </Flex>
            <Flex alignItems="center" py={2}>
              <TvIcon boxSize={4} color={mdPurple} />
              <Text ml={3} fontWeight="semibold">
                TV
              </Text>
            </Flex>
            <Flex alignItems="center">
              <AlbumIcon boxSize={4} color={mdPurple} />
              <Text ml={3} fontWeight="semibold">
                Albums
              </Text>
            </Flex>
            <Flex alignItems="center" py={2}>
              <FilmIcon boxSize={4} color={mdPurple} />
              <Text ml={3} fontWeight="semibold">
                More to come...
              </Text>
            </Flex>
          </Box>
        </Box>
        <Box>
          <Image src="/welcome1.png" />
        </Box>
      </Grid>
      <Divider my={10} />
      <Grid
        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }}
        gridGap={7}
      >
        <WelcomeItem
          Icon={ActivityIcon}
          title="Analytics"
          content="A complete overview of all of your media as you start adding and viewing data"
        />
        <WelcomeItem
          Icon={BookmarkIcon}
          title="Bookmarks"
          content="A complete overview of all of your media as you start adding and viewing data"
        />
        <WelcomeItem
          Icon={SunIcon}
          title="Dark Mode"
          content="A complete overview of all of your media as you start adding and viewing data"
        />
      </Grid>
      <Divider my={10} />
      <Grid
        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
        bg="gray.200"
        py={10}
        mt={10}
      >
        <Image src="https://via.placeholder.com/500x600" />
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
                _hover={{ cursor: "pointer" }}
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
      <Divider my={10} />
      <Box my={20}>
        <Center>
          <Heading size={isMd ? undefined : "lg"}>
            mediaDiary is open-source
          </Heading>
        </Center>
        <Flex
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          pt={3}
        >
          <Text fontSize={{ md: "2xl" }} color="gray.500">
            mediaDiary is all open-source. You can contribute to its{" "}
            {isMd ? <Spacer as="span" display="block" /> : undefined}
            development, thoughts and ideas are welcomed.
          </Text>
          <Box pt={12}>
            <Button
              as="a"
              colorScheme="purple"
              href="https://github.com/snesjhon/mediaDiary"
              target="_blank"
              rightIcon={<ExternalLinkIcon />}
            >
              Contribute
            </Button>
          </Box>
        </Flex>
      </Box>
      <LayoutFooter />
    </Layout>
  );
}

function WelcomeItem({
  Icon,
  title,
  content,
}: {
  Icon: ComponentType<IconProps>;
  title: string;
  content: string;
}) {
  return (
    <Box>
      <Icon boxSize={8} />
      <Text fontSize="lg" color="purple.500" fontWeight="bold" py={3}>
        {title}
      </Text>
      <Text>{content}</Text>
    </Box>
  );
}

export default Welcome;
