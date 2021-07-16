import { ArrowDownIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Square,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import Rating from "react-rating";
import { cache, useSWRInfinite } from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import { fuegoDiaryGet } from "./config";
import type { MediaDiaryState, MediaDiaryWithId } from "../../types/typesMedia";
import type { UserFuegoValidated } from "../../types/typesUser";
import { createPosterURL } from "../../utils/helpers";
import MdLoader from "../md/MdLoader";
import { LogoIcon, StarEmptyIcon, FilmIcon, AlbumIcon, TvIcon } from "@/icons";

interface ListState {
  [key: string]: MediaDiaryState;
}

export default function Home({
  user,
}: {
  user: UserFuegoValidated;
}): JSX.Element {
  const state = useMDState();
  const dispatch = useMDDispatch();
  const { colorMode } = useColorMode();

  const { data, error, size, setSize, mutate } = useSWRInfinite<
    MediaDiaryWithId[]
  >(
    (_, prev) => {
      // We've reached the end of the list since we got < 30, don't call again
      if (prev && prev.length < 30) return null;

      return [
        "/fuego/diary",
        user.uid,
        prev !== null ? prev[prev.length - 1].diaryDate : null,
        state.diaryFilters?.mediaType ?? null,
        state.diaryFilters?.rating ?? null,
        state.diaryFilters?.releasedDecade ?? null,
        state.diaryFilters?.diaryYear ?? null,
        state.diaryFilters?.loggedBefore ?? null,
        state.diaryFilters?.genre ?? null,
      ];
    },
    fuegoDiaryGet,
    {
      revalidateOnFocus: false,
    }
  );

  // Instead of mutating by key in ANY part of the UI, instead whenever "isSaving" is triggered
  // then mutate this list regardless of the filters
  useEffect(() => {
    if (state.isSaving) {
      mutate();
    }
  }, [state.isSaving, mutate]);

  // We need to reset whenever we unmount to keep the rendering times at a good pace
  useEffect(() => {
    return () => {
      cache.clear();
    };
  }, []);

  // We have data! Or not...
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;

  // There's an error on the list, or the list is empty
  if (error) {
    console.error(error);
    return <div>An Error Happened</div>;
  }

  if (isEmpty) {
    return (
      <Square height="80vh">
        <LogoIcon boxSize={8} color="purple.500" mr={2} />
        <Heading size="lg">No Memories</Heading>
      </Square>
    );
  }

  if (data) {
    // TODO: Refactor.. Something about SWRInfinite throws a TS error
    const allData = data ? ([] as MediaDiaryWithId[]).concat(...data) : [];

    const diaryDates: ListState = allData.reduce<ListState>((a, c) => {
      if (c.diaryDate) {
        const dateString = dayjs(c.diaryDate).format("YYYY-MM");
        a[dateString] = Object.assign({ ...a[dateString] }, { [c.id]: c });
      }
      return a;
    }, {});

    const isReachingEnd =
      isEmpty || (data && data[data.length - 1]?.length < 30);

    return (
      <>
        {Object.keys(diaryDates).map((month, monthIndex) => {
          return (
            <Grid
              templateColumns={{
                base: "3rem 1fr",
                md: "0.1fr 0.9fr",
              }}
              key={monthIndex}
              borderLeftWidth={{ base: 0, md: "1px" }}
              borderRightWidth={{ base: 0, md: "1px" }}
              px={{ md: 8 }}
            >
              <Box>
                <Text
                  fontSize={{ base: "lg", md: "2xl" }}
                  color={colorMode === "light" ? "gray.600" : "gray.300"}
                  fontWeight="bold"
                  position="sticky"
                  top="4rem"
                >
                  {dayjs(`${month}-01`).format("MMM")}
                  <Text
                    as="span"
                    display="block"
                    fontSize="sm"
                    color="purple.700"
                  >
                    {dayjs(`${month}-01`).format("YYYY")}
                  </Text>
                </Text>
              </Box>
              <Box>
                {Object.keys(diaryDates[month]).map((day, dayIndex) => {
                  const {
                    rating,
                    title,
                    poster,
                    releasedDate,
                    artist,
                    type,
                    season,
                    seenEpisodes,
                  } = diaryDates[month][day];
                  const diaryDate = diaryDates[month][day].diaryDate;
                  return (
                    <Grid
                      gridTemplateColumns={{
                        base: "1.5rem 4rem 1fr",
                        md: "3rem 7rem 1fr",
                      }}
                      gridGap="1rem"
                      borderBottomWidth="1px"
                      px={3}
                      py={{ base: 4, md: 5 }}
                      key={monthIndex + dayIndex}
                      _hover={{
                        bg: colorMode === "light" ? "purple.50" : "gray.700",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        dispatch({
                          type: "day",
                          payload: diaryDates[month][day],
                        })
                      }
                    >
                      <Box>
                        <Text
                          fontSize={{ base: "lg", md: "xl" }}
                          color={
                            colorMode === "light" ? "gray.500" : "gray.300"
                          }
                        >
                          {diaryDate !== null
                            ? new Date(diaryDate).toLocaleDateString("en-us", {
                                day: "numeric",
                              })
                            : "No Date"}
                        </Text>
                      </Box>
                      <Box>
                        <Image
                          src={createPosterURL(poster, type)}
                          ignoreFallback
                          borderRadius="5px"
                          border="1px solid"
                          borderColor="gray.300"
                        />
                      </Box>
                      <Flex flexDirection="column">
                        <Text fontSize={{ base: "md", md: "xl" }}>{title}</Text>
                        <Text fontSize={{ base: "sm" }} color="gray.500" pb={2}>
                          {new Date(releasedDate).toLocaleDateString("en-US", {
                            year: "numeric",
                          })}
                          <Text as="span" px={2}>
                            ·
                          </Text>
                          {artist}
                        </Text>
                        {type === "tv" && (
                          <Flex
                            py={2}
                            fontSize="sm"
                            color="gray.500"
                            fontStyle="italic"
                          >
                            <Text>
                              <Text as="span" fontWeight="semibold">
                                S:{" "}
                              </Text>
                              {season}
                            </Text>
                            {typeof seenEpisodes !== "undefined" &&
                              seenEpisodes?.length > 0 && (
                                <>
                                  <Text px={2}>·</Text>
                                  <Text>
                                    <Text as="span" fontWeight="semibold">
                                      Ep.{" "}
                                    </Text>
                                    {seenEpisodes
                                      ?.sort((a, b) => (a < b ? -1 : 1))
                                      .join(", ")}
                                  </Text>
                                </>
                              )}
                          </Flex>
                        )}
                        <Flex
                          mt="auto"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box mt={type === "tv" ? "-3px" : undefined}>
                            {rating === 0 ? (
                              <Text fontSize="sm" color="gray.500">
                                No Rating
                              </Text>
                            ) : (
                              <Rating
                                fractions={2}
                                readonly
                                initialRating={rating}
                                fullSymbol={
                                  <StarIcon
                                    h={{ base: "12px", md: "20px" }}
                                    w={{ base: "12px", md: "20px" }}
                                    color="purple.400"
                                  />
                                }
                                emptySymbol={
                                  // eslint-disable-next-line react/jsx-no-undef
                                  <StarEmptyIcon
                                    h={{ base: "12px", md: "20px" }}
                                    w={{ base: "12px", md: "20px" }}
                                    stroke="purple.400"
                                  />
                                }
                              />
                            )}
                          </Box>
                          {type === "movie" && <FilmIcon />}
                          {type === "album" && <AlbumIcon />}
                          {type === "tv" && <TvIcon />}
                        </Flex>
                      </Flex>
                    </Grid>
                  );
                })}
              </Box>
            </Grid>
          );
        })}
        {!isReachingEnd && (
          <HStack mt={3} mb={10} borderLeftWidth="1px" borderRightWidth="1px">
            <Button
              onClick={() => setSize(size + 1)}
              flex={1}
              variant="ghost"
              py={8}
              isLoading={isLoadingMore}
              loadingText="Loading More"
            >
              <ArrowDownIcon />
              LoadMore
              <ArrowDownIcon />
            </Button>
          </HStack>
        )}
      </>
    );
  }

  return <MdLoader />;
}
