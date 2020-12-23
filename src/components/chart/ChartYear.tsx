import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import type { DiaryAddWithId, MediaTypes } from "../../config/types";
import { fuegoChartYear } from "../../interfaces/fuegoChartActions";
import MdLoader from "../md/MdLoader";
import { ChartVizRating, ChartVizReleased } from "./ChartViz";

function ChartYear({ uid, year }: { uid: string; year: number }): JSX.Element {
  const [mediaType, setMediaType] = useState<MediaTypes | null>(null);
  const [includeSeen, setIncludeSeen] = useState(false);
  const filterButtonSize = useBreakpointValue({ base: "xs", md: "sm" });
  const { data, error } = useSWR<DiaryAddWithId[]>(
    ["/fuego/chartYear", uid, year, mediaType, includeSeen],
    fuegoChartYear,
    { revalidateOnFocus: false }
  );

  if (error) {
    if (error) {
      console.error(error);
    }
    return <div>An error happened</div>;
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" pt={16}>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text color="gray.500" mr={2} fontSize="sm">
            Filter:
          </Text>
          <Box>
            <FilterButton title="All" type={null} />
            <FilterButton title="By Movie" type="movie" />
            <FilterButton title="By Tv" type="tv" />
            <FilterButton title="By Album" type="album" />
          </Box>
        </Flex>
        <Flex alignItems="center">
          <Tooltip label="Include Repeated Media">
            <IconButton
              variant={includeSeen ? undefined : "outline"}
              colorScheme={includeSeen ? "purple" : undefined}
              icon={<RepeatIcon color={includeSeen ? "gray.50" : "gray.700"} />}
              aria-label="Repeated Viewed"
              size={filterButtonSize}
              onClick={() => setIncludeSeen(!includeSeen)}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <FilterCharts />
    </>
  );

  function FilterCharts() {
    if (data) {
      if (data && data.length < 1) {
        return <div>no data</div>;
      }

      const ratingCount = data.reduce((a, c) => {
        a[c.rating * 2] += 1;
        return a;
      }, Array(11).fill(0));

      const yearList = data.reduce<{ [key: string]: number }>((a, c) => {
        if (typeof a[c.releasedYear] === "undefined") {
          a[c.releasedYear] = 1;
        } else {
          ++a[c.releasedYear];
        }
        return a;
      }, {});
      return (
        <>
          <ChartVizRating list={ratingCount} />
          <ChartVizReleased list={yearList} />
        </>
      );
    }
    return <MdLoader />;
  }

  function FilterButton({
    title,
    type,
  }: {
    title: string;
    type: MediaTypes | null;
  }) {
    return (
      <Button
        onClick={() => setMediaType(type)}
        variant={type === mediaType ? undefined : "outline"}
        size={filterButtonSize}
        colorScheme="purple"
        mr={2}
      >
        {title}
      </Button>
    );
  }
}

export default ChartYear;
