import { EditIcon, ExternalLinkIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { Suspense } from "react";
import Rating from "react-rating";
import useSWR from "swr";
import type { DiaryAdd, MediaTypes } from "../config/types";
import { useMDDispatch, useMDState } from "../config/store";
import useFuegoUser from "../hooks/useFuegoUser";
import { fetcher } from "../utils/fetchers";
import Edit from "./Edit";
import StarEmptyIcon from "./icons/StartEmptyIcon";
import MdLoader from "./md/MdLoader";
import { fuegoDiaryEntry } from "../interfaces/fuegoMDActions";
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
          </>
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
  const { data } = useSWR<any[]>(`/spotify/${mediaId}`, fetchAll, {
    revalidateOnFocus: false,
    suspense: true,
  });

  if (data) {
    const albumInfo = data[0];
    const artistInfo = data[1];

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
        {albumInfo.tracks.items.map((e: any, i: number) => (
          <Grid
            key={e.id}
            gridTemplateColumns="1fr 0.1fr"
            gridGap={4}
            mb={2}
            borderBottomWidth={
              i === albumInfo.tracks.items.length - 1 ? undefined : "1px"
            }
            pb={i === albumInfo.tracks.items.length - 1 ? undefined : 2}
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
          <Box>
            <Image src={artistInfo.images[2].url} borderRadius="xl" />
          </Box>
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
        </Grid>
      </Box>
    );
  }
  return null;

  function fetchAll() {
    const albumFetch = fetch(`https://api.spotify.com/v1/albums/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    const artistFetch = fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((r) => r.json());

    return Promise.all([albumFetch, artistFetch]).then((results) => results);
  }
}

function MDBData({
  mediaId,
  type,
  season,
}: {
  mediaId: string;
  type: MediaTypes;
  season: number | undefined;
}) {
  const fetchURL = createFetch();
  const { data } = useSWR(fetchURL, fetcher, {
    revalidateOnFocus: false,
    suspense: true,
  });

  return (
    <Box my={4}>
      {data && (
        <>
          {typeof data.tagline !== "undefined" &&
            typeof data.overview !== "undefined" && (
              <>
                <Heading size="lg" mb={3}>
                  About
                </Heading>
                {typeof data.tagline !== "undefined" && (
                  <Text
                    textTransform="uppercase"
                    pb={2}
                    fontSize="sm"
                    fontWeight={400}
                    color="gray.500"
                  >
                    {data.tagline}
                  </Text>
                )}
                {typeof data.overview !== "undefined" && (
                  <Text>{data.overview}</Text>
                )}
                <Divider mt={4} mb={4} />
              </>
            )}
          <Heading size="lg" mb={5}>
            Cast
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            {data.credits.cast.slice(0, 4).map((e: any) => (
              <Box key={e.name}>
                <Image
                  src={`https://image.tmdb.org/t/p/w300${e.profile_path}`}
                  borderRadius="lg"
                  h="150px"
                />
                <Text>{e.name}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}
    </Box>
  );

  function createFetch(): string | null {
    if (type === "movie") {
      return `https://api.themoviedb.org/3/movie/${mediaId}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,watch/providers,videos`;
    } else if (type === "tv") {
      const idArr = mediaId.split("_");
      return `https://api.themoviedb.org/3/tv/${idArr[0]}/season/${season}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,videos`;
    }
    return null;
  }
}

export default Day;
