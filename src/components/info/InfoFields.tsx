import { StarIcon } from "@chakra-ui/icons";
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
import dayjs from "dayjs";
import type { Dispatch } from "react";
import React, { useState } from "react";
import Rating from "react-rating";
import { MEDIA_LOGGED_BEFORE } from "../../config/contants";
import { useMDDispatch } from "../../config/store";
import type { MDActions } from "../../config/store";
import type { LogActions, LogState } from "../../config/storeLog";
import type {
  MediaDiaryWithId,
  MediaSelected,
  MediaType,
} from "../../types/typesMedia";
import { parsePosterUrl } from "../../utils/helpers";
import StarEmptyIcon from "../icons/StartEmptyIcon";

function InfoFields({
  dispatch,
  fields,
  item,
  isEdit,
  type,
}: {
  dispatch: Dispatch<LogActions>;
  fields: LogState;
  item: MediaSelected | MediaDiaryWithId;
  type: MediaType;
  isEdit?: boolean;
}): JSX.Element {
  const { diaryDate, rating, loggedBefore, seenEpisodes } = fields;
  const mdDispatch = useMDDispatch();

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
                  value: dayjs(e.target.value).toISOString(),
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
        <Text>{MEDIA_LOGGED_BEFORE[type]}</Text>
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
      {type === "tv" && item && (
        <>
          {item.season !== -1 && (
            <Flex alignItems="center" justifyContent="space-between">
              <Text flex="1">Season</Text>
              {item.episodes && (
                <Button
                  size="sm"
                  colorScheme="purple"
                  mr={3}
                  variant="link"
                  onClick={() => setShowEpisodes(!showEpisodes)}
                >
                  + Episodes
                </Button>
              )}
              <Box w="30%">
                {isEdit && <div>{item.season}</div>}
                {!isEdit && (
                  <SelectSeason
                    item={item as MediaSelected}
                    dispatch={mdDispatch}
                  />
                )}
              </Box>
            </Flex>
          )}
          {typeof item.episodes !== "undefined" && showEpisodes && (
            <>
              <Divider my={2} />
              <SimpleGrid columns={Math.floor(item.episodes / 3)} spacingY={3}>
                {Array.from(
                  { length: item.episodes },
                  (_, episodeNumber: number) => (
                    <Checkbox
                      key={`episode_${episodeNumber + 1}`}
                      value={episodeNumber + 1}
                      isChecked={seenEpisodes?.includes(episodeNumber + 1)}
                      colorScheme="purple"
                      onChange={(e) => {
                        // TODO: prevent empty episode number
                        let episodeArr: number[] = [];
                        if (typeof seenEpisodes !== "undefined") {
                          const hasValue = seenEpisodes.includes(
                            parseInt(e.target.value)
                          );
                          episodeArr = hasValue
                            ? seenEpisodes.filter(
                                (filterValue) =>
                                  filterValue !== parseInt(e.target.value)
                              )
                            : [parseInt(e.target.value)].concat(seenEpisodes);
                        } else {
                          episodeArr = [parseInt(e.target.value)];
                        }

                        return dispatch({
                          type: "state",
                          payload: {
                            key: "seenEpisodes",
                            value: episodeArr,
                          },
                        });
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
function SelectSeason({
  item,
  dispatch,
}: {
  item: MediaSelected;
  dispatch: (props: MDActions) => void;
}) {
  if (item.seasons && item.seasons !== null) {
    return (
      <Select
        size="sm"
        value={item.season}
        onChange={(valueChange) => {
          if (item.seasons) {
            const seasonIndex = item.seasons.findIndex(
              (e) => e.season_number === parseInt(valueChange.target.value)
            );
            const currentSeason = item.seasons[seasonIndex];
            return dispatch({
              type: "selectedReplace",
              payload: {
                ...item,
                season: currentSeason.season_number,
                poster:
                  currentSeason.poster_path &&
                  currentSeason.poster_path !== null
                    ? parsePosterUrl(currentSeason.poster_path, "tv")
                    : item.poster,
              },
            });
          }
          return;
        }}
      >
        {item.seasons.map((e) => (
          <option key={`season_${e.season_number}`} value={e.season_number}>
            {e.season_number}
          </option>
        ))}
      </Select>
    );
  }
  return null;
}

export default InfoFields;
