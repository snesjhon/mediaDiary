import { ExternalLinkIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Link,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import type { Dispatch } from "react";
import React, { useEffect, useRef, useState } from "react";
import Rating from "react-rating";
import type { LogTVSeason } from "..";
import { MEDIA_LOGGED_BEFORE } from "../../../config/contants";
import type { LogActions, LogState } from "../../../config/storeLog";
import type { MDbTV } from "../../../types/typesMDb";
import { createPosterURL, parsePosterUrl } from "../../../utils/helpers";
import StarEmptyIcon from "../../icons/StartEmptyIcon";

interface Props extends LogTVSeason {
  data: MDbTV;
  dispatch: Dispatch<LogActions>;
  fields: LogState;
  handleSeasonSelected: (props: LogTVSeason) => void;
}

export default function LogTV({
  data,
  dispatch,
  fields,
  handleSeasonSelected,
  episodes,
  poster,
  season,
}: Props): JSX.Element {
  const {
    credits,
    genres,
    poster_path,
    homepage,
    original_name,
    first_air_date,
    seasons,
  } = data;
  const { diaryDate, loggedBefore, rating, seenEpisodes } = fields;
  const currentSeason = season && seasons ? seasons[season] : false;
  const [showEpisodes, setShowEpisodes] = useState(false);
  const initSeason = useRef(true);

  // This is temporary because I think we should maybe let the user select IF they want to add a season
  // They could also not want to select a season and just add the show.
  useEffect(() => {
    if (initSeason.current) {
      if (
        seasons &&
        seasons[0].poster_path &&
        seasons[0].poster_path !== null
      ) {
        handleSeasonSelected({
          season: seasons[0].season_number,
          episodes: seasons[0].episode_count,
          poster: parsePosterUrl(seasons[0].poster_path, "tv"),
        });
        initSeason.current = false;
      }
    }
  }, [seasons, handleSeasonSelected]);

  const whereToWatch = data["watch/providers"]?.results["US"]?.link;

  const artist =
    credits &&
    credits.crew &&
    credits.crew.find((e) => e.job === "Director")?.name;

  return (
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
          {original_name}
        </Heading>
      </Flex>
      <Grid
        gridTemplateColumns="1fr 1fr"
        gridGap="1.5rem"
        justifyContent="center"
        my={6}
      >
        <Box ml={{ base: 0, sm: 12 }}>
          <Image
            src={createPosterURL(
              parsePosterUrl(poster ?? poster_path, "tv"),
              "tv"
            )}
            borderRadius="5px"
            border="1px solid"
            borderColor="gray.300"
            loading="eager"
          />
        </Box>
        <VStack spacing="6" justify="center" align="left">
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Released
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {new Date(
                currentSeason ? currentSeason.air_date : first_air_date
              ).toLocaleDateString("en-us", {
                year: "numeric",
              })}
            </Text>
          </Box>
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Genre
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {genres && genres[0].name}
            </Text>
          </Box>
          {whereToWatch && (
            <Box>
              <Button
                as={Link}
                href={data["watch/providers"].results["US"].link}
                target="_blank"
                size="sm"
                leftIcon={<ExternalLinkIcon />}
              >
                Where to Watch
              </Button>
            </Box>
          )}
          {homepage && (
            <Box>
              <Button
                as={Link}
                href={homepage}
                target="_blank"
                size="sm"
                leftIcon={<ExternalLinkIcon />}
              >
                HomePage
              </Button>
            </Box>
          )}
        </VStack>
      </Grid>
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
        <Text>{MEDIA_LOGGED_BEFORE["movie"]}</Text>
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
      {season !== -1 && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text flex="1">Season</Text>
          {episodes && (
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
          {seasons && (
            <Box w="30%">
              <Select
                size="sm"
                value={season}
                onChange={(valueChange) => {
                  if (seasons) {
                    const seasonIndex = seasons.findIndex(
                      (e) =>
                        e.season_number === parseInt(valueChange.target.value)
                    );
                    const selectSeason = seasons[seasonIndex];
                    handleSeasonSelected({
                      season: selectSeason.season_number,
                      episodes: selectSeason.episode_count,
                      poster:
                        selectSeason.poster_path &&
                        selectSeason.poster_path !== null
                          ? parsePosterUrl(selectSeason.poster_path, "tv")
                          : poster_path,
                    });
                  }
                  return;
                }}
              >
                {seasons.map((e) => (
                  <option
                    key={`season_${e.season_number}`}
                    value={e.season_number}
                  >
                    {e.season_number}
                  </option>
                ))}
              </Select>
            </Box>
          )}
        </Flex>
      )}
      {typeof episodes !== "undefined" && showEpisodes && (
        <>
          <Divider my={2} />
          <SimpleGrid columns={Math.floor(episodes / 3)} spacingY={3}>
            {Array.from({ length: episodes }, (_, episodeNumber: number) => (
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
            ))}
          </SimpleGrid>
        </>
      )}
    </>
  );
}
