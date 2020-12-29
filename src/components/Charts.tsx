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
import type { FilterData, MediaTypes } from "../config/types";
import { fuegoFiltersAll } from "../interfaces/fuegoFilterActions";
import type { FuegoValidatedUser } from "../interfaces/fuegoProvider";
import ChartAll from "./chart/ChartAll";
import ChartYear from "./chart/ChartYear";
import AlbumIcon from "./icons/AlbumIcon";
import LogoFilm from "./icons/FilmIcon";
import LayersIcon from "./icons/LayersIcon";
import TvIcon from "./icons/TvIcon";
import MdLoader from "./md/MdLoader";
import MdStatus from "./md/MdStatus";

function Charts({ user }: { user: FuegoValidatedUser }): JSX.Element {
  const [yearType, setYearType] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<MediaTypes | null>(null);
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
    const { filterDiaryYear, filterMediaType } = data;
    const dataCounts = Object.keys(filterMediaType)
      .filter((e) => (yearType === null ? e : parseInt(e) === yearType))
      .reduce<{ [key: string]: number }>((a, c) => {
        Object.keys(filterMediaType[c]).map((e) => {
          if (filterMediaType[c][e] > 0) {
            if (typeof a[e] !== "undefined") {
              a[e] += filterMediaType[c][e];
            } else {
              a[e] = filterMediaType[c][e];
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
          {Object.keys(filterDiaryYear).length > 0 ? (
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
              {Object.keys(filterDiaryYear)
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
              color={mediaType === null ? "purple.500" : undefined}
            >
              <LayersIcon mr={2} boxSize={4} mb={1} />
              {Object.keys(dataCounts).reduce(
                (a, c) => (a += dataCounts[c]),
                0
              )}
            </Heading>
            <Text color={mediaType === null ? "purple.500" : undefined}>
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
                  onClick={() => setMediaType(e as MediaTypes)}
                  _hover={{
                    color: "purple.500",
                  }}
                >
                  <Heading
                    size="md"
                    color={mediaType === e ? "purple.500" : undefined}
                  >
                    <StatIcon
                      boxSize={4}
                      mb={1}
                      color={mediaType === e ? "purple.500" : undefined}
                    />{" "}
                    {dataCounts[e]}
                  </Heading>
                  <Text color={mediaType === e ? "purple.500" : undefined}>
                    {e}
                  </Text>
                </SimpleGrid>
              );
            })}
        </Grid>
        <Divider my={10} />
        {yearType === null && mediaType === null && (
          <ChartAll uid={user.uid} list={data} />
        )}
        {yearType === null && mediaType !== null && (
          <ChartYear uid={user.uid} mediaType={mediaType} year={null} />
        )}
        {yearType !== null && (
          <ChartYear uid={user.uid} mediaType={mediaType} year={yearType} />
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
