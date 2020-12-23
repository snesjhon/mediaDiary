import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import type { FilterData } from "../config/types";
import { fuegoFiltersAll } from "../interfaces/fuegoActions";
import type { FuegoValidatedUser } from "../interfaces/fuegoProvider";
import LogoFilm from "./icons/FilmIcon";
import MdLoader from "./md/MdLoader";

function Charts({ user }: { user: FuegoValidatedUser }): JSX.Element {
  const [yearType, setYearType] = useState<number | null>(null);
  const { data, error } = useSWR<FilterData>(
    yearType === null ? ["/fuego/chartCounts", user.uid] : null,
    fuegoFiltersAll,
    {
      revalidateOnFocus: false,
    }
  );

  // There's an error on the list, or the list is empty
  if (error) {
    return <div>nothing in this list</div>;
  }

  if (!data) {
    return <MdLoader />;
  } else {
    const { filterDiaryYear, filterMediaType } = data;
    const dataCounts = Object.keys(filterMediaType)
      .filter((e) => (yearType === null ? e : parseInt(e) === yearType))
      .reduce<{ [key: string]: number }>((a, c) => {
        Object.keys(filterMediaType[c]).map((e) => {
          if (filterMediaType[c][e] > 0) {
            a[e] = filterMediaType[c][e];
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
                onClick={() => setYearType(null)}
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
                      onClick={() => setYearType(yearInt)}
                      pl={3}
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
        <StatGroup textAlign="center">
          {Object.keys(dataCounts).map((e) => (
            <Stat key={`activity_${e}`}>
              <StatLabel>
                <LogoFilm /> {e}
              </StatLabel>
              <StatNumber>{dataCounts[e]}</StatNumber>
            </Stat>
          ))}
        </StatGroup>
        <Divider my={10} />
      </Box>
    );
  }
}

export default Charts;
