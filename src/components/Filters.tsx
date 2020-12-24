import {
  Box,
  Button,
  CloseButton,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
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
import useSWR from "swr";
import { useMDDispatch, useMDState } from "../config/store";
import type { FilterData, Filters, MediaTypes } from "../config/types";
import useFuegoUser from "../hooks/useFuegoUser";
import { fuegoFiltersAll } from "../interfaces/fuegoFilterActions";
import AlbumIcon from "./icons/AlbumIcon";
import FilmIcon from "./icons/FilmIcon";
import TvIcon from "./icons/TvIcon";
import MdLoader from "./md/MdLoader";
import MdLogo from "./md/MdLogo";
import MdRating from "./md/MdRating";

function FiltersContainer({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const { user } = useFuegoUser();

  const { data } = useSWR<FilterData>(
    user && user !== null ? ["/filters/all", user.uid] : null,
    fuegoFiltersAll
  );

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay sx={{ zIndex: 2 }}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader pt={3} pb={2}>
            <MdLogo title="Filters" />
          </DrawerHeader>
          {data ? (
            <FiltersData data={data} onClose={onClose} />
          ) : (
            <DrawerBody px={{ base: 0, sm: 8 }}>
              <MdLoader />
            </DrawerBody>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

function FiltersData({
  data,
  onClose,
}: {
  data: FilterData;
  onClose: () => void;
}) {
  const {
    filterMediaType,
    filterRating,
    filterDiaryYear,
    filterReleasedDecade,
    filterLoggedBefore,
    filterGenre,
  } = useMDState();
  const dispatch = useMDDispatch();

  const { colorMode } = useColorMode();

  const [diaryYear, setDiaryYear] = useState(filterDiaryYear);
  const {
    value: mediaTypes,
    onChange: mediaTypesOnChange,
    setValue,
  } = useCheckboxGroup({
    defaultValue: filterMediaType ?? [],
  });
  const [rating, setRating] = useState(filterRating);
  const [releasedDecade, setReleasedDecade] = useState(filterReleasedDecade);
  const [loggedBefore, setLoggedBefore] = useState(filterLoggedBefore);
  const [genre, setGenre] = useState(filterGenre);

  return (
    <>
      <DrawerBody px={0}>
        <Box bg={colorMode === "light" ? "gray.50" : "gray.600"} p={4}>
          <Heading size="md">Diary Year</Heading>
          <Divider mt={2} mb={4} />
          {typeof data.filterDiaryYear !== "undefined" &&
            Object.keys(data.filterDiaryYear).length > 0 && (
              <Select
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (diaryYear !== null) {
                    if (value !== diaryYear) {
                      setValue([]);
                      setRating(null);
                      setReleasedDecade(null);
                      setLoggedBefore(null);
                      setGenre(null);
                      setDiaryYear(value);
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
                value={diaryYear ?? 0}
              >
                <option value={0}>All</option>
                {Object.keys(data.filterDiaryYear)
                  .filter((f) => data.filterDiaryYear[f] !== 0)
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
          {typeof data.filterMediaType !== "undefined" &&
            Object.keys(data.filterMediaType).length > 0 && (
              <HStack spacing={6}>
                <Box textAlign="center">
                  <IconButton
                    variant={mediaTypes.length === 0 ? undefined : "outline"}
                    colorScheme="purple"
                    aria-label="Filter by All"
                    size="lg"
                    icon={<FilmIcon />}
                    onClick={() => setValue([])}
                  />
                  <Text>All</Text>
                </Box>
                {createMediaKeys("filterMediaType").map((e) => {
                  const typeActive = mediaTypes.includes(e);
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
                      <Text>{e}</Text>
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
            <MdRating
              initialRating={rating ?? 0}
              wh={{ base: "25px", sm: "25px", md: "25px" }}
              onChange={(val) => setRating(val)}
            />
            {rating !== null && (
              <CloseButton onClick={() => setRating(null)} size="sm" ml={2} />
            )}
          </Flex>
        </Box>
        <Box p={4}>
          <Heading size="md">Decade</Heading>
          <Divider mt={2} mb={4} />
          {typeof data.filterReleasedDecade !== "undefined" &&
            Object.keys(data.filterReleasedDecade).length > 0 && (
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
                {createMediaKeys("filterReleasedDecade")
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
              typeof loggedBefore !== "undefined" && loggedBefore === null
                ? "all"
                : loggedBefore.toString()
            }
            onChange={(val) =>
              setLoggedBefore(val === "all" ? null : val === "true")
            }
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
          {typeof data.filterGenre !== "undefined" &&
            Object.keys(data.filterGenre).length > 0 && (
              <Select
                onChange={(e) =>
                  setGenre(e.target.value === "all" ? null : e.target.value)
                }
                value={genre ?? "all"}
              >
                <option value="all">All</option>
                {createMediaKeys("filterGenre")
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
      <DrawerFooter borderTopWidth="1px">
        {(mediaTypes.length !== 0 ||
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
          colorScheme="blue"
          onClick={() => {
            onClose();
            return dispatch({
              type: "filter",
              payload: {
                filterMediaType:
                  mediaTypes.length === 0 ? null : (mediaTypes as MediaTypes[]),
                filterGenre: genre,
                filterLoggedBefore: loggedBefore,
                filterRating: rating,
                filterReleasedDecade: releasedDecade,
                filterDiaryYear: diaryYear,
              },
            });
          }}
        >
          Save
        </Button>
      </DrawerFooter>
    </>
  );

  function createMediaKeys(
    type: keyof Omit<Filters, "filterDiaryYear">
  ): string[] {
    return Object.keys(data[type])
      .filter((e) => (diaryYear === null ? e : parseInt(e) === diaryYear))
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

export default FiltersContainer;
