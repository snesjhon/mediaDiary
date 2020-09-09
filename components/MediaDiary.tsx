import React from "react";
import useUser from "../utils/useUser";
import { useCollection, useDocument } from "@nandorojo/swr-firestore";
import {
  MediaDiaryState,
  MediaDiaryAdd,
  MediaInfoAdd,
  MediaInfoState,
} from "../types/mediaTypes";
import { SimpleGrid, Box, Grid, Heading, Image, Text } from "@chakra-ui/core";

interface ListState {
  [key: string]: MediaDiaryState;
}

function Media() {
  const { user } = useUser();
  const { data } = useCollection(user.email, {
    listen: true,
  });

  if (data) {
    // swr-firebase adds these (useful but unnecessary) keys, so remove them and assign a key
    const {
      id: diaryId,
      hasPendingWrites,
      exists,
      ...diaryItems
    }: any = data[0];
    const {
      id: mediaId,
      hasPendingWrites: mediaWrites,
      exists: mediaExists,
      ...mediaItems
    }: any = data[1];
    const diaryState: MediaDiaryState = diaryItems;
    const mediaState: MediaInfoState = mediaItems;

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
                  templateColumns={{ base: "0.15fr 0.85fr", md: "0.1fr 0.9fr" }}
                  key={monthIndex}
                >
                  <Box>
                    <Heading
                      size="lg"
                      color="gray.600"
                      position="sticky"
                      top="4.1rem"
                    >
                      {new Date(month).toLocaleDateString("en-us", {
                        month: "short",
                      })}
                    </Heading>
                  </Box>
                  <Box>
                    {Object.keys(diaryDates[month])
                      .sort(
                        (a, b) =>
                          diaryDates[month][b].diaryDate.seconds -
                          diaryDates[month][a].diaryDate.seconds
                      )
                      .map((day, dayIndex) => {
                        // console.log(mediaState, diaryDates[month][day].id);
                        const {
                          title,
                          poster,
                          releasedDate,
                          artist,
                          type,
                        } = mediaState[diaryDates[month][day].id];
                        const {
                          star,
                          seenBefore,
                          season,
                          episode,
                        } = diaryDates[month][day];
                        return (
                          <Grid
                            gridTemplateColumns="0.05fr 0.2fr 0.75fr"
                            gridGap="1rem"
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            mb={3}
                            pb={3}
                            key={monthIndex + dayIndex}
                          >
                            <Box>
                              <Text fontSize="xl" color="gray.500">
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
                                borderRadius="5px"
                                border="1px solid"
                                borderColor="gray.300"
                              />
                            </Box>
                            <Box>
                              <Text color="gray.600">{title}</Text>
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
                            </Box>
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

export default Media;
