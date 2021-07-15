import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import type { Dispatch } from "react";
import type { LogActions, LogState } from "../../config/storeLog";
import type { SpotifyAlbum, SpotifyArtist } from "../../types/typesSpotify";
import {
  MediaContainer,
  MediaEdit,
  MediaHeader,
  MediaInfo,
  MediaInfoButton,
  MediaInfoText,
  MediaLinks,
  MediaPoster,
  MediaRating,
} from "./components";
import useIsBreakpoint from "@/utils/useIsBreakpoint";

interface Props {
  albumInfo: SpotifyAlbum;
  artistInfo: SpotifyArtist;
  diaryDate?: string | null;
  rating?: number;
  edit?: {
    dispatch: Dispatch<LogActions>;
    fields: LogState;
  };
}

export default function MediaSpotify({
  albumInfo,
  artistInfo,
  diaryDate,
  rating,
  edit,
}: Props): JSX.Element {
  const { name: title, images, release_date } = albumInfo;
  const { name: artist, genres } = artistInfo;
  return (
    <>
      <MediaHeader title={title} artist={artist} />
      <MediaContainer>
        {images && images?.length > 0 && (
          <MediaPoster poster={images[0].url} type="album" />
        )}
        {!edit && (
          <MediaInfo>
            {diaryDate && (
              <MediaInfoText
                title="Date"
                text={dayjs(diaryDate).format("MMM D, YYYY")}
              />
            )}
            {rating ? (
              <MediaRating rating={rating} />
            ) : (
              <MediaInfoText title="Rating" text="No Rating" />
            )}
            {release_date && (
              <MediaInfoText
                title="Released"
                text={new Date(release_date).toLocaleDateString("en-us", {
                  year: "numeric",
                })}
              />
            )}
            {genres && <MediaInfoText title="Genre" text={genres[0]} />}
          </MediaInfo>
        )}
      </MediaContainer>
      {edit ? (
        <MediaEdit dispatch={edit.dispatch} fields={edit.fields} />
      ) : (
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
            <Box>
              <Heading size="md" mb={4}>
                {artistInfo.name}
              </Heading>
              {artistInfo?.genres && (
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
              )}
              <MediaLinks>
                {artistInfo.external_urls.spotify && (
                  <MediaInfoButton
                    title="Artist Page"
                    link={artistInfo.external_urls.spotify}
                  />
                )}
                {albumInfo.external_urls.spotify && (
                  <MediaInfoButton
                    title="Album Page"
                    link={albumInfo.external_urls.spotify}
                  />
                )}
              </MediaLinks>
            </Box>
          </Grid>
        </Box>
      )}
    </>
  );
}
