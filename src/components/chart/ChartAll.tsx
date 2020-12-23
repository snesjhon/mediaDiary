import { StarIcon } from "@chakra-ui/icons";
import { Box, Heading, Divider, Flex, useToken } from "@chakra-ui/react";
import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";
import type { FilterData } from "../../config/types";

function ChartAll({ data }: { data: FilterData }): JSX.Element {
  const [gray400, purple700] = useToken("colors", ["gray.400", "purple.300"]);
  const { filterRating, filterReleasedYear } = data;
  const ratingCount = Object.keys(filterRating)
    .reduce((a, c) => {
      Object.keys(filterRating[c]).forEach((i) => {
        a[parseInt(i)] += filterRating[c][i];
      });
      return a;
    }, Array(11).fill(0))
    .map((e, i) => ({ rating: i / 2, count: e === 0 ? 0.05 : e }))
    .slice(1);

  const yearList = Object.keys(filterReleasedYear).reduce<{
    [key: string]: number;
  }>((a, c) => {
    Object.keys(filterReleasedYear[c]).forEach((i) => {
      if (filterReleasedYear[c][i] > 0) {
        a[i] = filterReleasedYear[c][i];
      }
    });
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

  function RatingIcon() {
    return <StarIcon color="purple.400" w="15px" h="15px" />;
  }
}
export default ChartAll;
