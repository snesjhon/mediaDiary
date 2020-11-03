import { Box, Flex, Grid, Image, Spinner, Text } from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
import { fuego, useCollection } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Rating from "react-rating";
import { DiaryAdd, DiaryState } from "../config/mediaTypes";
import { ContextState } from "../config/store";
import useUser from "../utils/useUser";
import AlbumIcon from "./Icons/AlbumIcon";
import FilmIcon from "./Icons/FilmIcon";
import LogoIcon from "./Icons/LogoIcon";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import TvIcon from "./Icons/TvIcon";

interface ListState {
  [key: string]: DiaryState;
}

const limit = 30;
const orderBy = "diaryDate";

function MediaDiary() {
  const router = useRouter();
  const { filterBy } = useContext(ContextState);
  const { user } = useUser();
  const { data, mutate } = useCollection<DiaryAdd>(
    user === null || !user ? null : `${user.email}`,
    {
      limit,
      orderBy,
    },
    {
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      refreshInterval: 0,
    }
  );

  if (data) {
    let diaryDates: ListState = data
      .filter((e) => filterBy.includes(e.type))
      .reduce<ListState>((a, c) => {
        const dateString = c.diaryDate.toDate().toLocaleDateString("en-us", {
          month: "short",
          year: "numeric",
        });
        a[`01-${dateString}`] = Object.assign(
          { ...a[`01-${dateString}`] },
          { [c.mediaId]: c }
        );
        return a;
      }, {});
    return (
      <>
        <button onClick={paginate}>paginate</button>
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
                        id,
                        rating,
                        title,
                        poster,
                        releasedDate,
                        artist,
                        type,
                        season,
                        loggedBefore,
                        seenEpisodes,
                      } = diaryDates[month][day];
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
                            router.push(`?day=${id}`, `/diary/${id}`)
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
                              color="gray.600"
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

  async function paginate() {
    if (!data?.length) return;
    if (user !== null && user) {
      const ref = fuego.db.collection(`${user.email}`);

      // get the snapshot of last document we have right now in our query
      const startAfterDocument = await ref.doc(data[data.length - 1].id).get();

      // get more documents, after the most recent one we have
      const moreDocs = await ref
        .orderBy(orderBy)
        .startAfter(startAfterDocument)
        .limit(limit)
        .get()
        .then((d) => {
          const docs: any = [];
          d.docs.forEach((doc) => docs.push({ ...doc.data(), id: doc.id }));
          return docs;
        });

      // mutate our local cache, adding the docs we just added
      // set revalidate to false to prevent SWR from revalidating on its own
      mutate((state) => {
        if (state !== null) {
          return [...state, ...moreDocs];
        } else {
          return state;
        }
      }, false);
    }
  }
}

export default MediaDiary;
