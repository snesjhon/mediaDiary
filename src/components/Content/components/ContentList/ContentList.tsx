import { useMDDispatch } from "@/config";
import { AlbumIcon, FilmIcon, StarEmptyIcon, TvIcon } from "@/icons";
import type { MediaDiaryState } from "@/types";
import { createPosterURL } from "@/utils";
import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import dayjs from "dayjs";
import React from "react";
import Rating from "react-rating";
import type { SortType } from "../../config";

interface Props {
  data: ListState;
  sortType: SortType["type"];
}

interface ListState {
  [key: string]: MediaDiaryState;
}

export default function ContentList({ data, sortType }: Props): JSX.Element {
  const dispatch = useMDDispatch();
  const { colorMode } = useColorMode();

  return (
    <>
      {Object.keys(data).map((month, monthIndex) => {
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
                top="7.5rem"
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
              {Object.keys(data[month]).map((day, dayIndex) => {
                const currentDate = data[month][day];
                const {
                  rating,
                  title,
                  poster,
                  releasedDate,
                  artist,
                  type,
                  season,
                  seenEpisodes,
                } = currentDate;
                const diaryDate = currentDate[sortType];
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
                        payload: data[month][day],
                      })
                    }
                  >
                    <Box>
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        color={colorMode === "light" ? "gray.500" : "gray.300"}
                      >
                        {diaryDate
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
    </>
  );
}
