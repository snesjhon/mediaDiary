import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import type { Dispatch } from "react";
import React, { useState } from "react";
import Rating from "react-rating";
import type { LogActions, LogProps } from "../config/logStore";
import StarEmptyIcon from "./icons/StartEmptyIcon";

function LogFields({
  dispatch,
  item,
  isEdit,
  type,
}: {
  dispatch: Dispatch<LogActions>;
  item: LogProps;
  type: any;
  isEdit?: boolean;
}): JSX.Element {
  const {
    diaryDate,
    rating,
    loggedBefore,
    poster,
    externalSeasons,
    season,
    episodes,
    seenEpisodes,
  } = item;
  const [showEpisodes, setShowEpisodes] = useState(
    typeof seenEpisodes !== "undefined" && seenEpisodes.length > 0
      ? true
      : false
  );
  return (
    <>
      <Divider mt={4} mb={2} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text>Date</Text>
        <Box>
          <Input
            size="sm"
            type="date"
            required
            value={dayjs(diaryDate).format("YYYY-MM-DD")}
            max={dayjs().format("YYYY-MM-DD")}
            onChange={(e) =>
              dispatch({
                type: "state",
                payload: {
                  key: "diaryDate",
                  value: dayjs(e.target.value).toDate(),
                },
              })
            }
          />
        </Box>
      </Flex>
      <Divider my={2} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text>Rate</Text>
        <Box mt="-4px">
          <Rating
            fractions={2}
            initialRating={rating}
            fullSymbol={<StarIcon h="20px" w="20px" color="purple.500" />}
            emptySymbol={
              <StarEmptyIcon h="20px" w="20px" stroke="purple.500" />
            }
            onChange={(value) =>
              dispatch({
                type: "state",
                payload: {
                  key: "rating",
                  value,
                },
              })
            }
          />
        </Box>
      </Flex>
      <Divider my={2} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text>Heard Before?</Text>
        <Checkbox
          colorScheme="purple"
          isChecked={loggedBefore}
          onChange={() =>
            dispatch({
              type: "state",
              payload: { key: "loggedBefore", value: !loggedBefore },
            })
          }
        />
      </Flex>
      <Divider my={2} />
      {type === "tv" && (
        <>
          <Flex alignItems="center" justifyContent="space-between">
            <Text flex="1">Season</Text>
            <Button
              size="sm"
              colorScheme="purple"
              mr={3}
              variant="link"
              onClick={() => setShowEpisodes(!showEpisodes)}
            >
              + Episodes
            </Button>
            <Box w="30%">
              {isEdit && <div>{season}</div>}
              {typeof externalSeasons !== "undefined" && (
                <Select
                  size="sm"
                  value={season}
                  onChange={(valueChange) => {
                    const seasonIndex = externalSeasons.findIndex(
                      (e: any) =>
                        e.season_number === parseInt(valueChange.target.value)
                    );
                    return dispatch({
                      type: "season",
                      payload: {
                        externalSeason: externalSeasons[seasonIndex],
                        poster:
                          externalSeasons[seasonIndex].poster_path !== null
                            ? `https://image.tmdb.org/t/p/w500${externalSeasons[seasonIndex].poster_path}`
                            : poster,
                      },
                    });
                  }}
                >
                  {externalSeasons.map((e: any) => (
                    <option
                      key={`season_${e.season_number}`}
                      value={e.season_number}
                    >
                      {e.season_number}
                    </option>
                  ))}
                </Select>
              )}
            </Box>
          </Flex>
          {typeof episodes !== "undefined" && (
            <>
              <Divider my={2} />
              <SimpleGrid columns={Math.floor(episodes / 3)} spacingY={3}>
                {Array.from(
                  { length: episodes },
                  (_, episodeNumber: number) => (
                    <Checkbox
                      key={`episode_${episodeNumber + 1}`}
                      value={episodeNumber + 1}
                      isChecked={seenEpisodes?.includes(episodeNumber + 1)}
                      onChange={(e) => {
                        if (typeof seenEpisodes !== "undefined") {
                          const hasValue = seenEpisodes?.includes(
                            parseInt(e.target.value)
                          );
                          const episodeArr = hasValue
                            ? seenEpisodes?.filter(
                                (filterValue: any) =>
                                  filterValue !== parseInt(e.target.value)
                              )
                            : [parseInt(e.target.value)].concat(seenEpisodes);

                          return dispatch({
                            type: "state",
                            payload: {
                              key: "seenEpisodes",
                              value: episodeArr,
                            },
                          });
                        } else {
                          return console.error("no episodes found");
                        }
                      }}
                    >
                      <Text fontSize="sm">{episodeNumber + 1}</Text>
                    </Checkbox>
                  )
                )}
              </SimpleGrid>
            </>
          )}
        </>
      )}
    </>
  );
}

export default LogFields;
