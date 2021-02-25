import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Tag,
  Text,
  Image,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import type { SpotifyAlbum, SpotifyArtist } from "../../types/typesSpotify";

function ContentSpotify({
  albumInfo,
  artistInfo,
}: {
  albumInfo: SpotifyAlbum;
  artistInfo: SpotifyArtist;
}): JSX.Element {
  return (
    <Box my={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Heading size="lg">Tracks</Heading>
        <Button
          href={albumInfo.external_urls.spotify}
          as="a"
          target="_blank"
          variant="outline"
          size="xs"
          rightIcon={<ExternalLinkIcon />}
        >
          Album Page
        </Button>
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
            <Box my={3}>
              <Button
                as="a"
                href={artistInfo.external_urls.spotify}
                target="_blank"
                size="xs"
                variant="outline"
                rightIcon={<ExternalLinkIcon />}
              >
                Artist Page
              </Button>
            </Box>
          </Box>
        )}
      </Grid>
    </Box>
  );
}

export default ContentSpotify;
