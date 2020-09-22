import { Box, Flex, Grid, Image, Text } from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
import { useCollection } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React from "react";
import Rating from "react-rating";
import { DiaryState } from "../config/mediaTypes";
import { createMediaState } from "../utils/helpers";
import useUser from "../utils/useUser";
import AlbumIcon from "./Icons/AlbumIcon";
import FilmIcon from "./Icons/FilmIcon";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import TvIcon from "./Icons/TvIcon";

interface ListState {
  [key: string]: DiaryState;
}

function MediaDiary() {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useCollection(user === null ? null : user.email, {
    listen: true,
  });

  if (data) {
    const { diaryState, mediaState } = createMediaState(data);
    if (
      Object.keys(diaryState).length > 0 &&
      Object.keys(mediaState).length > 0
    ) {
      let diaryDates: ListState = Object.keys(diaryState)
        // .filter((e) => (filterBy === "" ? e : byDate[e].type === filterBy))
        .reduce<ListState>((a, c) => {
          const dateString = diaryState[c].diaryDate
            .toDate()
            .toLocaleDateString("en-us", {
              month: "short",
              year: "numeric",
            });
          a[`01-${dateString}`] = Object.assign(
            { ...a[`01-${dateString}`] },
            { [c]: diaryState[c] }
          );
          return a;
        }, {});
      return (
        <>
          {Object.keys(diaryDates)
            .sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))
            .map((month, monthIndex) => {
              return (
                <Grid
                  templateColumns={{
                    base: "3rem 1fr",
                    md: "0.1fr 0.9fr",
                  }}
                  key={monthIndex}
                >
                  <Box>
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      color="gray.600"
                      fontWeight="bold"
                      position="sticky"
                      top="4.1rem"
                    >
                      {new Date(month).toLocaleDateString("en-us", {
                        month: "short",
                      })}
                    </Text>
                  </Box>
                  <Box>
                    {Object.keys(diaryDates[month])
                      .sort(
                        (a, b) =>
                          diaryDates[month][b].diaryDate.seconds -
                          diaryDates[month][a].diaryDate.seconds
                      )
                      .map((day, dayIndex) => {
                        const {
                          title,
                          poster,
                          releasedDate,
                          artist,
                          type,
                          season,
                        } = mediaState[diaryDates[month][day].id];
                        const {
                          rating,
                          loggedBefore,
                          seenEpisodes,
                        } = diaryDates[month][day];
                        return (
                          <Grid
                            gridTemplateColumns="1.5rem 4rem 1fr"
                            gridGap="1rem"
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            mb={3}
                            pb={3}
                            key={monthIndex + dayIndex}
                            _hover={{
                              bg: "purple.50",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              router.push(`?day=${day}`, `/diary/${day}`)
                            }
                          >
                            <Box>
                              <Text
                                fontSize={{ base: "lg", md: "xl" }}
                                color="gray.500"
                              >
                                {new Date(
                                  diaryDates[month][day].diaryDate.toDate()
                                ).toLocaleDateString("en-us", {
                                  day: "numeric",
                                })}
                              </Text>
                            </Box>
                            <Box>
                              <Image
                                src={poster}
                                ignoreFallback
                                borderRadius="5px"
                                border="1px solid"
                                borderColor="gray.300"
                              />
                            </Box>
                            <Flex flexDirection="column">
                              <Text color="gray.600">
                                {title}{" "}
                                {type === "tv" && (
                                  <Text as="span">(Season {season}) </Text>
                                )}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {new Date(releasedDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                  }
                                )}
                                <Text as="span" px={2}>
                                  ·
                                </Text>
                                {artist}
                              </Text>
                              <Flex
                                mt="auto"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Box mt={type === "tv" ? "-3px" : undefined}>
                                  <Rating
                                    fractions={2}
                                    readonly
                                    initialRating={rating}
                                    fullSymbol={
                                      <StarIcon
                                        h="12px"
                                        w="12px"
                                        color="purple.400"
                                      />
                                    }
                                    emptySymbol={
                                      <StarEmptyIcon
                                        h="12px"
                                        w="12px"
                                        stroke="purple.400"
                                      />
                                    }
                                  />
                                </Box>
                                <Flex alignItems="center">
                                  {type === "tv" && (
                                    <Text fontSize="sm" color="gray.500" mr={3}>
                                      Ep.{" "}
                                      {seenEpisodes
                                        ?.sort((a, b) => (a < b ? -1 : 1))
                                        .join(", ")}
                                    </Text>
                                  )}
                                  {type === "movie" && <FilmIcon />}
                                  {type === "album" && <AlbumIcon />}
                                  {type === "tv" && <TvIcon />}
                                </Flex>
                              </Flex>
                            </Flex>
                          </Grid>
                        );
                      })}
                  </Box>
                </Grid>
              );
            })}
        </>
      );
    }
  }
  return <div>nothing to show</div>;
}

export default MediaDiary;

{
  /* <Box mt={"-1px"}>
                                    <Rating
                                      fractions={2}
                                      readonly
                                      initialRating={rating}
                                      fullSymbol={
                                        <StarIcon
                                          h="12px"
                                          w="12px"
                                          color="purple.400"
                                        />
                                      }
                                      emptySymbol={
                                        <StarEmptyIcon
                                          h="12px"
                                          w="12px"
                                          stroke="purple.400"
                                        />
                                      }
                                    />
                                  </Box>
                                  {type === "tv" && (
                                    <>
                                      <Text as="span" px={2}>
                                        ·
                                      </Text>
                                      <Text fontSize="sm" color="gray.500">
                                        S{season}:{" "}
                                        {seenEpisodes
                                          ?.sort((a, b) => (a < b ? -1 : 1))
                                          .toString()}
                                      </Text>
                                    </>
                                  )} */
}
