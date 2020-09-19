import {
  Divider,
  Flex,
  Box,
  Input,
  Checkbox,
  Button,
  Select,
  Collapse,
  SimpleGrid,
  Text,
} from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import React, { Dispatch, useState } from "react";
import Rating from "react-rating";
import { LogActions, LogFields } from "../config/logStore";
import StarEmptyIcon from "./Icons/StartEmptyIcon";

function Fields({
  dispatch,
  item,
}: {
  dispatch: Dispatch<LogActions>;
  item: LogFields;
}) {
  const {
    diaryDate,
    rating,
    loggedBefore,
    poster,
    seasons,
    season,
    episodes,
  } = item;
  const [showEpisodes, setShowEpisodes] = useState(false);
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
      {typeof seasons !== "undefined" && seasons.length > 0 && (
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
              <Select
                size="sm"
                value={season.season_number}
                onChange={(valueChange) => {
                  const seasonIndex = seasons.findIndex(
                    (e: any) =>
                      e.season_number === parseInt(valueChange.target.value)
                  );
                  return dispatch({
                    type: "season",
                    payload: {
                      season: seasons[seasonIndex],
                      poster:
                        seasons[seasonIndex].poster_path !== null
                          ? `https://image.tmdb.org/t/p/w500${seasons[seasonIndex].poster_path}`
                          : poster,
                    },
                  });
                }}
              >
                {seasons.map((e: any) => (
                  <option
                    key={`season_${e.season_number}`}
                    value={e.season_number}
                  >
                    {e.season_number}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
          <Divider my={2} />
          <Collapse mt={4} isOpen={showEpisodes}>
            <SimpleGrid
              columns={Math.floor(season.episode_count / 3)}
              spacingY={3}
            >
              {Array.from(
                { length: season.episode_count },
                (_, episodeNumber: number) => (
                  <Checkbox
                    key={`episode_${episodeNumber + 1}`}
                    value={episodeNumber + 1}
                    onChange={(e) => {
                      if (typeof episodes !== "undefined") {
                        const hasValue = episodes?.includes(
                          parseInt(e.target.value)
                        );
                        const episodeArr = hasValue
                          ? episodes?.filter(
                              (filterValue: any) =>
                                filterValue !== parseInt(e.target.value)
                            )
                          : [parseInt(e.target.value)].concat(episodes);

                        return dispatch({
                          type: "state",
                          payload: {
                            key: "episodes",
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
          </Collapse>
        </>
      )}
    </>
  );
}

export default Fields;
