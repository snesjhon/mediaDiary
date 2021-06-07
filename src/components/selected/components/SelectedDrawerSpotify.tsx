import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import type { SpotifyAlbum, SpotifyArtist } from "../../../types/typesSpotify";

interface Props {
  albumInfo: SpotifyAlbum;
  artistInfo: SpotifyArtist;
}

export default function SelectedDrawerSpotify({
  albumInfo,
  artistInfo,
}: Props): JSX.Element {
  const { name: title, images, release_date, label } = albumInfo;
  const { name: artist, genres } = artistInfo;

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
      >
        <Text fontSize="lg">{artist}</Text>
        <Heading
          fontWeight="bold"
          fontStyle="italic"
          size="lg"
          lineHeight={1.3}
        >
          {title}
        </Heading>
      </Flex>
      <Grid
        gridTemplateColumns="1fr 1fr"
        gridGap="1.5rem"
        justifyContent="center"
        mt={6}
      >
        <Box ml={{ base: 0, sm: 12 }}>
          {images && images?.length > 0 && (
            <Image
              src={images[0].url}
              borderRadius="5px"
              border="1px solid"
              borderColor="gray.300"
              loading="eager"
            />
          )}
        </Box>
        <VStack spacing="6" justify="center" align="left">
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Released
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {typeof release_date !== "undefined" &&
                `${new Date(release_date).toLocaleDateString("en-us", {
                  year: "numeric",
                })}`}
            </Text>
          </Box>
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Genre
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {genres && genres[0]}
            </Text>
          </Box>
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Label
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {label}
            </Text>
          </Box>
          <Flex
            justify="space-between"
            direction={{ sm: "column", md: "initial" }}
          >
            <Button
              as="a"
              href={artistInfo.external_urls.spotify}
              target="_blank"
              size="sm"
              rightIcon={<ExternalLinkIcon />}
            >
              Artist Page
            </Button>
            <Button
              href={albumInfo.external_urls.spotify}
              as="a"
              target="_blank"
              size="sm"
              rightIcon={<ExternalLinkIcon />}
            >
              Album Page
            </Button>
          </Flex>
        </VStack>
      </Grid>
      <Box my={4}>
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Heading size="lg">Tracks</Heading>
        </Flex>
        {albumInfo?.tracks?.items &&
          albumInfo.tracks.items.map((e, i) => (
            <Grid
              key={e.id}
              gridTemplateColumns="1fr 0.1fr"
              gridGap={4}
              mb={2}
              borderBottomWidth={
                albumInfo?.tracks?.items &&
                albumInfo.tracks.items.length - 1 === i
                  ? undefined
                  : "1px"
              }
              pb={
                albumInfo?.tracks?.items &&
                i === albumInfo.tracks.items.length - 1
                  ? undefined
                  : 2
              }
            >
              <Text fontSize={{ base: "sm" }}>{e.name}</Text>
              <Flex>
                <Text>{dayjs(e.duration_ms).format("m:ss")}</Text>
                <IconButton
                  variant="link"
                  icon={<ExternalLinkIcon />}
                  aria-label="Play Track"
                  as="a"
                  href={e.external_urls.spotify}
                  target="_blank"
                  color="gray.500"
                  size="sm"
                />
              </Flex>
            </Grid>
          ))}
        <Divider mt={4} mb={4} />
        <Heading size="lg" mb={3}>
          About
        </Heading>
        <Grid
          gridTemplateColumns={{ base: "0.5fr 1fr", md: "0.6fr 1fr" }}
          gridGap={{ base: 4, md: 0 }}
        >
          {artistInfo?.images && (
            <Box>
              <Image src={artistInfo.images[2].url} borderRadius="xl" />
            </Box>
          )}
          {artistInfo?.genres && (
            <Box>
              <Heading size="md" mb={4}>
                {artistInfo.name}
              </Heading>
              <Flex wrap="wrap">
                {artistInfo.genres.slice(0, 4).map((e: string) => (
                  <Tag
                    key={`${artistInfo.name}_${e}`}
                    colorScheme="purple"
                    mr={3}
                    mb={3}
                  >
                    {e}
                  </Tag>
                ))}
              </Flex>
            </Box>
          )}
        </Grid>
      </Box>
    </>
  );
}
