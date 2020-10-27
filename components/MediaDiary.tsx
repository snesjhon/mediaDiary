import { Box, Flex, Grid, Image, Spinner, Text } from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
import { useCollection } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Rating from "react-rating";
import { DiaryState } from "../config/mediaTypes";
import { ContextState } from "../config/store";
import { createMediaState } from "../utils/helpers";
import useUser from "../utils/useUser";
import AlbumIcon from "./Icons/AlbumIcon";
import FilmIcon from "./Icons/FilmIcon";
import LogoIcon from "./Icons/LogoIcon";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import TvIcon from "./Icons/TvIcon";

interface ListState {
  [key: string]: DiaryState;
}

function MediaDiary() {
  const router = useRouter();
  const { filterBy } = useContext(ContextState);
  const { user } = useUser();
  const { data } = useCollection(user === null || !user ? null : user.email, {
    listen: true,
  });

  if (data) {
    const { diaryState, mediaState } = createMediaState(data);
    if (
      Object.keys(diaryState).length > 0 &&
      Object.keys(mediaState).length > 0
    ) {
      let diaryDates: ListState = Object.keys(diaryState)
        .filter((e) => filterBy.includes(diaryState[e].type))
        .sort((a, b) =>
          diaryState[a].diaryDate.seconds > diaryState[b].diaryDate.seconds
            ? -1
            : 1
        )
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
          {Object.keys(diaryDates).map((month, monthIndex) => {
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
                    fontSize={{ base: "lg", md: "3xl" }}
                    color="gray.600"
                    fontWeight="bold"
                    position="sticky"
                    top="4rem"
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
                      const { rating, loggedBefore, seenEpisodes } = diaryDates[
                        month
                      ][day];
                      return (
                        <Grid
                          gridTemplateColumns={{
                            base: "1.5rem 4rem 1fr",
                            md: "3rem 8rem 1fr",
                          }}
                          gridGap="1rem"
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          px={3}
                          py={4}
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
                              fontSize={{ base: "lg", md: "2xl" }}
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
                            <Text
                              // color="gray.600"
                              colorScheme="gray"
                              fontSize={{ base: "md", md: "xl" }}
                            >
                              {title}
                            </Text>
                            <Text
                              fontSize={{ base: "sm", md: "md" }}
                              color="gray.500"
                              pb={2}
                            >
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
                            {type === "tv" && (
                              <Flex
                                py={2}
                                fontSize="sm"
                                color="gray.500"
                                fontStyle="italic"
                              >
                                <Text>
                                  <Text as="span" fontWeight="semibold">
                                    S:
                                  </Text>
                                  {season}{" "}
                                </Text>
                                <Text px={2}>·</Text>
                                <Text>
                                  <Text as="span" fontWeight="semibold">
                                    Ep.{" "}
                                  </Text>
                                  {seenEpisodes
                                    ?.sort((a, b) => (a < b ? -1 : 1))
                                    .join(", ")}
                                </Text>
                              </Flex>
                            )}
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
                                      h={{ base: "12px", md: "20px" }}
                                      w={{ base: "12px", md: "20px" }}
                                      color="purple.400"
                                    />
                                  }
                                  emptySymbol={
                                    <StarEmptyIcon
                                      h={{ base: "12px", md: "20px" }}
                                      w={{ base: "12px", md: "20px" }}
                                      stroke="purple.400"
                                    />
                                  }
                                />
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
        </>
      );
    }
  }
  return (
    <Flex height="90vh" justifyContent="center" alignItems="center">
      <Grid alignItems="center" justifyItems="center">
        <LogoIcon boxSize={8} sx={{ gridRow: 1, gridColumn: 1 }} />
        <Spinner
          size="xl"
          color="purple.500"
          thickness="3px"
          sx={{ gridRow: 1, gridColumn: 1 }}
        />
      </Grid>
    </Flex>
  );
}

export default MediaDiary;
