import { RepeatIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  Tooltip,
  useBreakpointValue,
  useToken,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import type { DiaryAddWithId, MediaTypes } from "../../config/types";
import { fuegoChartYear } from "../../interfaces/fuegoActions";
import MdLoader from "../md/MdLoader";

function ChartYear({ uid, year }: { uid: string; year: number }): JSX.Element {
  const [gray400] = useToken("colors", ["gray.400"]);
  const [mediaType, setMediaType] = useState<MediaTypes | null>(null);
  const [includeSeen, setIncludeSeen] = useState(false);
  const filterButtonSize = useBreakpointValue({ base: "xs", md: "sm" });
  const { data, error } = useSWR<DiaryAddWithId[]>(
    ["/fuego/chartYear", uid, year, mediaType, includeSeen],
    fuegoChartYear,
    { revalidateOnFocus: false }
  );

  if (error || (data && Object.keys(data).length === 0)) {
    if (error) {
      console.error(error);
    }
    return <div>nothing in this list</div>;
  }

  if (data) {
    const ratingCount = data
      .reduce((a, c) => {
        a[c.rating * 2] += 1;
        return a;
      }, Array(11).fill(0))
      .map((e, i) => ({ rating: i / 2, count: e === 0 ? 0.05 : e }));

    const yearList = data.reduce<{ [key: string]: number }>((a, c) => {
      if (typeof a[c.releasedYear] === "undefined") {
        a[c.releasedYear] = 1;
      } else {
        ++a[c.releasedYear];
      }
      return a;
    }, {});

    const yearListKeys = Object.keys(yearList).sort();

    const yearListComplete: { year: number; count: number }[] = [];
    for (
      let i = parseInt(yearListKeys[0]);
      i <= parseInt(yearListKeys[yearListKeys.length - 1]);
      i++
    ) {
      if (typeof yearList[i] !== "undefined") {
        yearListComplete.push({
          year: i,
          count: yearList[i],
        });
      } else {
        yearListComplete.push({
          year: i,
          count: 0.05,
        });
      }
    }

    return (
      <>
        <Flex alignItems="center" justifyContent="space-between" pb={10}>
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
                icon={
                  <RepeatIcon color={includeSeen ? "gray.50" : "gray.700"} />
                }
                aria-label="Repeated Viewed"
                size={filterButtonSize}
                onClick={() => setIncludeSeen(!includeSeen)}
              />
            </Tooltip>
          </Flex>
        </Flex>
        <Box mt={16}>
          <Heading size="lg">Rating Distribution</Heading>
          <Divider mt={3} mb={6} />
          <Flex alignItems="flex-end">
            <RatingIcon />
            <VictoryBar
              barRatio={1.2}
              data={ratingCount}
              x="rating"
              y="count"
              height={75}
              padding={{ top: 0, bottom: 0, left: 30, right: 30 }}
              style={{
                data: {
                  fill: gray400,
                },
              }}
            />
            <Flex>
              <RatingIcon />
              <RatingIcon />
              <RatingIcon />
              <RatingIcon />
              <RatingIcon />
            </Flex>
          </Flex>
        </Box>
        <Box mt={16}>
          <Heading size="lg">By Release year</Heading>
          <Divider mt={3} mb={6} />
          <VictoryChart
            domainPadding={0}
            height={100}
            padding={{ top: 20, bottom: 40, left: 20, right: 20 }}
          >
            <VictoryAxis
              tickValues={[
                yearListComplete[0].year,
                yearListComplete[yearListComplete.length - 1].year,
              ]}
              tickCount={2}
              tickFormat={(t) => Math.round(t)}
              style={{
                axis: {
                  strokeWidth: 0,
                },
              }}
            />
            <VictoryBar
              barRatio={0.75}
              data={yearListComplete}
              x="year"
              y="count"
              style={{
                data: {
                  fill: gray400,
                },
              }}
            />
          </VictoryChart>
        </Box>
      </>
    );
  }

  return <MdLoader />;

  function RatingIcon() {
    return <StarIcon color="purple.400" w="15px" h="15px" />;
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
