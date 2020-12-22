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
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import type { MediaTypes } from "../config/types";
import { useMDDispatch, useMDState } from "../config/store";
import useFuegoUser from "../hooks/useFuegoUser";
import { fuegoFiltersAll } from "../interfaces/fuegoActions";
import AlbumIcon from "./icons/AlbumIcon";
import FilmIcon from "./icons/FilmIcon";
import TvIcon from "./icons/TvIcon";
import MdLoader from "./md/MdLoader";
import MdLogo from "./md/MdLogo";
import MdRating from "./md/MdRating";

function Filters({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const { user } = useFuegoUser();

  const { data } = useSWR(
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

function FiltersData({ data, onClose }: { data: any; onClose: () => void }) {
  const {
    filterMediaType,
    filterRating,
    filterDiaryYear,
    filterReleasedDecade,
    filterLoggedBefore,
    filterGenre,
  } = useMDState();

  const dispatch = useMDDispatch();
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
  const [diaryYear, setDiaryYear] = useState(filterDiaryYear);

  return (
    <>
      <DrawerBody px={{ base: 0, sm: 8 }}>
        <Box>
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
                {Object.keys(data.filterMediaType)
                  .filter((i) => data.filterMediaType[i] !== 0)
                  .map((e) => {
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
        <Box my={8}>
          <Heading size="md">Rating</Heading>
          <Divider mt={2} mb={4} />
          <Flex alignItems="center">
            <MdRating
              initialRating={rating ?? 0}
              wh={{ base: "25px", sm: "15px", md: "25px" }}
              onChange={(val) => setRating(val)}
            />
            {rating !== null && (
              <CloseButton onClick={() => setRating(null)} size="sm" ml={2} />
            )}
          </Flex>
        </Box>
        <Box my={8}>
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
                {Object.keys(data.filterReleasedDecade)
                  .filter((f) => data.filterReleasedDecade[f] !== 0)
                  .reverse()
                  .map((e) => (
                    <option key={`releasedDate_${e}`} value={e}>
                      {e}
                    </option>
                  ))}
              </Select>
            )}
        </Box>
        <Box my={8}>
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
        <Box my={8}>
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
                {Object.keys(data.filterGenre)
                  .filter((f) => data.filterGenre[f] !== 0)
                  .map((e) => (
                    <option key={`genres_${e}`} value={e}>
                      {e}
                    </option>
                  ))}
              </Select>
            )}
        </Box>
        <Box my={8}>
          <Heading size="md">Diary Year</Heading>
          <Divider mt={2} mb={4} />
          {typeof data.filterDiaryYear !== "undefined" &&
            Object.keys(data.filterDiaryYear).length > 0 && (
              <Select
                onChange={(e) =>
                  setDiaryYear(
                    e.target.value === "all" ? null : parseInt(e.target.value)
                  )
                }
                value={diaryYear ?? "all"}
              >
                <option value="all">All</option>
                {Object.keys(data.filterDiaryYear)
                  .filter((f) => data.filterDiaryYear[f] !== 0)
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
}

export default Filters;
