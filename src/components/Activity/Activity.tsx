import { LayersIcon, TvIcon, AlbumIcon, FilmIcon } from "@/icons";
import type { MediaType, UserFuegoValidated } from "@/types";
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
  useColorMode,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import { fuegoFiltersAll } from "../Filters/config";
import type { FilterData } from "../Filters/config";
import { ActivityAll, ActivityYear } from "./components";
import { MdStatus, MdLoader, MdEmpty } from "@/md";
import { capFormat, useIsBreakpoint } from "@/utils";

function Activity({ user }: { user: UserFuegoValidated }): JSX.Element {
  const [yearType, setYearType] = useState<number | null>(null);
  const [localMediaType, setMediaType] = useState<MediaType | null>(null);
  const { colorMode } = useColorMode();
  const isMd = useIsBreakpoint("md");
  const { data, error, isValidating } = useSWR<FilterData>(
    ["fuego/chartCounts", user.uid],
    fuegoFiltersAll,
    {
      revalidateOnFocus: false,
    }
  );
  const yearHeadingActive = isMd ? "2xl" : "xl";
  const yearHeadingInActive = isMd ? "xl" : "lg";

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
    const dataCountsLength = Object.keys(dataCounts).length + 1;

    return (
      <Box
        py={10}
        borderLeftWidth={{ base: 0, md: "1px" }}
        borderRightWidth={{ base: 0, md: "1px" }}
        px={{ md: 4 }}
      >
        <Flex alignItems="center" justifyContent="center" mb={4}>
          {user.photoURL !== null && <Avatar src={user.photoURL} size="sm" />}
          {user.displayName !== null && (
            <Text fontWeight="semibold" ml={3} color="gray.500">
              {user.displayName}&apos;s year to date
            </Text>
          )}
        </Flex>
        <Center>
          {Object.keys(diaryYear).length > 0 ? (
            <Flex alignItems="flex-end">
              <Heading
                size={
                  yearType === null ? yearHeadingActive : yearHeadingInActive
                }
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
                      size={isActive ? yearHeadingActive : yearHeadingInActive}
                      color={!isActive ? "gray.500" : undefined}
                      onClick={() => newYearHandler(yearInt)}
                      pl={isMd ? 10 : 5}
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
        <Divider mt={10} mb="6" />
        <SimpleGrid
          columns={isMd ? dataCountsLength : 2}
          bg={colorMode === "light" ? "gray.50" : "gray.700"}
          p="8"
          justifyItems="center"
        >
          <Flex
            textAlign="center"
            onClick={() => setMediaType(null)}
            cursor="pointer"
            mb={!isMd && dataCountsLength >= 4 ? "8" : undefined}
          >
            <Heading
              size={isMd ? "2xl" : "xl"}
              fontWeight="normal"
              color={localMediaType === null ? "purple.500" : undefined}
            >
              {Object.keys(dataCounts).reduce(
                (a, c) => (a += dataCounts[c]),
                0
              )}
            </Heading>
            <Box pl="2">
              <LayersIcon boxSize={6} />
              <Text color={localMediaType === null ? "purple.500" : undefined}>
                Memories
              </Text>
            </Box>
          </Flex>
          {Object.keys(dataCounts)
            .sort()
            .map((e) => {
              const StatIcon =
                e === "tv" ? TvIcon : e === "album" ? AlbumIcon : FilmIcon;
              return (
                <Flex
                  key={`statIcon_${e}`}
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => setMediaType(e as MediaType)}
                  _hover={{
                    color: "purple.500",
                  }}
                >
                  <Heading
                    size={isMd ? "2xl" : "xl"}
                    fontWeight="normal"
                    color={localMediaType === e ? "purple.500" : undefined}
                  >
                    {dataCounts[e]}
                  </Heading>
                  <Box pl="2">
                    <StatIcon
                      boxSize={6}
                      color={localMediaType === e ? "purple.500" : undefined}
                    />
                    <Text
                      color={localMediaType === e ? "purple.500" : undefined}
                    >
                      {capFormat(e, {
                        allCaps: e === "tv",
                        isPlural: dataCounts[e] > 1,
                      })}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
        </SimpleGrid>
        {yearType === null && localMediaType === null && (
          <ActivityAll uid={user.uid} list={data} />
        )}
        {yearType === null && localMediaType !== null && (
          <ActivityYear uid={user.uid} mediaType={localMediaType} year={null} />
        )}
        {yearType !== null && (
          <ActivityYear
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

export default Activity;
