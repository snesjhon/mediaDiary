import { StarIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, Heading, useToken } from "@chakra-ui/react";
import React from "react";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";

export function ChartVizRating({ list }: { list: number[] }): JSX.Element {
  const [gray400] = useToken("colors", ["gray.400"]);

  const ratingCount = list
    .map((e, i) => ({ rating: i / 2, count: e === 0 ? 0.05 : e }))
    .slice(1);

  return (
    <Box mt={10}>
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
  );
}

export function ChartVizReleased({
  list,
}: {
  list: {
    [key: string]: number;
  };
}): JSX.Element {
  const [gray400] = useToken("colors", ["gray.400"]);

  const listKeys = Object.keys(list).sort();
  const listComplete: { year: number; count: number }[] = [];

  for (
    let i = parseInt(listKeys[0]);
    i <= parseInt(listKeys[listKeys.length - 1]);
    i++
  ) {
    if (typeof list[i] !== "undefined") {
      listComplete.push({
        year: i,
        count: list[i],
      });
    } else {
      listComplete.push({
        year: i,
        count: 0.05,
      });
    }
  }
  return (
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
            listComplete[0].year,
            listComplete[listComplete.length - 1].year,
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
          data={listComplete}
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
  );
}

function RatingIcon() {
  return <StarIcon color="purple.400" w="15px" h="15px" />;
}
