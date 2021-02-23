import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import type { FuegoValidatedUser, MediaType } from "../config/types";
import type { FilterData } from "../config/typesFilters";
import { fuegoFiltersAll } from "../interfaces/fuegoFilterActions";
import { capFormat } from "../utils/helpers";
import ChartAll from "./chart/ChartAll";
import ChartYear from "./chart/ChartYear";
import AlbumIcon from "./icons/AlbumIcon";
import LogoFilm from "./icons/FilmIcon";
import LayersIcon from "./icons/LayersIcon";
import TvIcon from "./icons/TvIcon";
import MdEmpty from "./md/MdEmpty";
import MdLoader from "./md/MdLoader";
import MdStatus from "./md/MdStatus";

function Charts({ user }: { user: FuegoValidatedUser }): JSX.Element {
  const [yearType, setYearType] = useState<number | null>(null);
  const [localMediaType, setMediaType] = useState<MediaType | null>(null);
  const { data, error, isValidating } = useSWR<FilterData>(
    ["fuego/chartCounts", user.uid],
    fuegoFiltersAll,
    {
      revalidateOnFocus: false,
    }
  );

  // There's an error on the list, or the list is empty
  if (error) {
    console.error(error);
    return <MdStatus title="There was an Error, please contact Admin" />;
  }

  if (!data && isValidating) return <MdLoader />;
  if (!data && !isValidating) return <MdStatus title="No Memories" />;

  if (data) {
    // We either have a no items in our list, or the user has removed all items in the list. But we've
    // kept all of the keys. Thus needing to reduce to a single count
    const isEmpty =
      Object.keys(data.diaryYear).length === 0
        ? true
        : Object.keys(data.diaryYear).reduce(
            (a, c) => (a += data.diaryYear[c]),
            0
          ) === 0;
    if (isEmpty) {
      return <MdEmpty />;
    }

    const { diaryYear, mediaType } = data;
    const dataCounts = Object.keys(mediaType)
      .filter((e) => (yearType === null ? e : parseInt(e) === yearType))
      .reduce<{ [key: string]: number }>((a, c) => {
        Object.keys(mediaType[c]).map((e) => {
          if (mediaType[c][e] > 0) {
            if (typeof a[e] !== "undefined") {
              a[e] += mediaType[c][e];
            } else {
              a[e] = mediaType[c][e];
            }
          }
        });
        return a;
      }, {});

    return (
      <Box
        py={10}
        borderLeftWidth={{ base: 0, md: "1px" }}
        borderRightWidth={{ base: 0, md: "1px" }}
        px={{ md: 8 }}
      >
        <Center>
          {Object.keys(diaryYear).length > 0 ? (
            <Flex alignItems="flex-end">
              <Heading
                size={yearType === null ? "4xl" : undefined}
                color={yearType !== null ? "gray.500" : undefined}
                onClick={() => newYearHandler(null)}
                cursor={yearType !== null ? "pointer" : undefined}
                _hover={{
                  color: yearType !== null ? "gray.400" : undefined,
                }}
              >
                All
              </Heading>
              {Object.keys(diaryYear)
                .reverse()
                .map((e) => {
                  const yearInt = parseInt(e);
                  const isActive = yearType === yearInt;
                  return (
                    <Heading
                      key={`listyear_${e}`}
                      size={isActive ? "4xl" : undefined}
                      color={!isActive ? "gray.500" : undefined}
                      onClick={() => newYearHandler(yearInt)}
                      pl={3}
                      cursor={!isActive ? "pointer" : undefined}
                      _hover={{
                        color: !isActive ? "gray.400" : undefined,
                      }}
                    >
                      {e}
                    </Heading>
                  );
                })}
            </Flex>
          ) : (
            <Heading size="4xl" as="h1">
              ALL
            </Heading>
          )}
        </Center>
        <Flex alignItems="center" justifyContent="center" mt={4}>
          {user.photoURL !== null && <Avatar src={user.photoURL} size="sm" />}
          {user.displayName !== null && (
            <Text fontWeight="semibold" ml={3} color="gray.500">
              {user.displayName}&apos;s year to date
            </Text>
          )}
        </Flex>
        <Divider my={10} />
        <Grid
          gridTemplateColumns={`repeat(${
            Object.keys(dataCounts).length + 1
          }, 1fr)`}
          gridColumnGap={6}
          justifyContent="center"
        >
          <SimpleGrid
            row={2}
            textAlign="center"
            onClick={() => setMediaType(null)}
            cursor="pointer"
          >
            <Heading
              size="md"
              color={localMediaType === null ? "purple.500" : undefined}
            >
              <LayersIcon mr={2} boxSize={4} mb={1} />
              {Object.keys(dataCounts).reduce(
                (a, c) => (a += dataCounts[c]),
                0
              )}
            </Heading>
            <Text color={localMediaType === null ? "purple.500" : undefined}>
              Memories
            </Text>
          </SimpleGrid>
          {Object.keys(dataCounts)
            .sort()
            .map((e) => {
              const StatIcon =
                e === "tv" ? TvIcon : e === "album" ? AlbumIcon : LogoFilm;
              return (
                <SimpleGrid
                  key={`statIcon_${e}`}
                  row={2}
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => setMediaType(e as MediaType)}
                  _hover={{
                    color: "purple.500",
                  }}
                >
                  <Heading
                    size="md"
                    color={localMediaType === e ? "purple.500" : undefined}
                  >
                    <StatIcon
                      boxSize={4}
                      mb={1}
                      color={localMediaType === e ? "purple.500" : undefined}
                    />{" "}
                    {dataCounts[e]}
                  </Heading>
                  <Text color={localMediaType === e ? "purple.500" : undefined}>
                    {capFormat(e, {
                      allCaps: e === "tv",
                      isPlural: dataCounts[e] > 1,
                    })}
                  </Text>
                </SimpleGrid>
              );
            })}
        </Grid>
        <Divider my={10} />
        {yearType === null && localMediaType === null && (
          <ChartAll uid={user.uid} list={data} />
        )}
        {yearType === null && localMediaType !== null && (
          <ChartYear uid={user.uid} mediaType={localMediaType} year={null} />
        )}
        {yearType !== null && (
          <ChartYear
            uid={user.uid}
            mediaType={localMediaType}
            year={yearType}
          />
        )}
      </Box>
    );
  }

  return <MdLoader />;

  function newYearHandler(year: number | null) {
    setMediaType(null);
    return setYearType(year);
  }
}

export default Charts;
