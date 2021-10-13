import { useMDState, useMDDispatch } from "@/config";
import { AlbumIcon, FilmIcon, TvIcon } from "@/icons";
import { ContentFooter } from "@/src/components/Content";
import type { MediaType } from "@/types";
import { capFormat } from "@/utils";
import {
  Box,
  Button,
  Divider,
  DrawerBody,
  Flex,
  Heading,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useCheckboxGroup,
  useColorMode,
} from "@chakra-ui/react";
import React, { useState } from "react";
import type { FilterData, FilterDiary } from "../../config";

const ratingSelect: { [key: string]: string } = {
  1: "½",
  2: "⭑",
  3: "⭑ ½",
  4: "⭑⭑",
  5: "⭑⭑ ½",
  6: "⭑⭑⭑",
  7: "⭑⭑⭑ ½",
  8: "⭑⭑⭑⭑",
  9: "⭑⭑⭑⭑ ½",
  10: "⭑⭑⭑⭑⭑",
};

export default function FiltersContent({
  data,
  onClose,
}: {
  data: FilterData;
  onClose: () => void;
}): JSX.Element {
  const { diaryFilters } = useMDState();
  // Using optional chaining and nullish because I want to ALWAYS return null if diaryFilters undefined
  const mediaType = diaryFilters?.mediaType ?? null;
  const rating = diaryFilters?.rating ?? null;
  const diaryYear = diaryFilters?.diaryYear ?? null;
  const releasedDecade = diaryFilters?.releasedDecade ?? null;
  const loggedBefore = diaryFilters?.loggedBefore ?? null;
  const genre = diaryFilters?.genre ?? null;

  const dispatch = useMDDispatch();

  const { colorMode } = useColorMode();

  const [localDiaryYear, setDiaryYear] = useState(diaryYear);
  const {
    value: localMediaTypes,
    onChange: mediaTypesOnChange,
    setValue,
  } = useCheckboxGroup({
    defaultValue: mediaType ?? [],
  });
  const [localRating, setRating] = useState(
    rating !== null ? (rating === 0 ? "no" : ratingSelect[rating * 2]) : null
  );
  const [localReleasedDecade, setReleasedDecade] = useState(releasedDecade);
  const [localLoggedBefore, setLoggedBefore] = useState(loggedBefore);
  const [localGenre, setGenre] = useState(genre);

  const ratingKey = Object.keys(ratingSelect).find(
    (key) => ratingSelect[key] === localRating
  );
  return (
    <>
      <DrawerBody px={0}>
        <Box bg={colorMode === "light" ? "gray.50" : "gray.600"} p={4}>
          <Heading size="md">Diary Year</Heading>
          <Divider mt={2} mb={4} />
          {typeof data.diaryYear !== "undefined" &&
            Object.keys(data.diaryYear).length > 0 && (
              <Select
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (localDiaryYear !== null) {
                    if (value !== localDiaryYear) {
                      setValue([]);
                      setRating(null);
                      setReleasedDecade(null);
                      setLoggedBefore(null);
                      setGenre(null);
                      setDiaryYear(value === 0 ? null : value);
                    }
                  } else {
                    setValue([]);
                    setRating(null);
                    setReleasedDecade(null);
                    setLoggedBefore(null);
                    setGenre(null);
                    setDiaryYear(value);
                  }
                }}
                value={localDiaryYear ?? 0}
              >
                <option value={0}>All</option>
                {Object.keys(data.diaryYear)
                  .filter((f) => data.diaryYear[f] !== 0)
                  .reverse()
                  .map((e) => (
                    <option key={`genres_${e}`} value={e}>
                      {e}
                    </option>
                  ))}
              </Select>
            )}
        </Box>
        <Box p={4}>
          <Heading size="md">Media Types</Heading>
          <Divider mt={2} mb={4} />
          {typeof data.mediaType !== "undefined" &&
            Object.keys(data.mediaType).length > 0 && (
              <HStack spacing={6}>
                <Box textAlign="center">
                  <IconButton
                    variant={
                      localMediaTypes.length === 0 ? undefined : "outline"
                    }
                    colorScheme="purple"
                    aria-label="Filter by All"
                    size="lg"
                    icon={<FilmIcon />}
                    onClick={() => setValue([])}
                  />
                  <Text>All</Text>
                </Box>
                {createMediaKeys("mediaType")
                  .sort()
                  .map((e) => {
                    const typeActive = localMediaTypes.includes(e);
                    let typeIcon = <FilmIcon />;
                    if (e === "tv") {
                      typeIcon = <TvIcon />;
                    } else if (e === "album") {
                      typeIcon = <AlbumIcon />;
                    }
                    return (
                      <Box key={`filterMedia_${e}`} textAlign="center">
                        <IconButton
                          variant={typeActive ? undefined : "outline"}
                          colorScheme="purple"
                          aria-label="Filter by TV"
                          onClick={() => mediaTypesOnChange(e)}
                          icon={typeIcon}
                          size="lg"
                        />
                        <Text>{capFormat(e, { allCaps: e === "tv" })}</Text>
                      </Box>
                    );
                  })}
              </HStack>
            )}
        </Box>
        <Box p={4}>
          <Heading size="md">Rating</Heading>
          <Divider mt={2} mb={4} />
          <Flex alignItems="center">
            <Select
              onChange={(e) =>
                setRating(e.target.value === "all" ? null : e.target.value)
              }
              color={
                localRating === null || localRating === "no"
                  ? undefined
                  : "purple.500"
              }
              value={localRating === null ? "all" : localRating}
            >
              <option value="all">All Ratings</option>
              {[...Array(10)]
                .map((e, i) => (
                  <option value={ratingSelect[i + 1]} key={`ratingCount_${i}`}>
                    {ratingSelect[i + 1]}
                  </option>
                ))
                .reverse()}
              <option value="no">No Rating</option>
            </Select>
          </Flex>
        </Box>
        <Box p={4}>
          <Heading size="md">Decade</Heading>
          <Divider mt={2} mb={4} />
          {typeof data.releasedDecade !== "undefined" &&
            Object.keys(data.releasedDecade).length > 0 && (
              <Select
                onChange={(e) =>
                  setReleasedDecade(
                    e.target.value === "all" ? null : parseInt(e.target.value)
                  )
                }
                value={
                  releasedDecade === null ? "all" : releasedDecade.toString()
                }
              >
                <option value="all">All</option>
                {createMediaKeys("releasedDecade")
                  .reverse()
                  .map((e) => (
                    <option key={`releasedDate_${e}`} value={e}>
                      {e}
                    </option>
                  ))}
              </Select>
            )}
        </Box>
        <Box p={4}>
          <Heading size="md">Logged Before</Heading>
          <Divider mt={2} mb={4} />
          <RadioGroup
            value={
              typeof localLoggedBefore !== "undefined" &&
              localLoggedBefore === null
                ? "all"
                : localLoggedBefore.toString()
            }
            onChange={(val) => {
              if (val === "all") {
                setLoggedBefore(null);
              } else if (val === "true") {
                setLoggedBefore(true);
              } else if (val === "false") {
                setLoggedBefore(false);
              }
            }}
          >
            <Stack spacing={4} direction="row">
              <Radio value="all">All</Radio>
              <Radio value="true">True</Radio>
              <Radio value="false">False</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box p={4}>
          <Heading size="md">Genre</Heading>
          <Divider mt={2} mb={4} />
          {typeof data.genre !== "undefined" &&
            Object.keys(data.genre).length > 0 && (
              <Select
                onChange={(e) =>
                  setGenre(e.target.value === "all" ? null : e.target.value)
                }
                value={localGenre ?? "all"}
              >
                <option value="all">All</option>
                {createMediaKeys("genre")
                  .sort()
                  .map((e) => (
                    <option key={`genres_${e}`} value={e}>
                      {e}
                    </option>
                  ))}
              </Select>
            )}
        </Box>
      </DrawerBody>
      <ContentFooter>
        {(localMediaTypes.length !== 0 ||
          rating !== null ||
          releasedDecade !== null ||
          loggedBefore !== null ||
          genre !== null ||
          diaryYear !== null) && (
          <Button
            colorScheme="red"
            variant="outline"
            mr="auto"
            onClick={() => {
              setValue([]);
              setRating(null);
              setReleasedDecade(null);
              setLoggedBefore(null);
              setGenre(null);
              setDiaryYear(null);
            }}
          >
            Reset
          </Button>
        )}
        <Button
          colorScheme="purple"
          variant="outline"
          onClick={() => {
            onClose();
            return dispatch({
              type: "filter",
              payload: {
                mediaType:
                  localMediaTypes.length === 0
                    ? null
                    : (localMediaTypes as MediaType[]),
                genre: localGenre,
                loggedBefore: localLoggedBefore,
                rating:
                  localRating === "no"
                    ? 0
                    : typeof ratingKey !== "undefined"
                    ? parseInt(ratingKey) / 2
                    : null,
                releasedDecade: localReleasedDecade,
                releasedYear: null, // TODO: This isn't implemented, but needed for the Type
                diaryYear: localDiaryYear,
              },
            });
          }}
        >
          Save
        </Button>
      </ContentFooter>
    </>
  );

  function createMediaKeys(
    type: keyof Omit<FilterDiary, "diaryYear">
  ): string[] {
    return Object.keys(data[type])
      .filter((e) =>
        localDiaryYear === null ? e : parseInt(e) === localDiaryYear
      )
      .reduce<string[]>((a, c) => {
        Object.keys(data[type][c]).map((e) => {
          if (data[type][c][e] > 0) {
            a.push(e);
          }
        });
        return [...new Set(a)];
      }, []);
  }
}
