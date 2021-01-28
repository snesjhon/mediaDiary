import { EditIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  DrawerBody,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { Suspense } from "react";
import Rating from "react-rating";
import useSWR from "swr";
import { useMDDispatch, useMDState } from "../config/store";
import type { DiaryAdd, MediaType } from "../config/types";
import type { MDbMovie, MDbTV } from "../config/typesMDb";
import type { SpotifyAlbum, SpotifyArtist } from "../config/typesSpotify";
import { fuegoDiaryEntry } from "../interfaces/fuegoMDActions";
import useFuegoUser from "../interfaces/useFuegoUser";
import { fetcher, spotifyFetch } from "../utils/fetchers";
import {
  getAlbumUrl,
  getArtistUrl,
  getMovieUrl,
  getTVUrl,
} from "../utils/helpers";
import ContentMDb from "./content/ContentMDb";
import ContentSpotify from "./content/ContentSpotify";
import Edit from "./Edit";
import StarEmptyIcon from "./icons/StartEmptyIcon";
import MdLoader from "./md/MdLoader";
import MdSpinner from "./md/MdSpinner";

function Day(): JSX.Element | null {
  const { user } = useFuegoUser();
  const dispatch = useMDDispatch();
  const { view, edit, spotifyToken } = useMDState();

  const { data } = useSWR<DiaryAdd | false>(
    user !== null && user && edit
      ? ["/fuego/diaryDay", user.uid, edit.diaryId]
      : null,
    fuegoDiaryEntry,
    {
      revalidateOnFocus: false,
    }
  );

  if (data) {
    const {
      rating,
      diaryDate,
      artist,
      title,
      poster,
      genre,
      releasedDate,
      artistId,
    } = data;

    return (
      <>
        {view === "edit" ? (
          <Edit />
        ) : (
          <DrawerBody px={{ base: 6, sm: 8 }}>
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
              gridTemplateColumns={{ base: "0.6fr 0.4fr", md: "1fr 1fr" }}
              gridGap="1.5rem"
              justifyContent="center"
              mt={6}
            >
              <Box ml="auto">
                <Image
                  src={poster}
                  w="13rem"
                  borderRadius="5px"
                  border="1px solid"
                  borderColor="gray.300"
                  loading="eager"
                />
              </Box>
              <Flex flexDirection="column" justifyContent="space-around">
                <Box>
                  <Text fontWeight={500} fontSize="sm">
                    Date
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {dayjs(diaryDate).format("MMM D, YYYY")}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight={500} fontSize="sm">
                    Rating
                  </Text>
                  <Text fontWeight="bold">
                    <Rating
                      fractions={2}
                      readonly
                      initialRating={rating}
                      fullSymbol={
                        <StarIcon color="purple.400" w="20px" h="20px" />
                      }
                      emptySymbol={
                        <StarEmptyIcon stroke="purple.400" w="20px" h="20px" />
                      }
                    />
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight={500} fontSize="sm">
                    Edit
                  </Text>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="edit"
                    variant="outline"
                    size="sm"
                    colorScheme="green"
                    isRound
                    onClick={() => dispatch({ type: "view", payload: "edit" })}
                  />
                </Box>
              </Flex>
            </Grid>
            <Grid gridTemplateColumns="1fr 1fr" gridGap="1.5rem">
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.500"
                mt={1}
                ml="auto"
                textTransform="uppercase"
              >
                {genre && <>{genre} • </>}
                {typeof releasedDate !== "undefined" &&
                  `${new Date(releasedDate).toLocaleDateString("en-us", {
                    year: "numeric",
                  })}`}
              </Text>
              <div />
            </Grid>
            <Divider mt={3} mb={2} />
            <Suspense fallback={<MdSpinner />}>
              {data.type === "album" &&
              typeof spotifyToken !== "undefined" &&
              typeof artistId !== "undefined" ? (
                <SpotifyData
                  mediaId={data.mediaId}
                  token={spotifyToken}
                  artistId={artistId}
                />
              ) : (
                <MDBData
                  mediaId={data.mediaId}
                  type={data.type}
                  season={data.type === "tv" ? data.season : undefined}
                />
              )}
            </Suspense>
          </DrawerBody>
        )}
      </>
    );
  }
  return <MdLoader />;
}

function SpotifyData({
  mediaId,
  artistId,
  token,
}: {
  mediaId: string;
  token: string;
  artistId: string;
}) {
  const { data } = useSWR<[SpotifyAlbum, SpotifyArtist]>(
    `/spotify/${mediaId}`,
    fetchAll,
    {
      revalidateOnFocus: false,
      suspense: true,
    }
  );

  if (data) {
    const albumInfo = data[0];
    const artistInfo = data[1];

    return <ContentSpotify albumInfo={albumInfo} artistInfo={artistInfo} />;
  }

  return null;

  function fetchAll() {
    const albumFetch = spotifyFetch<SpotifyAlbum>(getAlbumUrl(mediaId), token);
    const artistFetch = spotifyFetch<SpotifyArtist>(
      getArtistUrl(artistId),
      token
    );
    return Promise.all([albumFetch, artistFetch]).then((results) => results);
  }
}

function MDBData({
  mediaId,
  type,
  season,
}: {
  mediaId: string;
  type: MediaType;
  season: number | undefined;
}) {
  const fetchURL = createFetch();
  const { data } = useSWR<MDbMovie | MDbTV>(fetchURL, fetcher, {
    revalidateOnFocus: false,
    suspense: true,
  });

  if (data) {
    return <ContentMDb type={type} data={data} />;
  }

  return null;

  function createFetch(): string | null {
    if (type === "movie") {
      return getMovieUrl(mediaId);
    } else if (type === "tv") {
      const idArr = mediaId.split("_");
      return getTVUrl(idArr[0], season);
    }
    return null;
  }
}

export default Day;
